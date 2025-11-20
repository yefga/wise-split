import React, { CSSProperties } from 'react';
import { ThemeConfig } from '@app-types';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    theme: ThemeConfig;
    cardRef?: React.RefObject<HTMLDivElement | null>;
    style?: CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', theme, cardRef, style }) => (
    <div
        ref={cardRef}
        style={style}
        className={`${theme.card} backdrop-blur-xl rounded-2xl p-6 border ${theme.border} ${theme.shadow} transition-all duration-300 ${className}`}
    >
        {children}
    </div>
);
