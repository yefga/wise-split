import React, { ChangeEvent, useState } from 'react';
import { ThemeConfig, Currency } from '@app-types';
import { LABEL_CURRENCY, CONFIRM_RESET_MESSAGE, CONFIRM_CHANGE_CURRENCY } from '@constants';
import { ConfirmModal } from './ConfirmModal';

interface CurrencySelectorProps {
    theme: ThemeConfig;
    currency: string;
    setCurrency: (value: string) => void;
    currencies: Currency[];
    hasExpenses: boolean;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
    theme,
    currency,
    setCurrency,
    currencies,
    hasExpenses
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);

    const handleCurrencySelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedCode = e.target.value;

        if (selectedCode === currency) return;

        if (!hasExpenses) {
            setCurrency(selectedCode);
            return;
        }

        setPendingCurrency(selectedCode);
        setIsModalOpen(true);
    };

    const confirmChange = () => {
        if (pendingCurrency) {
            setCurrency(pendingCurrency);
        }
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setPendingCurrency(null);
    };

    return (
        <>
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
