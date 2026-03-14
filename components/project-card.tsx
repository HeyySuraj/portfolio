'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectCardProps {
    title: string;
    description: string;
    image: string;
    tech: string[];
    github: string;
    live: string;
    index?: number;
}

export default function ProjectCard({
    title,
    description,
    image,
    tech,
    github,
    live,
    index = 0,
}: ProjectCardProps) {
    const { theme } = useTheme();
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate tilt angles based on mouse position
        const rotateY = ((e.clientX - centerX) / rect.width) * 25; // Max 25 degrees
        const rotateX = ((centerY - e.clientY) / rect.height) * 25; // Max 25 degrees

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovering(false);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: '1000px',
                animation: `slideUp 0.6s ease-out ${index * 0.1}s backwards`,
            }}
            className="h-full"
        >
            <Card
                className={`
          group h-full overflow-hidden border-0 bg-card/50 
          transition-all duration-300 cursor-pointer relative
          ${!isMobile ? 'hover:shadow-2xl' : ''}
        `}
                style={{
                    transform: isMobile
                        ? 'none'
                        : `
              perspective(1000px)
              rotateX(${tilt.x}deg)
              rotateY(${tilt.y}deg)
              ${isHovering ? 'scale(1.05) translateZ(20px)' : 'scale(1)'}
            `,
                    transformStyle: 'preserve-3d',
                    transition: 'all 0.1s ease-out',
                }}
            >
                {/* Animated gradient border on hover */}
                <div
                    className={`
            absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300
            ${isHovering && !isMobile ? 'opacity-100' : 'opacity-0'}
            pointer-events-none
          `}
                    style={{
                        background: theme === 'dark'
                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.4) 0%, rgba(139, 92, 246, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.15) 100%)',
                        padding: '1px',
                    }}
                />

                {/* Glow effect */}
                <div
                    className={`
            absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300
            blur-xl pointer-events-none
            ${isHovering && !isMobile ? 'opacity-100' : 'opacity-0'}
          `}
                    style={{
                        background: theme === 'dark'
                            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                    }}
                />

                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                        src={image || '/placeholder.svg'}
                        alt={title}
                        className={`
              w-full h-full object-cover transition-transform duration-500
              ${isHovering ? 'scale-110' : 'scale-100'}
            `}
                    />

                    {/* Image overlay on hover */}
                    <div
                        className={`
              absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40
              transition-opacity duration-300
              ${isHovering && !isMobile ? 'opacity-100' : 'opacity-0'}
            `}
                    />
                </div>

                {/* Content Section */}
                <CardContent className="relative p-6 space-y-4">
                    <div>
                        <h3
                            className={`
                text-lg font-semibold mb-2 transition-colors duration-200
                ${isHovering ? 'text-primary' : 'text-foreground'}
              `}
                        >
                            {title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-2">
                        {tech.map((techItem) => (
                            <Badge
                                key={techItem}
                                variant="secondary"
                                className={`
                  text-xs transition-all duration-200 cursor-default
                  ${isHovering ? 'scale-110 shadow-md' : 'scale-100'}
                `}
                            >
                                {techItem}
                            </Badge>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className={`
                text-xs bg-transparent transition-all duration-200
                ${isHovering ? 'scale-110 shadow-lg' : 'scale-100'}
              `}
                        >
                            <a
                                href={github}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View on GitHub"
                            >
                                <Github className="h-4 w-4 mr-1" />
                                Code
                            </a>
                        </Button>

                        <Button
                            size="sm"
                            asChild
                            className={`
                transition-all duration-200
                ${isHovering
                                    ? 'scale-110 shadow-lg bg-primary text-primary-foreground'
                                    : 'scale-100 bg-primary/80 text-primary-foreground'
                                }
              `}
                        >
                            <a
                                href={live}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Live Demo"
                            >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Live Demo
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
