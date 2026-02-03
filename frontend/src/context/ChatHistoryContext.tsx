"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { AnalysisResult } from "../components/ResultCard";

// Message type matching page.tsx
export interface Message {
    role: 'user' | 'assistant';
    content: string | AnalysisResult;
    prompt?: string;
}

// Chat session representing a single conversation
export interface ChatSession {
    id: string;
    name: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

interface ChatHistoryContextType {
    sessions: ChatSession[];
    activeSessionId: string | null;
    activeSession: ChatSession | null;
    createSession: (firstMessage: string) => string;
    loadSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;
    updateSessionMessages: (messages: Message[]) => void;
    clearActiveSession: () => void;
}

const ChatHistoryContext = createContext<ChatHistoryContextType | null>(null);

const STORAGE_KEY = "impactwatch_chat_history";

// Generate unique ID
const generateId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Truncate text for session name
const truncateName = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
};

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setSessions(parsed.sessions || []);
                // Don't auto-load the last session - start fresh
            }
        } catch (error) {
            console.error("Failed to load chat history:", error);
        }
        setIsHydrated(true);
    }, []);

    // Persist to localStorage whenever sessions change
    useEffect(() => {
        if (!isHydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions }));
        } catch (error) {
            console.error("Failed to save chat history:", error);
        }
    }, [sessions, isHydrated]);

    // Get active session object
    const activeSession = sessions.find(s => s.id === activeSessionId) || null;

    // Create a new session with the first message as the name
    const createSession = useCallback((firstMessage: string): string => {
        const newSession: ChatSession = {
            id: generateId(),
            name: truncateName(firstMessage),
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        return newSession.id;
    }, []);

    // Load an existing session
    const loadSession = useCallback((sessionId: string) => {
        setActiveSessionId(sessionId);
    }, []);

    // Delete a session
    const deleteSession = useCallback((sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) {
            setActiveSessionId(null);
        }
    }, [activeSessionId]);

    // Update messages in the active session
    const updateSessionMessages = useCallback((messages: Message[]) => {
        if (!activeSessionId) return;
        setSessions(prev => prev.map(session =>
            session.id === activeSessionId
                ? { ...session, messages, updatedAt: Date.now() }
                : session
        ));
    }, [activeSessionId]);

    // Clear active session (for "New Analysis")
    const clearActiveSession = useCallback(() => {
        setActiveSessionId(null);
    }, []);

    return (
        <ChatHistoryContext.Provider value={{
            sessions,
            activeSessionId,
            activeSession,
            createSession,
            loadSession,
            deleteSession,
            updateSessionMessages,
            clearActiveSession,
        }}>
            {children}
        </ChatHistoryContext.Provider>
    );
}

export function useChatHistory() {
    const context = useContext(ChatHistoryContext);
    if (!context) {
        throw new Error("useChatHistory must be used within a ChatHistoryProvider");
    }
    return context;
}
