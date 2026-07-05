import { create } from 'zustand';
import { supabase } from './supabaseClient';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { PRODUCTS, CATEGORIES } from './productsData';

// 1. AUTH STORE
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setLoading: (loading) => set({ loading }),
  initialize: () => {
    // Check active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ user: session?.user || null, loading: false });
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const sbUser = session?.user || null;
      set({ user: sbUser, loading: false });
      
      if (sbUser) {
        try {
          const { data: userDoc, error: fetchErr } = await supabase
            .from('users')
            .select('*')
            .eq('id', sbUser.id)
            .single();

          if (!userDoc && fetchErr?.code === 'PGRST116') {
            // User does not exist in public.users yet
            await supabase.from('users').insert([{
              id: sbUser.id,
              email: sbUser.email,
              display_name: sbUser.user_metadata?.displayName || 'Velora User',
              photo_url: sbUser.user_metadata?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${sbUser.email}`,
            }]);
          }
        } catch (err) {
          console.error("Error syncing user profile:", err);
        }
      }
    });
  },
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Successfully logged in!');
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message || 'Login failed');
      throw err;
    }
  },
  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: name,
            photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`
          }
        }
      });
      if (error) throw error;
      
      // Some configs might auto-confirm, if so the user is logged in.
      // The onAuthStateChange will handle inserting to public.users
      toast.success('Account created successfully!');
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  },
  loginWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      // Note: toast might not fire here as OAuth redirects the page
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message || 'Google authentication failed');
      throw err;
    }
  },
  loginAsGuest: async () => {
    set({ loading: true, error: null });
    // Fallback local session
    const mockUser = {
      id: 'demo-guest-user',
      email: 'guest@velora.ai',
      user_metadata: {
        displayName: 'Guest Explorer',
        photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest',
      },
      isAnonymous: true
    };
    set({ user: mockUser, loading: false });
    toast.success('Continuing with Guest Session!');
  },
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset link sent to your email.');
    } catch (err) {
      toast.error(err.message || 'Error sending password reset link');
      throw err;
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
      toast.success('Logged out safely.');
    } catch (err) {
      set({ loading: false });
      toast.error('Error logging out');
    }
  }
}));

// 2. PRODUCT STORE (Remains mostly unchanged)
export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  selectedProduct: null,
  comparisonList: [],
  searchQuery: '',
  filter: {},
  fetchProducts: async (queryFilters) => {
    set({ loading: true });
    try {
      const activeFilters = queryFilters || get().filter;
      const response = await axios.get('/api/products', { params: { ...activeFilters, search: get().searchQuery } });
      if (typeof response.data === 'string' || !Array.isArray(response.data)) {
        throw new Error("Received non-JSON or HTML response instead of array.");
      }
      set({ products: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching products:", err);
      let filtered = [...PRODUCTS];
      const activeFilters = queryFilters || get().filter;
      if (activeFilters.category && activeFilters.category !== 'all') {
        filtered = filtered.filter(p => p.category === activeFilters.category);
      }
      if (activeFilters.brand && activeFilters.brand !== 'all') {
        filtered = filtered.filter(p => p.brand.toLowerCase() === String(activeFilters.brand).toLowerCase());
      }
      if (activeFilters.rating) {
        filtered = filtered.filter(p => p.rating >= parseFloat(activeFilters.rating));
      }
      if (activeFilters.maxPrice) {
        filtered = filtered.filter(p => p.price <= parseFloat(activeFilters.maxPrice));
      }
      const search = get().searchQuery;
      if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.keyFeatures.some(f => f.toLowerCase().includes(q))
        );
      }
      set({ products: filtered, loading: false });
    }
  },
  fetchCategories: async () => {
    try {
      const response = await axios.get('/api/categories');
      if (typeof response.data === 'string' || !Array.isArray(response.data)) {
        throw new Error("Received non-JSON or HTML response instead of array.");
      }
      set({ categories: response.data });
    } catch (err) {
      console.error("Error fetching categories:", err);
      set({ categories: CATEGORIES });
    }
  },
  fetchProductById: async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      if (typeof response.data === 'string') {
        throw new Error("Received non-JSON or HTML response.");
      }
      set({ selectedProduct: response.data });
      return response.data;
    } catch (err) {
      let foundInCurrent = get().products.find(p => p.id === id);
      if (!foundInCurrent) {
        foundInCurrent = PRODUCTS.find(p => p.id === id);
      }
      if (foundInCurrent) {
        set({ selectedProduct: foundInCurrent });
        return foundInCurrent;
      }
      return null;
    }
  },
  setSearchQuery: (searchQuery) => {
    set({ searchQuery });
    get().fetchProducts();
  },
  setFilter: (newFilter) => {
    set({ filter: { ...get().filter, ...newFilter } });
    get().fetchProducts();
  },
  resetFilters: () => {
    set({ filter: {}, searchQuery: '' });
    get().fetchProducts({});
  },
  addToComparison: (product) => {
    const list = get().comparisonList;
    if (list.length >= 3) {
      toast.error("You can compare up to 3 products at a time.");
      return;
    }
    if (list.some(p => p.id === product.id)) {
      toast.error("Product already in comparison list.");
      return;
    }
    set({ comparisonList: [...list, product] });
    toast.success(`${product.name} added to compare.`);
  },
  removeFromComparison: (productId) => {
    set({ comparisonList: get().comparisonList.filter(p => p.id !== productId) });
    toast.success("Removed from comparison.");
  },
  clearComparison: () => set({ comparisonList: [] })
}));

