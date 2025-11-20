import { create } from 'zustand';
import { Expense } from '@app-types';

interface AppState {
    // Theme
    isDark: boolean;
    toggleTheme: () => void;

    // Global Data
    people: string[];
    expenses: Expense[];
    currency: string;
    activeTab: 'expenses' | 'report';

    // Actions
    setCurrency: (symbol: string) => void;
    setActiveTab: (tab: 'expenses' | 'report') => void;
    addPerson: (name: string) => boolean; // returns success status
    removePerson: (name: string) => void;
    addExpense: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
    resetApp: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    isDark: true,
    toggleTheme: () => set((state) => ({ isDark: !state.isDark })),

    people: [],
    expenses: [],
    currency: '$',
    activeTab: 'expenses',

    setCurrency: (currency) => set({ currency }),
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
            // Optional: We could cascade delete expenses involving this person here if desired
        })),

    addExpense: (expense) =>
        set((state) => ({ expenses: [expense, ...state.expenses] })),

    deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

    resetApp: () =>
        set({
            people: [],
            expenses: [],
            activeTab: 'expenses',
            // We keep theme and currency as they are user preferences usually
        }),
}));
