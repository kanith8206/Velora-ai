import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  sendPasswordResetEmail,
  signInAnonymously
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  orderBy, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// 1. AUTH STORE
export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  setLoading: (loading) => set({ loading }),
  initialize: () => {
    auth.onAuthStateChanged(async (firebaseUser) => {
      set({ user: firebaseUser, loading: false });
      if (firebaseUser) {
        // Sync user metadata to Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (!userSnap.exists()) {
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'Velora User',
              photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.email}`,
              createdAt: new Date().toISOString()
            });
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
      await signInWithEmailAndPassword(auth, email, password);
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
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Create user doc
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        displayName: name,
        photoURL: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        createdAt: new Date().toISOString()
      });
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
      await signInWithPopup(auth, googleProvider);
      toast.success('Logged in with Google!');
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message || 'Google authentication failed');
      throw err;
    }
  },
  loginAsGuest: async () => {
    set({ loading: true, error: null });
    try {
      await signInAnonymously(auth);
      toast.success('Successfully logged in as Guest!');
    } catch (err) {
      console.warn("Guest login via Firebase failed, using simulation:", err);
      // Fallback local session
      const mockUser = {
        uid: 'demo-guest-user',
        email: 'guest@velora.ai',
        displayName: 'Guest Explorer',
        photoURL: 'https://api.dicebear.com/7.x/initials/svg?seed=Guest',
        isAnonymous: true
      };
      set({ user: mockUser, loading: false });
      toast.success('Continuing with Guest Session!');
    }
  },
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link sent to your email.');
    } catch (err) {
      toast.error(err.message || 'Error sending password reset link');
      throw err;
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ user: null, loading: false });
      toast.success('Logged out safely.');
    } catch (err) {
      set({ loading: false });
      toast.error('Error logging out');
    }
  }
}));


// 2. PRODUCT STORE
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
      set({ products: response.data, loading: false });
    } catch (err) {
      console.error("Error fetching products:", err);
      set({ loading: false });
    }
  },
  fetchCategories: async () => {
    try {
      const response = await axios.get('/api/categories');
      set({ categories: response.data });
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  },
  fetchProductById: async (id) => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      set({ selectedProduct: response.data });
      return response.data;
    } catch (err) {
      // Dynamic fallback search in case product was generated by AI
      const foundInCurrent = get().products.find(p => p.id === id);
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
        const q = query(
          collection(db, 'conversations'),
          where('userId', '==', userId)
        );
        const snap = await getDocs(q);
        snap.forEach(doc => {
          convs.push({ id: doc.id, ...doc.data() });
        });
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
      console.error("Error fetching conversations, loading locally:", err);
      const local = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
      local.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      set({ conversations: local, historyLoading: false });
      if (local.length > 0 && !get().activeConversation) {
        set({ activeConversation: local[0] });
      }
    }
  },
  startNewChat: async (userId) => {
    set({ chatLoading: true });
    const newConv = {
      id: 'local-' + Math.random().toString(36).substring(2, 11),
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
        const docRef = await addDoc(collection(db, 'conversations'), {
          userId: newConv.userId,
          title: newConv.title,
          messages: newConv.messages,
          updatedAt: newConv.updatedAt
        });
        newConv.id = docRef.id;
      }
      
      const local = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
      localStorage.setItem(`velora_convs_${userId}`, JSON.stringify([newConv, ...local]));

      set({ 
        conversations: [newConv, ...get().conversations.filter(c => c.id !== newConv.id)],
        activeConversation: newConv,
        chatLoading: false
      });
    } catch (err) {
      console.warn("Firestore startNewChat error, running locally:", err);
      const local = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
      localStorage.setItem(`velora_convs_${userId}`, JSON.stringify([newConv, ...local]));

      set({ 
        conversations: [newConv, ...get().conversations.filter(c => c.id !== newConv.id)],
        activeConversation: newConv,
        chatLoading: false
      });
    }
  },
  selectConversation: (conv) => set({ activeConversation: conv }),
  sendMessage: async (userId, text, image = null) => {
    const active = get().activeConversation;
    if (!active) return;

    set({ chatLoading: true });

    // 1. Add user message to UI state immediately
    const userMsg = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      ...(image ? { image } : {})
    };

    const updatedMessages = [...active.messages, userMsg];
    const updatedActive = { ...active, messages: updatedMessages, updatedAt: new Date().toISOString() };
    
    // Update local list
    const updatedConvs = get().conversations.map(c => c.id === active.id ? updatedActive : c);
    set({ activeConversation: updatedActive, conversations: updatedConvs });

    // Sync user message to local storage
    const local = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
    const updatedLocal = local.map(c => c.id === active.id ? updatedActive : c);
    if (!updatedLocal.some(c => c.id === active.id)) {
      updatedLocal.unshift(updatedActive);
    }
    localStorage.setItem(`velora_convs_${userId}`, JSON.stringify(updatedLocal));

    // Sync user message to firestore (fire and forget / catch error)
    if (userId && userId !== 'demo-guest-user' && !active.id.startsWith('local-')) {
      try {
        await setDoc(doc(db, 'conversations', active.id), {
          userId: updatedActive.userId,
          title: updatedActive.title,
          messages: updatedActive.messages,
          updatedAt: updatedActive.updatedAt
        });
      } catch (e) {
        console.error("Error writing user message to Firestore:", e);
      }
    }

    // 2. Call backend recommendation AI API
    try {
      const response = await axios.post('/api/recommend', {
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        image: image
      });

      const aiData = response.data;

      // Create AI Response Message
      const aiMsg = {
        id: Math.random().toString(),
        role: 'assistant',
        content: aiData.reply,
        timestamp: new Date().toISOString(),
        products: aiData.products || [],
        comparison: aiData.comparison || undefined
      };

      // Update conversation title if it was default
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

      // Save complete conversation to local storage
      const localSaved = JSON.parse(localStorage.getItem(`velora_convs_${userId}`) || '[]');
      const updatedLocalSaved = localSaved.map(c => c.id === active.id ? finalActive : c);
      if (!updatedLocalSaved.some(c => c.id === active.id)) {
        updatedLocalSaved.unshift(finalActive);
      }
      localStorage.setItem(`velora_convs_${userId}`, JSON.stringify(updatedLocalSaved));

      // Save complete conversation to Firestore
      if (userId && userId !== 'demo-guest-user' && !active.id.startsWith('local-')) {
        try {
          await setDoc(doc(db, 'conversations', active.id), {
            userId: finalActive.userId,
            title: finalActive.title,
            messages: finalActive.messages,
            updatedAt: finalActive.updatedAt
          });
        } catch (err) {
          console.error("Error syncing complete conversation to Firestore:", err);
        }
      }

      // Save to recent search history
      if (text.length > 5 && userId && userId !== 'demo-guest-user') {
        try {
          await addDoc(collection(db, 'history'), {
            userId,
            query: text,
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.error("Error logging search history:", err);
        }
      }

    } catch (err) {
      console.error("AI chat error:", err);
      toast.error(`Chat Error: ${err.message || (err.response && err.response.data && err.response.data.error) || err}`);
      const errMessage = {
        id: Math.random().toString(),
        role: 'assistant',
        content: `I'm having a brief issue accessing my recommendation algorithms: ${err.message || 'Unknown error'}. Could you try your request again?`,
        timestamp: new Date().toISOString()
      };
      const finalActive = { ...active, messages: [...updatedMessages, errMessage], updatedAt: new Date().toISOString() };
      set({ activeConversation: finalActive, chatLoading: false });
    }
  },
  clearConversations: async (userId) => {
    try {
      localStorage.removeItem(`velora_convs_${userId}`);
      if (userId && userId !== 'demo-guest-user') {
        const q = query(collection(db, 'conversations'), where('userId', '==', userId));
        const snap = await getDocs(q);
        const promises = snap.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(promises);
      }
      set({ conversations: [], activeConversation: null });
      toast.success("All conversations cleared.");
    } catch (err) {
      console.error("Error clearing conversations:", err);
      set({ conversations: [], activeConversation: null });
      toast.success("Conversations cleared.");
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
        const q = query(collection(db, 'wishlists'), where('userId', '==', userId));
        const snap = await getDocs(q);
        snap.forEach(doc => {
          list.push({ ...doc.data().product, firestoreDocId: doc.id });
        });
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
      console.error("Error fetching wishlist, loading locally:", err);
      const local = JSON.parse(localStorage.getItem(`velora_wishlist_${userId}`) || '[]');
      set({ wishlist: local, loading: false });
    }
  },
  addToWishlist: async (userId, product) => {
    try {
      const exists = get().wishlist.some(p => p.id === product.id);
      if (exists) {
        toast.error("Item already in your wishlist!");
        return;
      }
      
      let firestoreDocId = 'local-' + Math.random().toString(36).substring(2, 11);
      if (userId && userId !== 'demo-guest-user') {
        const docRef = await addDoc(collection(db, 'wishlists'), {
          userId,
          product,
          createdAt: new Date().toISOString()
        });
        firestoreDocId = docRef.id;
      }
      
      const newProduct = { ...product, firestoreDocId };
      const updatedList = [...get().wishlist, newProduct];
      set({ wishlist: updatedList });
      localStorage.setItem(`velora_wishlist_${userId}`, JSON.stringify(updatedList));
      toast.success(`${product.name} saved to wishlist!`);
    } catch (err) {
      console.warn("Error saving to Firestore wishlist, saving locally:", err);
      const mockDocId = 'local-' + Math.random().toString(36).substring(2, 11);
      const newProduct = { ...product, firestoreDocId: mockDocId };
      const updatedList = [...get().wishlist, newProduct];
      set({ wishlist: updatedList });
      localStorage.setItem(`velora_wishlist_${userId}`, JSON.stringify(updatedList));
      toast.success(`${product.name} saved locally!`);
    }
  },
  removeFromWishlist: async (userId, productId) => {
    try {
      const updatedList = get().wishlist.filter(p => p.id !== productId);
      set({ wishlist: updatedList });
      localStorage.setItem(`velora_wishlist_${userId}`, JSON.stringify(updatedList));

      if (userId && userId !== 'demo-guest-user') {
        const q = query(
          collection(db, 'wishlists'), 
          where('userId', '==', userId),
          where('product.id', '==', productId)
        );
        const snap = await getDocs(q);
        const promises = snap.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(promises);
      }
      toast.success("Removed from wishlist.");
    } catch (err) {
      console.warn("Error removing from Firestore wishlist, removing locally:", err);
      toast.success("Removed from wishlist.");
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
        const q = query(
          collection(db, 'history'),
          where('userId', '==', userId)
        );
        const snap = await getDocs(q);
        snap.forEach(doc => {
          const data = doc.data();
          list.push({ query: data.query, timestamp: data.timestamp });
        });
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
      console.error("Error fetching search history, using local:", err);
      const local = JSON.parse(localStorage.getItem(`velora_history_${userId}`) || '[]');
      local.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      set({ searches: local.slice(0, 10) });
    }
  }
}));
