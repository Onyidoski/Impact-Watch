"use client";
import { Send, Sparkles } from "lucide-react";
import { KeyboardEvent } from "react";

interface AnalysisInputProps {
    value: string;
    onChange: (value: string) => void;
    onEnsure: () => void;
    loading: boolean;
}

export function AnalysisInput({ value, onChange, onEnsure, loading }: AnalysisInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onEnsure();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto relative group">
            <div className="relative bg-[#1a1a1a] rounded-2xl border border-[#333] flex flex-col shadow-2xl">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask the Impact Engine to analyze a headline or tweet..."
                    className="w-full bg-transparent text-gray-100 placeholder-gray-500 p-4 min-h-[60px] max-h-[200px] resize-none focus:outline-none rounded-t-2xl scrollbar-hide"
                    rows={1}
                />

                <div className="flex justify-between items-center p-2 pr-4 border-t border-[#2a2a2a]/50">
                    <div className="flex gap-2 px-2">
                        <button className="p-2 text-gray-500 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors" title="Enhance prompt">
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={onEnsure}
                        disabled={loading || !value.trim()}
                        className={`p-2 rounded-xl transition-all duration-300 ${value.trim() && !loading
                            ? 'bg-green-500 text-black hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                            : 'bg-[#2a2a2a] text-gray-600'
                            }`}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <p className="text-center text-xs text-gray-600 mt-3">
                AI can make mistakes. Please verify important information.
            </p>
        </div>
    );
}
