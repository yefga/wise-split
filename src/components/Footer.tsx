import React from 'react';

interface FooterProps {
    isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDark }) => {
    return (
        <footer className={`fixed bottom-4 left-4 text-xs font-medium opacity-50 ${isDark ? 'text-white' : 'text-slate-600'} z-50 mix-blend-difference`}>
            <p>&copy; {new Date().getFullYear()} SmartSplit. Created by Gemini.</p>
        </footer>
    );
};
