"use client";
import { MessageSquarePlus, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <aside className="w-64 bg-[#0a0a0a] border-r border-[#222] flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                    <img src="/logo.png" alt="ImpactWatch Logo" className="w-12 h-12 object-contain" />
                    <span className="font-bold text-lg text-white tracking-tight">ImpactWatch</span>
                </div>

                <button
                    className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-green-400 border border-green-900/30 font-medium py-3 px-4 rounded-xl flex items-center gap-3 transition-all group"
                    onClick={() => window.location.reload()}
                >
                    <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>New Analysis</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
            </div>

            <div className="p-4 border-t border-[#222]">
                <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
}
