"use client";
import { Send } from "lucide-react";
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
        <div className="w-full max-w-4xl mx-auto relative group px-2 sm:px-0">
            <div className="relative bg-[#1a1a1a] rounded-xl sm:rounded-2xl border border-[#333] flex flex-col shadow-2xl">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Analyze a headline or tweet..."
                    className="w-full bg-transparent text-gray-100 placeholder-gray-500 p-3 sm:p-4 min-h-[50px] sm:min-h-[60px] max-h-[150px] sm:max-h-[200px] resize-none focus:outline-none rounded-t-xl sm:rounded-t-2xl scrollbar-hide text-sm sm:text-base"
                    rows={1}
                />

                <div className="flex justify-end items-center p-2 pr-3 sm:pr-4 border-t border-[#2a2a2a]/50">
                    <button
                        onClick={onEnsure}
                        disabled={loading || !value.trim()}
                        className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all duration-300 ${value.trim() && !loading
                            ? 'bg-green-500 text-black hover:bg-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                            : 'bg-[#2a2a2a] text-gray-600'
                            }`}
                    >
                        <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-2 sm:mt-3">
                AI can make mistakes. Please verify important information.
            </p>
        </div>
    );
}
