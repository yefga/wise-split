import React from 'react';
import { ThemeConfig } from '@app-types';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme: ThemeConfig;
    primary?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ children, onClick, primary, disabled, className = '', title, theme }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`
      px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200
      ${primary ? theme.buttonPrimary : theme.button}
      backdrop-blur-md border ${theme.border}
      hover:scale-[1.02] active:scale-95
      disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100
      ${className}
    `}
    >
        {children}
    </button>
);
