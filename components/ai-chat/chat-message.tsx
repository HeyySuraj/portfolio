'use client';

import { useTheme } from 'next-themes';
import { CheckCheck } from 'lucide-react';
import MarkdownRenderer from './markdown-renderer';

/**
 * Chat Message Component
 * Individual message bubble with role-based styling
 * Features smooth animations, glassmorphism effects, and markdown support
 */
interface ChatMessageProps {
    message: {
        role: 'user' | 'ai';
        text: string;
        id: string;
    };
    isLast: boolean;
}

export default function ChatMessage({ message, isLast }: ChatMessageProps) {
    const { theme } = useTheme();
    const isUser = message.role === 'user';

    return (
        <div
            className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${isUser ? 'justify-end' : 'justify-start'
                }`}
            style={{
                animationDuration: '0.3s',
                animationFillMode: 'both',
            }}
        >
            <div
                className="max-w-xs lg:max-w-sm rounded-2xl px-4 py-3 text-sm leading-relaxed break-words"
                style={{
                    background: isUser
                        ? theme === 'dark'
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)'
                            : 'linear-gradient(135deg, rgba(79, 70, 229, 0.85) 0%, rgba(109, 40, 217, 0.85) 100%)'
                        : theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: isUser
                        ? '1px solid rgba(255, 255, 255, 0.2)'
                        : theme === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : '1px solid rgba(0, 0, 0, 0.05)',
                    color: isUser
                        ? '#ffffff'
                        : theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(0, 0, 0, 0.8)',
                    boxShadow: isUser
                        ? 'rgba(99, 102, 241, 0.3) 0px 8px 24px'
                        : theme === 'dark'
                            ? 'rgba(0, 0, 0, 0.3) 0px 4px 12px'
                            : 'rgba(0, 0, 0, 0.1) 0px 2px 8px',
                }}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                ) : (
                    <div className="markdown-content">
                        <MarkdownRenderer content={message.text} />
                    </div>
                )}

                {isUser && isLast && (
                    <div className="flex items-center gap-1 mt-2 justify-end text-xs opacity-70">
                        <CheckCheck className="w-3 h-3" />
                    </div>
                )}
            </div>

            {!isUser && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0 mt-1">
                    🤖
                </div>
            )}
        </div>
    );
}
