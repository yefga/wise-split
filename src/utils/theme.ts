import { ThemeConfig } from '@app-types';

export const getTheme = (isDark: boolean): ThemeConfig => {
    return isDark ? {
        appBg: 'bg-[#0f172a]',
        gradient: 'from-slate-900 via-purple-900/40 to-slate-900',
        card: 'bg-gray-900/40 text-white',
        border: 'border-white/10',
        shadow: 'shadow-2xl shadow-black/20',
        input: 'bg-black/20 text-white hover:bg-black/30',
        inputBorder: 'border-white/5',
        button: 'bg-white/5 text-white hover:bg-white/10',
        buttonPrimary: 'bg-blue-600/80 text-white hover:bg-blue-500/80 shadow-lg shadow-blue-900/20',
        textMuted: 'text-white/50',
        textHighlight: 'text-blue-300',
        accent: 'text-blue-400',
        success: 'text-emerald-400',
        danger: 'text-rose-400',
        successBg: 'bg-emerald-500/20',
        dangerBg: 'bg-rose-500/20',
    } : {
        appBg: 'bg-[#f0f4f8]',
        gradient: 'from-blue-100 via-indigo-200 to-purple-100',
        card: 'bg-white/60 text-slate-800',
        border: 'border-white/40',
        shadow: 'shadow-xl shadow-blue-900/5',
        input: 'bg-white/50 text-slate-800 hover:bg-white/70',
        inputBorder: 'border-white/30',
        button: 'bg-white/50 text-slate-700 hover:bg-white/80',
        buttonPrimary: 'bg-blue-600/90 text-white hover:bg-blue-500/90 shadow-lg shadow-blue-500/20',
        textMuted: 'text-slate-500',
        textHighlight: 'text-blue-600',
        accent: 'text-blue-600',
        success: 'text-emerald-600',
        danger: 'text-rose-500',
        successBg: 'bg-emerald-100/50',
        dangerBg: 'bg-rose-100/50',
    };
};
