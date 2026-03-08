'use client';

import { useTheme } from 'next-themes';

/**
 * Markdown Renderer Component
 * Renders markdown content including tables, lists, bold, code blocks, etc.
 * Theme-aware styling for both dark and light modes
 */
interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    const { theme } = useTheme();

    // Parse markdown and return JSX
    const parseMarkdown = (text: string) => {
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // Check if this is a table
            if (i + 1 < lines.length && lines[i + 1].includes('|')) {
                const tableLines = [line, lines[i + 1]];
                let j = i + 2;

                while (j < lines.length && lines[j].includes('|')) {
                    tableLines.push(lines[j]);
                    j++;
                }

                if (tableLines.length > 2) {
                    elements.push(
                        <div key={`table-${i}`} className="my-3 overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr>
                                        {tableLines[0]
                                            .split('|')
                                            .filter((cell) => cell.trim())
                                            .map((cell, idx) => (
                                                <th
                                                    key={idx}
                                                    className="border px-3 py-2 text-left font-semibold"
                                                    style={{
                                                        background: theme === 'dark'
                                                            ? 'rgba(99, 102, 241, 0.2)'
                                                            : 'rgba(79, 70, 229, 0.1)',
                                                        borderColor: theme === 'dark'
                                                            ? 'rgba(255, 255, 255, 0.1)'
                                                            : 'rgba(0, 0, 0, 0.1)',
                                                        color: theme === 'dark'
                                                            ? '#ffffff'
                                                            : '#1e293b',
                                                    }}
                                                >
                                                    {cell.trim()}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableLines.slice(2).map((row, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {row
                                                .split('|')
                                                .filter((cell) => cell.trim())
                                                .map((cell, cellIdx) => (
                                                    <td
                                                        key={cellIdx}
                                                        className="border px-3 py-2"
                                                        style={{
                                                            borderColor: theme === 'dark'
                                                                ? 'rgba(255, 255, 255, 0.05)'
                                                                : 'rgba(0, 0, 0, 0.05)',
                                                            background: rowIdx % 2 === 0
                                                                ? theme === 'dark'
                                                                    ? 'transparent'
                                                                    : 'transparent'
                                                                : theme === 'dark'
                                                                    ? 'rgba(255, 255, 255, 0.02)'
                                                                    : 'rgba(0, 0, 0, 0.02)',
                                                        }}
                                                    >
                                                        {cell.trim()}
                                                    </td>
                                                ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                    i = j;
                    continue;
                }
            }

            // Check for bullet points
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                const bulletLines = [];
                let j = i;

                while (j < lines.length && (lines[j].trim().startsWith('•') || lines[j].trim().startsWith('-'))) {
                    bulletLines.push(lines[j].trim().substring(1).trim());
                    j++;
                }

                elements.push(
                    <ul key={`bullets-${i}`} className="my-2 ml-4 space-y-1">
                        {bulletLines.map((item, idx) => (
                            <li key={idx} className="list-disc text-sm">
                                {parseInlineMarkdown(item)}
                            </li>
                        ))}
                    </ul>
                );
                i = j;
                continue;
            }

            // Check for headings
            if (line.startsWith('###')) {
                elements.push(
                    <h4
                        key={`h4-${i}`}
                        className="text-sm font-bold mt-2 mb-1"
                        style={{
                            color: theme === 'dark'
                                ? '#ffffff'
                                : '#1e293b',
                        }}
                    >
                        {line.replace(/^###\s/, '')}
                    </h4>
                );
                i++;
                continue;
            }

            if (line.startsWith('##')) {
                elements.push(
                    <h3
                        key={`h3-${i}`}
                        className="text-base font-bold mt-3 mb-2"
                        style={{
                            color: theme === 'dark'
                                ? '#ffffff'
                                : '#1e293b',
                        }}
                    >
                        {line.replace(/^##\s/, '')}
                    </h3>
                );
                i++;
                continue;
            }

            if (line.startsWith('#')) {
                elements.push(
                    <h2
                        key={`h2-${i}`}
                        className="text-lg font-bold mt-3 mb-2"
                        style={{
                            color: theme === 'dark'
                                ? '#ffffff'
                                : '#1e293b',
                        }}
                    >
                        {line.replace(/^#\s/, '')}
                    </h2>
                );
                i++;
                continue;
            }

            // Regular paragraph
            if (line.trim()) {
                elements.push(
                    <p key={`p-${i}`} className="text-sm leading-relaxed my-1">
                        {parseInlineMarkdown(line)}
                    </p>
                );
            }

            i++;
        }

        return elements;
    };

    // Parse inline markdown (bold, code, links)
    const parseInlineMarkdown = (text: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        const boldRegex = /\*\*(.*?)\*\*/g;
        const codeRegex = /`([^`]+)`/g;
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;

        const allMatches: Array<{
            type: 'bold' | 'code' | 'link';
            start: number;
            end: number;
            content: string;
            href?: string;
        }> = [];

        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            allMatches.push({
                type: 'bold',
                start: match.index,
                end: match.index + match[0].length,
                content: match[1],
            });
        }

        codeRegex.lastIndex = 0;
        while ((match = codeRegex.exec(text)) !== null) {
            allMatches.push({
                type: 'code',
                start: match.index,
                end: match.index + match[0].length,
                content: match[1],
            });
        }

        linkRegex.lastIndex = 0;
        while ((match = linkRegex.exec(text)) !== null) {
            allMatches.push({
                type: 'link',
                start: match.index,
                end: match.index + match[0].length,
                content: match[1],
                href: match[2],
            });
        }

        allMatches.sort((a, b) => a.start - b.start);

        allMatches.forEach((item, idx) => {
            if (item.start > lastIndex) {
                parts.push(text.substring(lastIndex, item.start));
            }

            if (item.type === 'bold') {
                parts.push(
                    <strong key={`bold-${idx}`} className="font-semibold">
                        {item.content}
                    </strong>
                );
            } else if (item.type === 'code') {
                parts.push(
                    <code
                        key={`code-${idx}`}
                        className="px-1.5 py-0.5 rounded text-xs font-mono"
                        style={{
                            background: theme === 'dark'
                                ? 'rgba(99, 102, 241, 0.2)'
                                : 'rgba(79, 70, 229, 0.1)',
                            color: theme === 'dark'
                                ? '#e0e7ff'
                                : '#4f46e5',
                        }}
                    >
                        {item.content}
                    </code>
                );
            } else if (item.type === 'link') {
                parts.push(
                    <a
                        key={`link-${idx}`}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:opacity-70 transition"
                        style={{
                            color: theme === 'dark'
                                ? '#818cf8'
                                : '#4f46e5',
                        }}
                    >
                        {item.content}
                    </a>
                );
            }

            lastIndex = item.end;
        });

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    };

    return (
        <div className="prose prose-sm max-w-none">
            {parseMarkdown(content)}
        </div>
    );
}
