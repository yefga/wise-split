import React from 'react';
import { ThemeConfig } from '@app-types';

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    theme: ThemeConfig;
}

export const GlassSelect: React.FC<GlassSelectProps> = ({ className = '', theme, ...props }) => (
    <select
        {...props}
        className={`w-full px-4 py-3 rounded-xl outline-none appearance-none cursor-pointer transition-all duration-200 ${theme.input} border ${theme.inputBorder} focus:ring-2 focus:ring-blue-400/30 ${className}`}
    />
);
