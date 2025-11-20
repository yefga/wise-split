import React from 'react';
import { ThemeConfig } from '@app-types';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    theme: ThemeConfig;
}

export const GlassInput: React.FC<GlassInputProps> = ({ className = '', theme, ...props }) => (
    <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-200 ${theme.input} border ${theme.inputBorder} focus:ring-2 focus:ring-blue-400/30 placeholder-white/40 ${className}`}
    />
);