// 3. CHAT STORE
export const useChatStore = create((set, get) => ({
  conversations: [],
  activeConversation: null,
  chatLoading: false,
  historyLoading: false,
  fetchConversations: async (userId) => {
    set({ historyLoading: true });
    try {
      let convs = [];
      if (userId && userId !== 'demo-guest-user') {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });
          
        if (!error && data) {
          // Map DB snake_case back to camelCase for UI
          convs = data.map(d => ({
            id: d.id,
            userId: d.user_id,
            title: d.title,
            messages: d.messages,
            updatedAt: d.updated_at
          }));
        }
      }
      
      const local = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
      const merged = [...convs];
      local.forEach(l => {
        if (!merged.some(m => m.id === l.id)) {
          merged.push(l);
        }
      });

      merged.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      set({ conversations: merged, historyLoading: false });
      if (merged.length > 0 && !get().activeConversation) {
        set({ activeConversation: merged[0] });
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      set({ historyLoading: false });
    }
  },
  startNewChat: async (userId) => {
    set({ chatLoading: true });
    const localId = 'local-' + Math.random().toString(36).substring(2, 11);
    const newConv = {
      id: localId,
      userId,
      title: "New Product Exploration",
      messages: [
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hello! I am Velora AI, your personal intelligence-driven shopping companion. What kind of product are you searching for today? Tell me your budget, preferred brands, or what features matter most to you, and I will find your perfect match.",
          timestamp: new Date().toISOString()
        }
      ],
      updatedAt: new Date().toISOString()
    };
    
    try {
      if (userId && userId !== 'demo-guest-user') {
        const { data, error } = await supabase
          .from('conversations')
          .insert([{
            user_id: newConv.userId,
            title: newConv.title,
            messages: newConv.messages,
            updated_at: newConv.updatedAt
          }])
          .select()
          .single();
          
        if (data) {
          newConv.id = data.id; // use real DB id
        }
      }
      
      const local = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
      localStorage.setItem(`velora_convs_${userId}`, JSON.stringify([newConv, ...local]));

      set({ 
        conversations: [newConv, ...get().conversations.filter(c => c.id !== newConv.id)],
        activeConversation: newConv,
        chatLoading: false
      });
    } catch (err) {
      console.warn("Supabase startNewChat error:", err);
      set({ chatLoading: false });
    }
  },
  selectConversation: (conv) => set({ activeConversation: conv }),
  sendMessage: async (userId, text, image = null) => {
    const active = get().activeConversation;
    if (!active) return;

    set({ chatLoading: true });

    const userMsg = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      ...(image ? { image } : {})
    };

    const updatedMessages = [...active.messages, userMsg];
    const updatedActive = { ...active, messages: updatedMessages, updatedAt: new Date().toISOString() };
    
    const updatedConvs = get().conversations.map(c => c.id === active.id ? updatedActive : c);
    set({ activeConversation: updatedActive, conversations: updatedConvs });

    // Sync to local
    const local = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
    const updatedLocal = local.map(c => c.id === active.id ? updatedActive : c);
    if (!updatedLocal.some(c => c.id === active.id)) updatedLocal.unshift(updatedActive);
    localStorage.setItem(`velora_convs_${userId}`, JSON.stringify(updatedLocal));

    // Sync to Supabase
    if (userId && userId !== 'demo-guest-user' && !active.id.startsWith('local-')) {
      supabase.from('conversations').update({
        messages: updatedActive.messages,
        updated_at: updatedActive.updatedAt
      }).eq('id', active.id).then(); // fire and forget
    }

    try {
      const response = await axios.post('/api/recommend', {
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        image: image
      });

      const aiData = response.data;
      const aiMsg = {
        id: Math.random().toString(),
        role: 'assistant',
        content: aiData.reply,
        timestamp: new Date().toISOString(),
        products: aiData.products || [],
        comparison: aiData.comparison || undefined
      };

      let updatedTitle = active.title;
      if (active.title === "New Product Exploration" && updatedMessages.length <= 3) {
        updatedTitle = text.split(' ').slice(0, 4).join(' ') + "...";
      }

      const finalMessages = [...updatedMessages, aiMsg];
      const finalActive = { 
        ...active, 
        title: updatedTitle,
        messages: finalMessages, 
        updatedAt: new Date().toISOString() 
      };

      const finalConvs = get().conversations.map(c => c.id === active.id ? finalActive : c);
      set({ activeConversation: finalActive, conversations: finalConvs, chatLoading: false });

      // Save complete to local
      const localSaved = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
      const updatedLocalSaved = localSaved.map(c => c.id === active.id ? finalActive : c);
      if (!updatedLocalSaved.some(c => c.id === active.id)) updatedLocalSaved.unshift(finalActive);
      localStorage.setItem(`velora_convs_${userId}`, JSON.stringify(updatedLocalSaved));

      // Save complete to Supabase
      if (userId && userId !== 'demo-guest-user' && !active.id.startsWith('local-')) {
        await supabase.from('conversations').update({
          title: finalActive.title,
          messages: finalActive.messages,
          updated_at: finalActive.updatedAt
        }).eq('id', active.id);
      }

      // Log search history
      if (text.length > 5 && userId && userId !== 'demo-guest-user') {
        await supabase.from('history').insert([{
          user_id: userId,
          query: text,
          timestamp: new Date().toISOString()
        }]);
      }

    } catch (err) {
      console.error("AI chat error:", err);
      toast.error(`Chat Error: ${err.message}`);
      set({ chatLoading: false });
    }
  },
  clearConversations: async (userId) => {
    try {
      localStorage.removeItem(`velora_convs_${userId}`);
      if (userId && userId !== 'demo-guest-user') {
        await supabase.from('conversations').delete().eq('user_id', userId);
      }
      set({ conversations: [], activeConversation: null });
      toast.success("All conversations cleared.");
    } catch (err) {
      console.error("Error clearing conversations:", err);
    }
  }
}));

