import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ThemeConfig } from '@app-types';
// Ensure these are imported correctly based on your folder structure
import { ThemeToggle, GlassButton } from '@components';

interface FooterProps {
    isDark: boolean;
    theme: ThemeConfig;
    toggleTheme: () => void;
    handleReset: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isDark, theme, toggleTheme, handleReset }) => {
    return (
        <footer className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 w-full mt-3 items-center relative z-20">

            <div className="md:col-span-5">
                <p className={`text-xs font-medium opacity-50 ${isDark ? 'text-white' : 'text-slate-600'} mix-blend-difference transition-colors duration-500`}>
                    &copy; {new Date().getFullYear()} SmartSplit. Created by Yefga.
                </p>
            </div>

            <div className="md:col-span-7 flex justify-end gap-3">
                <ThemeToggle theme={theme} isDark={isDark} toggleTheme={toggleTheme} />

                <GlassButton
                    theme={theme}
                    onClick={handleReset}
                    className="!p-3 !rounded-full shadow-lg backdrop-blur-xl bg-black/40 border-white/20 text-rose-400"
                >
                    <RotateCcw className="w-5 h-5" />
                </GlassButton>
            </div>
        </footer>
    );
};