'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import ChatButton from './chat-button';
import ChatWindow from './chat-window';

/**
 * AI Chat Widget
 * Main component that manages the chat state and rendering
 * Includes floating button and chat window with smooth animations
 */
export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Floating Chat Button */}
            <ChatButton open={open} setOpen={setOpen} />

            {/* Chat Window */}
            {open && <ChatWindow onClose={() => setOpen(false)} />}
        </>
    );
}