// 4. WISHLIST STORE
export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,
  fetchWishlist: async (userId) => {
    set({ loading: true });
    try {
      let list = [];
      if (userId && userId !== 'demo-guest-user') {
        const { data, error } = await supabase
          .from('wishlists')
          .select('*')
          .eq('user_id', userId);
          
        if (!error && data) {
          list = data.map(d => ({ ...d.product_data, supabaseId: d.id }));
        }
      }
      
      const local = JSON.parse(localStorage.getItem(`velora_wishlist_${userId}`) || '[]');
      const merged = [...list];
      local.forEach(l => {
        if (!merged.some(m => m.id === l.id)) {
          merged.push(l);
        }
      });

      set({ wishlist: merged, loading: false });
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      set({ loading: false });
    }
  },
  addToWishlist: async (userId, product) => {
    try {
      const exists = get().wishlist.some(p => p.id === product.id);
      if (exists) {
        toast.error("Item already in your wishlist!");
        return;
      }
      
      let supabaseId = 'local-' + Math.random().toString(36).substring(2, 11);
      if (userId && userId !== 'demo-guest-user') {
        const { data, error } = await supabase
          .from('wishlists')
          .insert([{
            user_id: userId,
            product_data: product,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();
          
        if (data) supabaseId = data.id;
      }
      
      const newProduct = { ...product, supabaseId };
      const updatedList = [...get().wishlist, newProduct];
      set({ wishlist: updatedList });
      localStorage.setItem(`velora_wishlist_${userId}`, JSON.stringify(updatedList));
      toast.success(`${product.name} saved to wishlist!`);
    } catch (err) {
      console.warn("Error saving to Supabase wishlist:", err);
    }
  },
  removeFromWishlist: async (userId, productId) => {
    try {
      const item = get().wishlist.find(p => p.id === productId);
      const updatedList = get().wishlist.filter(p => p.id !== productId);
      set({ wishlist: updatedList });
      localStorage.setItem(`velora_wishlist_${userId}`, JSON.stringify(updatedList));

      if (userId && userId !== 'demo-guest-user' && item?.supabaseId && !item.supabaseId.toString().startsWith('local-')) {
        await supabase.from('wishlists').delete().eq('id', item.supabaseId);
      } else if (userId && userId !== 'demo-guest-user') {
        // Fallback delete if ID is missing
        await supabase.from('wishlists').delete().eq('user_id', userId).eq('product_data->id', productId);
      }
      toast.success("Removed from wishlist.");
    } catch (err) {
      console.warn("Error removing from Supabase wishlist:", err);
    }
  },
  isInWishlist: (productId) => {
    return get().wishlist.some(p => p.id === productId);
  }
}));

// 5. HISTORY STORE
export const useHistoryStore = create((set) => ({
  searches: [],
  fetchSearches: async (userId) => {
    try {
      let list = [];
      if (userId && userId !== 'demo-guest-user') {
        const { data, error } = await supabase
          .from('history')
          .select('query, timestamp')
          .eq('user_id', userId)
          .order('timestamp', { ascending: false })
          .limit(10);
          
        if (!error && data) {
          list = data;
        }
      }

      const local = JSON.parse(localStorage.getItem(`velora_history_${userId}`) || '[]');
      const merged = [...list];
      local.forEach(l => {
        if (!merged.some(m => m.query === l.query)) {
          merged.push(l);
        }
      });
      merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      set({ searches: merged.slice(0, 10) });
    } catch (err) {
      console.error("Error fetching search history:", err);
    }
  }
}));
