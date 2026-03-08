'use client';

import { useTheme } from 'next-themes';
import { Send, Loader } from 'lucide-react';

/**
 * Chat Input Component
 * Modern input field with send button
 * Features smooth interactions and theme support
 */
interface ChatInputProps {
    question: string;
    setQuestion: (question: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
}

export default function ChatInput({
    question,
    setQuestion,
    onSubmit,
    loading,
}: ChatInputProps) {
    const { theme } = useTheme();

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit(e as any);
        }
    };

    return (
        <div
            className="p-4 border-t"
            style={{
                borderColor: theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
            }}
        >
            <form onSubmit={onSubmit} className="flex gap-3">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={loading}
                    className="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none transition-all disabled:opacity-50"
                    style={{
                        background: theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.03)',
                        color: theme === 'dark' ? '#ffffff' : '#1e293b',
                        border: theme === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(10px)',
                    }}
                />

                <button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="p-3 rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    style={{
                        background: loading || !question.trim()
                            ? theme === 'dark'
                                ? 'rgba(99, 102, 241, 0.3)'
                                : 'rgba(79, 70, 229, 0.2)'
                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
                        boxShadow:
                            'rgba(99, 102, 241, 0.3) 0px 4px 12px',
                    }}
                    aria-label="Send message"
                >
                    {loading ? (
                        <Loader className="w-5 h-5 text-white animate-spin" />
                    ) : (
                        <Send className="w-5 h-5 text-white" />
                    )}
                </button>
            </form>

            <p
                className="text-xs mt-2 text-center opacity-60"
                style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)' }}
            >
                Powered by Suraj AI
            </p>
        </div>
    );
}
