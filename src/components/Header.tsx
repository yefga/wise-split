import React, { ChangeEvent } from 'react';
import { ThemeConfig, Currency } from '@app-types';
import { GlassCard } from '@components';
import { APP_NAME, LABEL_CURRENCY, LABEL_TOTAL } from '@constants';

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
    return (
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
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value)}
                            className="bg-transparent font-bold outline-none cursor-pointer text-sm"
                        >
                            {currencies.map((c) => (
                                <option key={c.symbol} value={c.symbol} className="text-slate-800 bg-white">{c.symbol}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`hidden sm:block px-4 py-1.5 rounded-full font-bold ${theme.input} border ${theme.border} ${theme.textHighlight}`}>
                        {LABEL_TOTAL}: {currency}{totalSpent.toFixed(2)}
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
