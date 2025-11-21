import React from 'react';
import { ThemeConfig, Currency } from '@app-types';
import { GlassCard, CurrencySelector, TotalDisplay } from '@components';
import { APP_NAME } from '@constants';

interface HeaderProps {
    theme: ThemeConfig;
    currency: string;
    setCurrency: (value: string) => void;
    currencies: Currency[];
    totalSpent: number;
    hasExpenses: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    theme,
    currency,
    setCurrency,
    currencies,
    totalSpent,
    hasExpenses
}) => {
    return (
        <div className="px-5 py-6 sticky top-0 z-50">
            <GlassCard theme={theme} className="max-w-5xl mx-auto !py-4 !px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 !rounded-xl backdrop-blur-2xl relative">
                <h1 className={`text-xl font-bold items-center gap-3 ${theme.textHighlight} tracking-wide hidden sm:flex`}>
                    {APP_NAME}
                </h1>

                <div className="flex items-center gap-4">
                    <CurrencySelector
                        theme={theme}
                        currency={currency}
                        setCurrency={setCurrency}
                        currencies={currencies}
                        hasExpenses={hasExpenses}
                    />

                    {/* TotalDisplay for larger screens */}
                    <div className="hidden sm:block">
                        <TotalDisplay
                            theme={theme}
                            currency={currency}
                            currencies={currencies}
                            totalSpent={totalSpent}
                        />
                    </div>
                </div>

                {/* TotalDisplay for XS screens - positioned bottom right */}
                <div className="sm:hidden absolute bottom-4 right-6">
                    <TotalDisplay
                        theme={theme}
                        currency={currency}
                        currencies={currencies}
                        totalSpent={totalSpent}
                    />
                </div>
            </GlassCard>
        </div>
    );
};