"use client";

import { ChatHistoryProvider } from "../context/ChatHistoryContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ChatHistoryProvider>{children}</ChatHistoryProvider>;
}
