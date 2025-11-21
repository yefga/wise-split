import React, { useEffect } from 'react';
import { useAppStore } from '@store';
import { ThemeConfig, Currency } from '@app-types';
import { Background, PeopleSection, AddExpense, Header, Footer, HistoryReports, ConfirmModal } from '@components';
import { CURRENCIES } from '@constants';
import { getTheme } from '@utils';
import {
  trackAppOpened,
  trackSessionStart,
  trackDataReset,
} from './google';

export default function App() {
  const {
    isDark, toggleTheme,
    people, addPerson: addPersonToStore, removePerson: removePersonFromStore,
    expenses, addExpense: addExpenseToStore, deleteExpense,
    currency, setCurrency,
    activeTab, setActiveTab,
    resetApp: resetStore
  } = useAppStore();

  const theme: ThemeConfig = getTheme(isDark);

  useEffect(() => {
    trackAppOpened();
    trackSessionStart({
      peopleCount: people.length,
      expenseCount: expenses.length,
      currency,
      theme: isDark ? 'dark' : 'light',
    });
  }, []);

  const handleReset = () => {
    trackDataReset(people.length, expenses.length);
    resetStore();
  };

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const currencies: Currency[] = CURRENCIES;

  return (
    <>
      <div className={`min-h-screen font-grotesk transition-colors duration-500 ${theme.appBg} text-sm md:text-base relative overflow-x-hidden pb-10`}>
        <Background isDark={isDark} />

        <div className="relative z-10 min-h-screen flex flex-col md:justify-center py-8 md:py-0">

          <Header
            theme={theme}
            currency={currency}
            setCurrency={setCurrency}
            currencies={currencies}
            totalSpent={totalSpent}
            hasExpenses={expenses.length > 0}
          />

          <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 w-full mb-4 px-5 lg:px-0">
            <div className="md:col-span-5 flex flex-col gap-8">
              <PeopleSection
                theme={theme}
                people={people}
                addPersonToStore={addPersonToStore}
                removePersonFromStore={removePersonFromStore}
              />
              <AddExpense
                theme={theme}
                people={people}
                currency={currency}
                addExpenseToStore={addExpenseToStore}
              />
            </div>

            <div className="md:col-span-7 flex flex-col h-full">
              <HistoryReports
                theme={theme}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                expenses={expenses}
                currency={currency}
                deleteExpense={deleteExpense}
                people={people}
                cardStyle={{ height: '100%' }}
              />
            </div>
          </main>

          <Footer
            isDark={isDark}
            theme={theme}
            toggleTheme={toggleTheme}
            onResetConfirmed={handleReset}
            hasExpenses={expenses.length > 0}
          />

        </div>
      </div>

    </>
  );
}