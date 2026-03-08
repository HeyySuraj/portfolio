'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ChevronDown, Send, Loader } from 'lucide-react';
import ChatMessage from './chat-message';
import ChatInput from './chat-input';

/**
 * Chat Window Component
 * Main chat interface with message display and input
 * Features smooth animations and glassmorphism design
 */
interface Message {
    role: 'user' | 'ai';
    text: string;
    id: string;
}

interface ChatWindowProps {
    onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
    const { theme } = useTheme();
    const [messages, setMessages] = useState<Message[]>([]);
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Check if scroll button should be visible
    useEffect(() => {
        const handleScroll = () => {
            if (chatRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
                setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
            }
        };

        const element = chatRef.current;
        element?.addEventListener('scroll', handleScroll);
        return () => element?.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        // Add user message
        const userMessage: Message = {
            role: 'user',
            text: question,
            id: Date.now().toString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setQuestion('');
        setLoading(true);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const data = await res.json();

            const aiMessage: Message = {
                role: 'ai',
                text: data.answer || 'Sorry, I encountered an error. Please try again.',
                id: (Date.now() + 1).toString(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: 'ai',
                text: 'Sorry, something went wrong. Please try again later.',
                id: (Date.now() + 1).toString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div
            className="fixed bottom-24 right-6 z-[999] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
            style={{
                width: 'clamp(320px, 90vw, 450px)',
                height: 'clamp(500px, 85vh, 680px)',
            }}
        >
            {/* Background Gradient Blur Effect */}
            <div className="absolute inset-0 rounded-3xl" style={{
                background: theme === 'dark'
                    ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 27, 75, 0.8) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(240, 249, 255, 0.8) 100%)',
                backdropFilter: 'blur(40px)',
                border: theme === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: theme === 'dark'
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
            }} />

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b" style={{
                    borderColor: theme === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                }}>
                    <div>
                        <h3 className="text-lg font-bold" style={{
                            color: theme === 'dark' ? '#ffffff' : '#1e293b',
                        }}>
                            Ask Suraj AI
                        </h3>
                        <p className="text-xs mt-1" style={{
                            color: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                        }}>
                            Online & Ready to Help
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-xl transition-transform hover:scale-110 hover:rotate-90"
                        style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }}
                        aria-label="Close chat"
                    >
                        ×
                    </button>
                </div>

                {/* Messages Container */}
                <div
                    ref={chatRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                    style={{
                        color: theme === 'dark' ? '#ffffff' : '#1e293b',
                    }}
                >
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="text-5xl mb-4">🤖</div>
                            <p className="font-semibold text-lg mb-2">Hey there!</p>
                            <p className="text-sm opacity-70 px-4">
                                Ask me anything about Suraj's experience, skills, projects, or background.
                            </p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            isLast={index === messages.length - 1}
                        />
                    ))}

                    {loading && (
                        <div className="flex gap-2 items-center p-3 rounded-2xl w-fit" style={{
                            background: theme === 'dark'
                                ? 'rgba(99, 102, 241, 0.2)'
                                : 'rgba(79, 70, 229, 0.1)',
                        }}>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Thinking...</span>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Scroll to Bottom Button */}
                {showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-24 left-1/2 -translate-x-1/2 p-2 rounded-full transition-all animate-bounce"
                        style={{
                            background: theme === 'dark'
                                ? 'rgba(99, 102, 241, 0.3)'
                                : 'rgba(79, 70, 229, 0.2)',
                        }}
                        aria-label="Scroll to bottom"
                    >
                        <ChevronDown className="w-5 h-5" />
                    </button>
                )}

                {/* Input Area */}
                <ChatInput
                    question={question}
                    setQuestion={setQuestion}
                    onSubmit={handleSendMessage}
                    loading={loading}
                />
            </div>
        </div>
    );
}
