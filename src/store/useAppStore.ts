import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Expense } from '@app-types';
import { DEFAULT_TAB, DEFAULT_CURRENCY, STORAGE_KEY } from '@constants';
import { CURRENCIES } from '@constants';

interface AppState {
    isDark: boolean;
    toggleTheme: () => void;
    people: string[];
    expenses: Expense[];
    currency: string;
    activeTab: 'expenses' | 'report';
    setCurrency: (code: string) => void;
    setActiveTab: (tab: 'expenses' | 'report') => void;
    addPerson: (name: string) => boolean;
    removePerson: (name: string) => void;
    addExpense: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
    resetApp: () => void;
}

const currency = CURRENCIES.find(currency => currency.code === DEFAULT_CURRENCY)?.symbol ?? DEFAULT_CURRENCY

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            isDark: true,
            toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

            people: [],
            expenses: [],
            currency: currency,
            activeTab: DEFAULT_TAB,

            setCurrency: (code: string) => set({
                currency: code,
                expenses: [],
                people: []
            }),
            setActiveTab: (activeTab) => set({ activeTab }),

            addPerson: (name) => {
                const { people } = get();
                // Duplicate check
                if (people.some((p) => p.toLowerCase() === name.toLowerCase())) {
                    return false;
                }
                set({ people: [...people, name] });
                return true;
            },

            removePerson: (name) =>
                set((state) => ({
                    people: state.people.filter((p) => p !== name),
                })),

            addExpense: (expense) =>
                set((state) => ({ expenses: [expense, ...state.expenses] })),

            deleteExpense: (id) =>
                set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

            resetApp: () =>
                set({
                    people: [],
                    expenses: [],
                    activeTab: DEFAULT_TAB,
                }),
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({
                isDark: state.isDark,
                people: state.people,
                expenses: state.expenses,
                currency: state.currency,
                activeTab: state.activeTab
            })
        }
    )
);
