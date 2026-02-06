"use client";
import { MessageSquarePlus, Settings, Menu, X, Trash2, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { ChatSession } from "../context/ChatHistoryContext";

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    sessions: ChatSession[];
    activeSessionId: string | null;
    onLoadSession: (sessionId: string) => void;
    onDeleteSession: (sessionId: string) => void;
    onNewChat: () => void;
}

export function Sidebar({
    isOpen,
    onToggle,
    sessions,
    activeSessionId,
    onLoadSession,
    onDeleteSession,
    onNewChat,
}: SidebarProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onToggle();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onToggle]);

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return new Date(timestamp).toLocaleDateString();
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="lg:hidden fixed top-4 left-4 z-[60] p-2.5 bg-[#1a1a1a] border border-[#333] rounded-xl text-gray-400 hover:text-white hover:border-green-500/50 transition-all shadow-lg"
                    aria-label="Open menu"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={onToggle}
                />
            )}

            <aside
                className={`
                    w-64 bg-[#0a0a0a] border-r border-[#222] flex flex-col h-screen fixed left-0 top-0 z-50
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="ImpactWatch Logo" className="w-10 h-10 object-contain" />
                            <span className="font-bold text-lg text-white tracking-tight">ImpactWatch</span>
                        </div>

                        <button
                            onClick={onToggle}
                            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-[#222] rounded-lg transition-all"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-green-400 border border-green-900/30 font-medium py-3 px-4 rounded-xl flex items-center gap-3 transition-all group"
                        onClick={onNewChat}
                    >
                        <MessageSquarePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>New Analysis</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                    {sessions.length > 0 ? (
                        <div className="space-y-1">
                            <h3 className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-2 mb-2">
                                History
                            </h3>
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className={`
                                        group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all
                                        ${activeSessionId === session.id
                                            ? 'bg-green-500/10 border border-green-500/30 text-white'
                                            : 'hover:bg-[#1a1a1a] text-gray-400 hover:text-white border border-transparent'
                                        }
                                    `}
                                    onClick={() => onLoadSession(session.id)}
                                >
                                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm truncate font-medium">
                                            {session.name}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            {formatTime(session.updatedAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteSession(session.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded-md transition-all"
                                        aria-label="Delete session"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4">
                            <MessageCircle className="w-8 h-8 text-gray-600 mb-2" />
                            <p className="text-xs text-gray-500">No history yet</p>
                            <p className="text-[10px] text-gray-600">Start a new analysis</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-[#222]">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
