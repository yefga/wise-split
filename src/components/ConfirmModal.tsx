import React from 'react';
import { CONFIRM_CANCEL_BUTTON, CONFIRM_RESET_BUTTON } from '@constants';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all scale-100">

                <div className="bg-amber-50 p-6 flex flex-col items-center text-center border-b border-amber-100">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">
                        {title}
                    </h3>
                </div>

                <div className="p-6 text-center">
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex items-center gap-3 p-6 pt-0">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm"
                    >
                        {CONFIRM_CANCEL_BUTTON}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 bg-red-500 rounded-xl text-white font-semibold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors text-sm"
                    >
                        {CONFIRM_RESET_BUTTON}
                    </button>
                </div>
            </div>
        </div>
    );
};