import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeConfig } from '@app-types';
import { GlassButton } from './GlassButton';

interface ThemeToggleProps {
    theme: ThemeConfig;
    isDark: boolean;
    toggleTheme: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, isDark, toggleTheme }) => {
    return (
        <GlassButton
            theme={theme}
            onClick={toggleTheme}
            className="!p-3 !rounded-full shadow-lg backdrop-blur-xl bg-black/40 border-white/20 text-white"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </GlassButton>
    );
};
