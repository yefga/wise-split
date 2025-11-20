import React, { ChangeEvent, useState } from 'react';
import { ThemeConfig, Currency } from '@app-types';
import { GlassCard } from '@components';
import { APP_NAME, LABEL_CURRENCY, LABEL_TOTAL, CONFIRM_RESET_MESSAGE, CONFIRM_CHANGE_CURRENCY } from '@constants';
// Import the new modal
import { ConfirmModal } from './ConfirmModal';

interface HeaderProps {
    theme: ThemeConfig;
    currency: string;
    setCurrency: (value: string) => void;
    currencies: Currency[];
    totalSpent: number;
}

export const Header: React.FC<HeaderProps> = ({
    theme,
    currency,
    setCurrency,
    currencies,
    totalSpent
}) => {
    // Local state for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);

    // 1. Handle Dropdown Change
    const handleCurrencySelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;

        // If selection is the same, do nothing
        if (selectedCode === currency) return;

        // Store the user's choice and open modal
        setPendingCurrency(selectedCode);
        setIsModalOpen(true);
    };

    // 2. Handle "Yes, Reset"
    const confirmChange = () => {
        if (pendingCurrency) {
            setCurrency(pendingCurrency); // Update Global Store
        }
        closeModal();
    };

    // 3. Handle "Cancel"
    const closeModal = () => {
        setIsModalOpen(false);
        setPendingCurrency(null);
    };

    // Get full object for display
    const activeCurrency = currencies.find(c => c.code === currency) || currencies[0];

    return (
        <>
            <div className="px-6 py-6 sticky top-0 z-50">
                <GlassCard theme={theme} className="max-w-5xl mx-auto !py-4 !px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 !rounded-full backdrop-blur-2xl">
                    <h1 className={`text-xl font-bold flex items-center gap-3 ${theme.textHighlight} tracking-wide`}>
                        {APP_NAME}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.input} border ${theme.border}`}>
                            <span className="text-xs uppercase font-bold tracking-wider opacity-60">{LABEL_CURRENCY}</span>
                            <select
                                value={currency}
                                onChange={handleCurrencySelect}
                                className="bg-transparent font-bold outline-none cursor-pointer text-sm"
                            >
                                {currencies.map((c) => (
                                    <option key={c.code} value={c.code} className="text-slate-800 bg-white">
                                        {`${c.flag}  ${c.label}`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`hidden sm:block px-4 py-1.5 rounded-full font-bold ${theme.input} border ${theme.border} ${theme.textHighlight}`}>
                            {LABEL_TOTAL}: {activeCurrency.symbol} {Intl.NumberFormat(activeCurrency.locale).format(totalSpent)}
                        </div>
                    </div>
                </GlassCard>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                title={CONFIRM_CHANGE_CURRENCY}
                message={CONFIRM_RESET_MESSAGE}
                onConfirm={confirmChange}
                onCancel={closeModal}
            />
        </>
    );
};