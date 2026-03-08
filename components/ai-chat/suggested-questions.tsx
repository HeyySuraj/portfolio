'use client';

import { useTheme } from 'next-themes';
import { Send } from 'lucide-react';

/**
 * Suggested Questions Component
 * Displays clickable suggestion prompts for the user
 */
interface SuggestedQuestionsProps {
    onSelectQuestion: (question: string) => void;
    loading: boolean;
}

const SUGGESTED_QUESTIONS = [
    'What AI work has Suraj done?',
    'What projects has Suraj built?',
    'Is Suraj available for work?',
];

export default function SuggestedQuestions({
    onSelectQuestion,
    loading,
}: SuggestedQuestionsProps) {
    const { theme } = useTheme();

    return (
        <div className="space-y-2 px-4 py-3">
            <p
                className="text-xs font-medium mb-3"
                style={{
                    color: theme === 'dark'
                        ? 'rgba(255, 255, 255, 0.6)'
                        : 'rgba(0, 0, 0, 0.5)',
                }}
            >
                Quick suggestions:
            </p>

            {SUGGESTED_QUESTIONS.map((question, idx) => (
                <button
                    key={idx}
                    onClick={() => onSelectQuestion(question)}
                    disabled={loading}
                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: theme === 'dark'
                            ? 'rgba(99, 102, 241, 0.1)'
                            : 'rgba(79, 70, 229, 0.08)',
                        border: theme === 'dark'
                            ? '1px solid rgba(99, 102, 241, 0.3)'
                            : '1px solid rgba(79, 70, 229, 0.2)',
                        color: theme === 'dark'
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(0, 0, 0, 0.8)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = theme === 'dark'
                            ? 'rgba(99, 102, 241, 0.2)'
                            : 'rgba(79, 70, 229, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = theme === 'dark'
                            ? 'rgba(99, 102, 241, 0.1)'
                            : 'rgba(79, 70, 229, 0.08)';
                    }}
                >
                    <div className="flex items-center gap-2">
                        <Send className="w-3.5 h-3.5 flex-shrink-0" style={{
                            color: theme === 'dark'
                                ? 'rgba(99, 102, 241, 0.8)'
                                : 'rgba(79, 70, 229, 0.7)',
                        }} />
                        <span className="text-xs font-medium">{question}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}
