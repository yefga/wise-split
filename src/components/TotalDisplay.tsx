import React from 'react';
import { ThemeConfig, Currency } from '@app-types';
import { LABEL_TOTAL } from '@constants';

interface TotalDisplayProps {
    theme: ThemeConfig;
    currency: string;
    currencies: Currency[];
    totalSpent: number;
}

export const TotalDisplay: React.FC<TotalDisplayProps> = ({
    theme,
    currency,
    currencies,
    totalSpent
}) => {
    const activeCurrency = currencies.find(c => c.code === currency) || currencies[0];

    return (
        <div className={`sm:block px-4 py-1.5 rounded-full font-bold ${theme.input} border ${theme.border} ${theme.textHighlight}`}>
            {LABEL_TOTAL}: {activeCurrency.symbol} {Intl.NumberFormat(activeCurrency.locale).format(totalSpent)}
        </div>
    );
};
