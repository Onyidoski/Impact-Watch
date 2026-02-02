"use client";
import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { AnalysisInput } from "../components/AnalysisInput";
import { ResultCard, AnalysisResult } from "../components/ResultCard";
import { Boxes, Sparkles } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string | AnalysisResult;
  prompt?: string;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const analyzeSentiment = async (textOverride?: string) => {
    // If textOverride is provided (Regenerate), use it; otherwise use inputText
    const textToAnalyze = textOverride || inputText;

    if (!textToAnalyze.trim()) return;

    // Only add user message if it's a new input (not a regeneration)
    if (!textOverride) {
      const userMsg: Message = { role: 'user', content: textToAnalyze };
      setMessages(prev => [...prev, userMsg]);
      setInputText(""); // Clear input
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze }),
      });
      const data = await response.json();

      // Add Assistant Message with the original prompt stored
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
      <Sidebar />

      <main className="flex-1 ml-64 relative flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-[#222] flex items-center justify-between px-8 bg-[#0f0f0f]/80 backdrop-blur-md z-40 sticky top-0">
          <h1 className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            ImpactWatch Environment
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-green-500 font-mono">SYSTEM ONLINE</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 -mt-20">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#1a1a1a] to-[#222] rounded-3xl flex items-center justify-center border border-[#333] shadow-2xl mb-4">
                <Sparkles className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                How can I help you analyze today?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full text-left">
                <button
                  onClick={() => analyzeSentiment("I am worried that AI surveillance will destroy our privacy")}
                  className="p-4 bg-[#1a1a1a] border border-[#333] hover:border-green-500/50 hover:bg-[#222] rounded-xl transition-all group"
                >
                  <h3 className="font-medium text-gray-200 mb-1 group-hover:text-green-400 transition-colors">Analyze Privacy Concerns</h3>
                  <p className="text-sm text-gray-500">Check sentiment on AI surveillance</p>
                </button>
                <button
                  onClick={() => analyzeSentiment("AI will solve all humanity's problems and cure diseases")}
                  className="p-4 bg-[#1a1a1a] border border-[#333] hover:border-green-500/50 hover:bg-[#222] rounded-xl transition-all group"
                >
                  <h3 className="font-medium text-gray-200 mb-1 group-hover:text-green-400 transition-colors">Analyze Techno-Optimism</h3>
                  <p className="text-sm text-gray-500">Evaluate positive AI sentiment</p>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {messages.map((msg, idx) => (
                  <div key={idx} className="animate-fade-in">
                    {msg.role === 'user' ? (
                      <div className="flex justify-end mb-6">
                        <div className="bg-[#222] text-gray-100 px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%] border border-[#333]">
                          {msg.content as string}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex-shrink-0 mt-2"></div>
                        <div className="flex-1">
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
                  <div className="flex gap-4 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex-shrink-0"></div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-30 w-full"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent z-50">
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