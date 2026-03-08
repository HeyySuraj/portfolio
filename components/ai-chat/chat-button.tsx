'use client';

import { useTheme } from 'next-themes';
import { MessageCircle, X } from 'lucide-react';

/**
 * Floating Chat Button
 * Modern, animated button that toggles the chat window
 * Features glassmorphism design with smooth interactions
 */
interface ChatButtonProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function ChatButton({ open, setOpen }: ChatButtonProps) {
    const { theme } = useTheme();

    return (
        <button
            onClick={() => setOpen(!open)}
            className={`fixed bottom-6 right-6 z-[998] flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ease-out group ${open ? 'scale-0' : 'scale-100'
                } hover:scale-110`}
            style={{
                background: theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(79, 70, 229, 0.8) 0%, rgba(109, 40, 217, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                border: theme === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: theme === 'dark'
                    ? '0 8px 32px 0 rgba(99, 102, 241, 0.3)'
                    : '0 8px 32px 0 rgba(79, 70, 229, 0.25)',
            }}
            aria-label="Toggle AI chat"
        >
            <div className="absolute inset-0 rounded-full animate-pulse" style={{
                background: theme === 'dark'
                    ? 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, transparent 70%)',
            }} />

            {open ? (
                <X className="w-7 h-7 text-white relative z-10" strokeWidth={2.5} />
            ) : (
                <>
                    <MessageCircle className="w-7 h-7 text-white relative z-10" strokeWidth={2} />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </>
            )}
        </button>
    );
}
