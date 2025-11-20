import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { ThemeConfig } from '@app-types';
import { ThemeToggle, GlassButton, ConfirmModal } from '@components';
import { COPYRIGHT_TEXT, CONFIRM_RESET, CONFIRM_RESET_BUTTON, CONFIRM_CANCEL_BUTTON } from '@constants';

interface FooterProps {
    isDark: boolean;
    theme: ThemeConfig;
    toggleTheme: () => void;
    onResetConfirmed: () => void;
    hasExpenses: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDark, theme, toggleTheme, onResetConfirmed, hasExpenses }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleResetClick = () => {
        if (!hasExpenses) {
            onResetConfirmed();
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirm = () => {
        onResetConfirmed();
        setIsModalOpen(false);
    };

    return (
        <>
            <footer className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 w-full mt-3 items-center relative z-20">

                <div className="md:col-span-5">
                    <p className={`text-xs font-medium opacity-50 ${isDark ? 'text-white' : 'text-slate-600'} mix-blend-difference transition-colors duration-500`}>
                        {COPYRIGHT_TEXT}
                    </p>
                </div>

                <div className="md:col-span-7 flex justify-end gap-3">
                    <ThemeToggle theme={theme} isDark={isDark} toggleTheme={toggleTheme} />

                    <GlassButton
                        theme={theme}
                        onClick={handleResetClick}
                        className="!p-3 !rounded-full shadow-lg backdrop-blur-xl bg-black/40 border-white/20 text-rose-400"
                    >
                        <RotateCcw className="w-5 h-5" />
                    </GlassButton>
                </div>
            </footer>

            <ConfirmModal
                isOpen={isModalOpen}
                title="Reset Application"
                message={CONFIRM_RESET}
                onConfirm={handleConfirm}
                onCancel={() => setIsModalOpen(false)}
            />
        </>
    );
};