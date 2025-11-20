export interface Expense {
    id: number;
    description: string;
    amount: number;
    payer: string;
    orderedBy: string;
    involved: string[];
    date: string;
}

export interface Settlement {
    from: string;
    to: string;
    amount: number;
}

export interface PersonSummary {
    paid: number;
    share: number;
    balance: number;
}

export interface ThemeConfig {
    appBg: string;
    card: string;
    border: string;
    shadow: string;
    input: string;
    inputBorder: string;
    button: string;
    buttonPrimary: string;
    textMuted: string;
    textHighlight: string;
    accent: string;
    success: string;
    danger: string;
    successBg: string;
    dangerBg: string;
    gradient: string;
}

export interface Currency {
    label: string;
    symbol: string;
}
