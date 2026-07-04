import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useChatStore, useProductStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { 
  Sparkles, 
  Send, 
  Mic, 
  Image, 
  Plus, 
  Trash2, 
  MessageSquare, 
  ChevronRight, 
  ArrowLeft,
  X,
  Star,
  Check,
  Award,
  ExternalLink,
  ChevronDown,
  Compass
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

export default function Chat() {
  const { user } = useAuthStore();
  const { 
    conversations, 
    activeConversation, 
    chatLoading, 
    historyLoading, 
    fetchConversations, 
    startNewChat, 
    selectConversation, 
    sendMessage,
    clearConversations
  } = useChatStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Parse query params for auto prompting
  useEffect(() => {
    if (!user) {
      toast.error("Please log in to start chatting with Velora AI.");
      navigate('/auth');
      return;
    }
    
    const initFetch = async () => {
      await fetchConversations(user.uid);
    };
    initFetch();
  }, [user]);

  // Handle URL auto-prompting after conversations load
  useEffect(() => {
    if (user && conversations.length > 0 && !activeConversation) {
      // Default to first conversation
      selectConversation(conversations[0]);
    }
    
    // Check if there is an explicit prompt parameter
    const params = new URLSearchParams(location.search);
    const urlPrompt = params.get('prompt');
    
    if (urlPrompt && user) {
      const runAutoPrompt = async () => {
        // Start a fresh conversation
        await startNewChat(user.uid);
        // Clean URL parameter
        navigate('/chat', { replace: true });
        // Send message
        setTimeout(() => {
          sendMessage(user.uid, urlPrompt);
        }, 800);
      };
      runAutoPrompt();
    }
  }, [conversations, user, location]);

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, chatLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedImage) || chatLoading) return;
    
    if (!activeConversation) {
      await startNewChat(user.uid);
    }
    
    const currentInput = input;
    const currentImage = selectedImage;
    
    setInput('');
    setImagePreview(null);
    setSelectedImage(null);
    
    await sendMessage(user.uid, currentInput || "Please analyze this image", currentImage);
  };

  const handleNewChat = async () => {
    if (user) {
      await startNewChat(user.uid);
    }
  };

  const handleClearHistory = async () => {
    if (user && window.confirm("Are you sure you want to clear your entire chat history? This cannot be undone.")) {
      await clearConversations(user.uid);
    }
  };

  const handleVoiceInputClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser. Try Chrome or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.success("Listening... Speak now.");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev ? prev + ' ' + transcript : transcript);
        toast.success("Voice input added!");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          toast.error("Microphone permission denied. We have enabled app permissions! Please allow microphone access in your browser or click 'Open in New Tab' to run outside the iframe sandbox.", { duration: 6000 });
        } else {
          toast.error(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      toast.error("Failed to initialize speech recognition.");
      setIsListening(false);
    }
  };

  const handleImagePlaceholderClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        setSelectedImage({
          data: base64Data,
          mimeType: file.type
        });
        setImagePreview(reader.result);
        toast.success("Image selected and ready to analyze!");
      };
      reader.readAsDataURL(file);
    }
  };

  const suggestedPrompts = [
    { title: "Apple vs Samsung", text: "Compare iPhone 15 Pro Max and Galaxy S24 Ultra side-by-side. Which has better cameras?" },
    { title: "Smart Office", text: "Recommend a high-end ergonomic chair for developer productivity. My budget is $1500." },
    { title: "Latte Art Station", text: "I want an espresso machine with an integrated grinder. Budget is around $700. What are my options?" },
    { title: "Quiet Audio Gear", text: "Recommend some premium over-ear headphones with exceptional active noise canceling for long travel." }
  ];

  return (
    <div className="h-[88vh] flex bg-[#060608] text-white relative overflow-hidden">
      
      {/* SIDEBAR */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex flex-col border-r border-[#1E1E24] bg-[#040406] h-full shrink-0 relative z-10"
          >
            {/* NEW CHAT BUTTON */}
            <div className="p-4 border-b border-[#1E1E24]">
              <button
                onClick={handleNewChat}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:opacity-90 text-black rounded-xl py-3 text-xs font-bold shadow-lg shadow-amber-500/5 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Exploration
              </button>
            </div>

            {/* CONVERSATION LIST */}
            <div className="flex-grow overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
              <h3 className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 mb-2 font-bold">
                Chat History
              </h3>
              {historyLoading ? (
                <div className="flex flex-col gap-3 p-4">
                  <div className="h-6 bg-[#0C0C0F] rounded-lg animate-pulse" />
                  <div className="h-6 bg-[#0C0C0F] rounded-lg animate-pulse w-3/4" />
                </div>
              ) : conversations.length > 0 ? (
                conversations.map((conv) => {
                  const active = activeConversation?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-left text-xs transition-all ${
                        active 
                          ? 'bg-[#0C0C0F] text-white font-semibold shadow-inner border border-[#AA7C11]/15' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0C0C0F]/40'
                      }`}
                    >
                      <MessageSquare className={`w-4 h-4 shrink-0 ${active ? 'text-[#E2B53E]' : 'text-slate-500'}`} />
                      <span className="truncate block flex-grow pr-1">{conv.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 text-center py-8">No chats created yet.</p>
              )}
            </div>

            {/* SIDEBAR FOOTER ACTION */}
            <div className="p-4 border-t border-[#1E1E24]">
              <button
                onClick={handleClearHistory}
                className="w-full flex items-center justify-center gap-2 py-2 text-rose-400 hover:text-rose-300 hover:bg-[#0C0C0F]/40 border border-dashed border-rose-500/20 hover:border-rose-500/40 rounded-xl text-xs font-semibold transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Chat History
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CHAT CONSOLE */}
      <main className="flex-grow flex flex-col h-full bg-[#060608] relative overflow-hidden">
        {/* TOP BAR ACTION LAYOUT */}
        <div className="flex items-center justify-between border-b border-[#1E1E24] bg-[#060608]/80 backdrop-blur-md py-3 px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white p-2 hover:bg-[#0C0C0F] rounded-lg transition-all hidden md:block"
              title="Toggle sidebar"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-sans font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E2B53E] animate-pulse" />
                Velora Shopping Intelligence
              </h2>
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase flex items-center gap-1.5 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                Model Core Online
              </span>
            </div>
          </div>
          
          <button
            onClick={handleNewChat}
            className="md:hidden flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> New Chat
          </button>
        </div>

        {/* CHAT MESSAGES PANEL */}
        <div className="flex-grow overflow-y-auto px-4 py-6 sm:px-6 space-y-6 custom-scrollbar">
          {activeConversation ? (
            <div className="max-w-4xl mx-auto space-y-6 pb-6">
              {activeConversation.messages.map((msg) => {
                const isAI = msg.role === 'assistant';
                return (
                  <div key={msg.id} className={`flex gap-3 sm:gap-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    
                    {/* AVATAR */}
                    {isAI && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center shrink-0 shadow-md">
                        <Sparkles className="w-4 h-4 text-black" />
                      </div>
                    )}

                    {/* BUBBLE AND INLINE ATTACHMENTS */}
                    <div className="space-y-4 max-w-[85%] sm:max-w-[75%]">
                      {/* CHAT CHIP */}
                      <div
                        className={`p-4 rounded-2xl leading-relaxed text-xs sm:text-sm shadow-md ${
                          isAI
                            ? 'bg-[#0C0C0F] border border-[#1E1E24] text-slate-100 rounded-tl-none'
                            : 'bg-[#1E1E24] border border-[#AA7C11]/20 text-slate-100 rounded-tr-none'
                        }`}
                      >
                        {!isAI && msg.image && (
                          <div className="mb-2 max-w-xs overflow-hidden rounded-lg border border-[#AA7C11]/30">
                            <img
                              src={`data:${msg.image.mimeType};base64,${msg.image.data}`}
                              alt="Uploaded attachment"
                              className="max-h-48 w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div className="markdown-body text-slate-200">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      </div>

                      {/* INLINE RECOMMENDED PRODUCTS */}
                      {isAI && msg.products && msg.products.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5 ml-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Recommended Matches ({msg.products.length})
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {msg.products.map((p) => (
                              <ProductCard key={p.id} product={p} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* INLINE PRODUCT COMPARISON MATRIX */}
                      {isAI && msg.comparison && (
                        <div className="space-y-2 bg-[#0C0C0F]/40 border border-[#1E1E24] p-4 rounded-2xl shadow-lg">
                          <div className="flex justify-between items-center border-b border-[#1E1E24] pb-3 mb-3">
                            <h4 className="text-xs font-bold text-white flex items-center gap-2">
                              <Award className="w-4 h-4 text-[#E2B53E]" />
                              {msg.comparison.title}
                            </h4>
                            <span className="text-[10px] bg-[#D4AF37]/10 text-[#E2B53E] border border-[#D4AF37]/20 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                              Winner: {msg.comparison.winner}
                            </span>
                          </div>

                          {/* MATRIX TABLE */}
                          <div className="overflow-x-auto text-[11px]">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-[#1E1E24]">
                                  <th className="py-1.5 font-bold text-slate-400">Metric</th>
                                  {msg.comparison.headers.map((hdr, hIdx) => (
                                    <th key={hIdx} className="py-1.5 px-3 font-extrabold text-white">{hdr}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {msg.comparison.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-[#1E1E24]/60 hover:bg-[#0C0C0F]/20">
                                    <td className="py-2 font-semibold text-slate-400">{row.metric}</td>
                                    {row.values.map((val, vIdx) => (
                                      <td key={vIdx} className="py-2 px-3 text-slate-300 font-medium">{val}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* USER AVATAR */}
                    {!isAI && (
                      <img 
                        src={user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`} 
                        className="w-8 h-8 rounded-xl shrink-0 border border-[#AA7C11]/50" 
                        alt="User Avatar"
                        referrerPolicy="no-referrer"
                      />
                    )}

                  </div>
                );
              })}

              {/* LOADING INDICATOR / TYPING SKELETON */}
              {chatLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4 text-black animate-spin" />
                  </div>
                  <div className="bg-[#0C0C0F] border border-[#1E1E24] p-4 rounded-2xl rounded-tl-none text-xs sm:text-sm max-w-[200px] shadow-md">
                    <div className="flex gap-1.5 items-center justify-center py-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          ) : (
            /* CONSOLE EMPTY INTRO WITH SUGGESTIONS */
            <div className="max-w-3xl mx-auto h-full flex flex-col justify-center items-center py-12 space-y-8 text-center px-4">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] items-center justify-center shadow-xl animate-pulse">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <div className="space-y-2">
                <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-white">
                  Meet Velora AI
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  I am your personalized intelligence-driven shopping companion. I analyze budgets, requirements, brands, and technical performance to find your ideal match.
                </p>
              </div>

              {/* SUGGESTIONS BLOCKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(p.text)}
                    className="p-4 rounded-2xl border border-[#1E1E24] hover:border-[#AA7C11]/40 bg-[#0C0C0F]/30 hover:bg-[#0C0C0F]/60 text-left transition-all hover:scale-[1.01] shadow-inner"
                  >
                    <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {p.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed truncate-2-lines line-clamp-2">
                      {p.text}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* INPUT PANEL WINDOW */}
        <div className="border-t border-[#1E1E24] bg-[#060608] p-4 sm:p-6">
          <div className="max-w-4xl mx-auto relative">
            
            {/* HIDDEN FILE INPUT */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />

            {/* IMAGE PREVIEW REMOVER */}
            {imagePreview && (
              <div className="absolute -top-16 left-2 bg-[#0C0C0F] border border-[#1E1E24] p-1.5 rounded-xl flex items-center gap-2 z-10 shadow-md">
                <img src={imagePreview} className="w-10 h-10 object-cover rounded-lg" alt="Upload preview" />
                <button onClick={() => { setImagePreview(null); setSelectedImage(null); }} className="text-rose-400 hover:text-rose-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* MAIN FORM PANEL */}
            <form onSubmit={handleSend} className="relative">
              {/* ACTION ATTACHMENT TRIGGERS */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleImagePlaceholderClick}
                  className="p-2 text-slate-400 hover:text-white hover:bg-[#0C0C0F] rounded-xl transition-all"
                  title="Upload image"
                >
                  <Image className="w-4.5 h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={handleVoiceInputClick}
                  className={`p-2 rounded-xl transition-all ${
                    isListening
                      ? 'text-red-500 bg-red-500/10 animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-[#0C0C0F]'
                  }`}
                  title={isListening ? "Stop listening" : "Voice input"}
                >
                  <Mic className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* CHAT INPUT TEXT */}
              <input
                type="text"
                placeholder={isListening ? "Listening... Speak now!" : "Ask Velora to search, audit, or compare products..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={chatLoading}
                className="w-full bg-[#0C0C0F] border border-[#1E1E24] rounded-2xl pl-24 pr-14 py-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#E2B53E] transition-all shadow-lg"
              />

              {/* SEND TRIGGER */}
              <button
                type="submit"
                disabled={(!input.trim() && !selectedImage) || chatLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:opacity-95 text-black p-3.5 rounded-xl transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[10px] text-slate-500 text-center mt-2.5">
              Velora AI provides suggestions based on technical profiles. Prices and availability of dynamic products may vary.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
