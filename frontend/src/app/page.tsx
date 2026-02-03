"use client";
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { AnalysisInput } from "../components/AnalysisInput";
import { ResultCard, AnalysisResult } from "../components/ResultCard";
import { Sparkles } from "lucide-react";
import { useChatHistory, Message } from "../context/ChatHistoryContext";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sessions,
    activeSessionId,
    activeSession,
    createSession,
    loadSession,
    deleteSession,
    updateSessionMessages,
    clearActiveSession,
  } = useChatHistory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Track previous session ID to detect session switches
  const prevSessionIdRef = useRef<string | null>(null);

  // Load messages only when switching to a different session
  useEffect(() => {
    if (activeSessionId !== prevSessionIdRef.current) {
      prevSessionIdRef.current = activeSessionId;
      if (activeSession) {
        setMessages(activeSession.messages);
      }
    }
  }, [activeSessionId, activeSession]);

  // Sync messages to session - only when messages actually change from user actions
  const isUpdatingRef = useRef(false);
  useEffect(() => {
    if (activeSessionId && messages.length > 0 && !isUpdatingRef.current) {
      updateSessionMessages(messages);
    }
  }, [messages, activeSessionId, updateSessionMessages]);

  // Close sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewChat = () => {
    clearActiveSession();
    setMessages([]);
    setInputText("");
  };

  const handleLoadSession = (sessionId: string) => {
    loadSession(sessionId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const analyzeSentiment = async (textOverride?: string) => {
    // If textOverride is provided (Regenerate), use it; otherwise use inputText
    const textToAnalyze = textOverride || inputText;

    if (!textToAnalyze.trim()) return;

    // If this is the first message and no active session, create one
    const isFirstMessage = messages.length === 0 && !textOverride;
    if (isFirstMessage && !activeSessionId) {
      createSession(textToAnalyze);
    }

    // Only add user message if it's a new input (not a regeneration)
    if (!textOverride) {
      const userMsg: Message = { role: 'user', content: textToAnalyze };
      setMessages(prev => [...prev, userMsg]);
      setInputText(""); // Clear input
    }

    setLoading(true);

    try {
      const response = await fetch("https://impact-watch.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze }),
      });
      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data,
        prompt: textToAnalyze
      }]);
    } catch (error) {
      console.error("Error:", error);
      // Ideally show an error toast here
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-gray-100 font-sans selection:bg-green-500/30">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onLoadSession={handleLoadSession}
        onDeleteSession={deleteSession}
        onNewChat={handleNewChat}
      />

      <main className="flex-1 lg:ml-64 relative flex flex-col h-screen overflow-hidden">
        <header className="h-14 sm:h-16 border-b border-[#222] flex items-center justify-between px-4 sm:px-6 md:px-8 bg-[#0f0f0f]/80 backdrop-blur-md z-40 sticky top-0">
          {/* Spacer for mobile hamburger menu */}
          <div className="w-10 lg:hidden"></div>

          <h1 className="text-xs sm:text-sm font-medium text-gray-400 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
            <span className="hidden sm:inline">ImpactWatch Environment</span>
            <span className="sm:hidden">ImpactWatch</span>
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] sm:text-xs text-green-500 font-mono">
              <span className="hidden sm:inline">SYSTEM ONLINE</span>
              <span className="sm:hidden">ONLINE</span>
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 -mt-10 sm:-mt-20 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#1a1a1a] to-[#222] rounded-2xl sm:rounded-3xl flex items-center justify-center border border-[#333] shadow-2xl mb-2 sm:mb-4">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                How can I help you analyze today?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl w-full text-left">
                <button
                  onClick={() => analyzeSentiment("I am worried that AI surveillance will destroy our privacy")}
                  className="p-3 sm:p-4 bg-[#1a1a1a] border border-[#333] hover:border-green-500/50 hover:bg-[#222] rounded-xl transition-all group"
                >
                  <h3 className="font-medium text-gray-200 mb-1 text-sm sm:text-base group-hover:text-green-400 transition-colors">Analyze Privacy Concerns</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Check sentiment on AI surveillance</p>
                </button>
                <button
                  onClick={() => analyzeSentiment("AI will solve all humanity's problems and cure diseases")}
                  className="p-3 sm:p-4 bg-[#1a1a1a] border border-[#333] hover:border-green-500/50 hover:bg-[#222] rounded-xl transition-all group"
                >
                  <h3 className="font-medium text-gray-200 mb-1 text-sm sm:text-base group-hover:text-green-400 transition-colors">Analyze Techno-Optimism</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Evaluate positive AI sentiment</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-6 md:space-y-8">
                {messages.map((msg, idx) => (
                  <div key={idx} className="animate-fade-in">
                    {msg.role === 'user' ? (
                      <div className="flex justify-end mb-4 sm:mb-6">
                        <div className="bg-[#222] text-gray-100 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl rounded-tr-sm max-w-[90%] sm:max-w-[80%] border border-[#333] text-sm sm:text-base">
                          {msg.content as string}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 sm:gap-4">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex-shrink-0 mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <ResultCard
                            data={msg.content as AnalysisResult}
                            onRegenerate={() => msg.prompt && analyzeSentiment(msg.prompt)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3 sm:gap-4 animate-pulse">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex-shrink-0"></div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-24 sm:h-30 w-full"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent z-50">
          <AnalysisInput
            value={inputText}
            onChange={setInputText}
            onEnsure={() => analyzeSentiment()}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
}