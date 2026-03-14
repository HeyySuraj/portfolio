'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    scale?: number;
    maxTilt?: number;
}

export default function TiltCard({
    children,
    className = '',
    scale = 1.05,
    maxTilt = 25,
}: TiltCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const frame = useRef<number | null>(null);

    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

        if (frame.current) cancelAnimationFrame(frame.current);

        frame.current = requestAnimationFrame(() => {
            const rect = cardRef.current!.getBoundingClientRect();

            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const rotateY = ((e.clientX - centerX) / rect.width) * maxTilt;
            const rotateX = ((centerY - e.clientY) / rect.height) * maxTilt;

            setTilt({ x: rotateX, y: rotateY });
        });
    };

    const resetTilt = () => {
        if (frame.current) cancelAnimationFrame(frame.current);
        setTilt({ x: 0, y: 0 });
        setIsHovering(false);
    };

    return (
        <div
            ref={cardRef}
            className={`h-full ${className}`}
            style={{ perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={resetTilt}
        >
            <div
                style={{
                    transform: isMobile
                        ? 'none'
                        : `
            perspective(1000px)
            rotateX(${tilt.x}deg)
            rotateY(${tilt.y}deg)
            ${isHovering ? `scale(${scale}) translateZ(20px)` : 'scale(1)'}
          `,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.2s ease',
                    willChange: 'transform',
                }}
            >
                {children}
            </div>
        </div>
    );
}
