import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import { useAppStore } from '@store';
import { ThemeConfig, PersonSummary, Settlement, Currency, Expense } from '@app-types';
import { Background, PeopleSection, AddExpense, Header, Footer, HistoryReports } from '@components';
import { CURRENCIES, EVERYONE_OPTION, ERROR_NAME_TAKEN, CONFIRM_RESET } from '@constants';
import { getTheme } from '@utils';
import {
  trackAppOpened,
  trackSessionStart,
  trackPersonAdded,
  trackPersonRemoved,
  trackExpenseAdded,
  trackDataReset,
  trackSettlementCopied,
  trackError
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

  const [personName, setPersonName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [payer, setPayer] = useState<string>('');
  const [orderedBy, setOrderedBy] = useState<string>('');

  const [copiedId, setCopiedId] = useState<number | null>(null);
  const theme: ThemeConfig = getTheme(isDark);

  // --- Analytics: Track App Initialization ---
  useEffect(() => {
    console.log(currency)
    trackAppOpened();
    trackSessionStart({
      peopleCount: people.length,
      expenseCount: expenses.length,
      currency,
      theme: isDark ? 'dark' : 'light',
    });
  }, []);

  // --- Handlers ---
  const handleReset = () => {
    if (window.confirm(CONFIRM_RESET)) {
      // Track before resetting
      trackDataReset(people.length, expenses.length);

      resetStore();
      setPersonName('');
      setDescription('');
      setAmount('');
      setPayer('');
      setOrderedBy('');
      setNameError('');
    }
  };

  const handleCopy = (text: string, id: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);

      trackSettlementCopied(id);
    } catch (err) {
      console.error('Failed', err);
      trackError('Copy failed', 'handleCopy');
    }
    document.body.removeChild(textArea);
  };

  const handleAddPerson = (e: FormEvent) => {
    e.preventDefault();
    const name = personName.trim();
    if (!name) return;

    const success = addPersonToStore(name);
    if (!success) {
      setNameError(`"${name}" ${ERROR_NAME_TAKEN}`);
      trackError(`Person name already exists: ${name}`, 'handleAddPerson');
    } else {
      setPersonName('');
      setNameError('');

      // Track person added with updated count
      trackPersonAdded(name, people.length + 1);
    }
  };

  const handleRemovePerson = (name: string) => {
    removePersonFromStore(name);
    if (payer === name) setPayer('');
    if (orderedBy === name) setOrderedBy('');

    // Track person removed with updated count
    trackPersonRemoved(name, people.length - 1);
  };

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !payer || !orderedBy) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const involved = orderedBy === EVERYONE_OPTION ? [...people] : [orderedBy];

    const newExpense: Expense = {
      id: Date.now(),
      description,
      amount: numAmount,
      payer,
      orderedBy,
      involved,
      date: new Date().toLocaleDateString()
    };

    addExpenseToStore(newExpense);

    // Track expense added
    trackExpenseAdded({
      amount: numAmount,
      payer,
      orderedBy,
      involved,
      currency,
    });

    setDescription('');
    setAmount('');
    setPayer('');
    setOrderedBy('');
  };

  const personSummary = useMemo<Record<string, PersonSummary>>(() => {
    const summary: Record<string, PersonSummary> = {};
    people.forEach(p => { summary[p] = { paid: 0, share: 0, balance: 0 }; });
    expenses.forEach(exp => {
      const { payer, amount, involved } = exp;
      if (summary[payer]) { summary[payer].paid += amount; }
      if (involved.length > 0) {
        const split = amount / involved.length;
        involved.forEach(p => { if (summary[p]) summary[p].share += split; });
      }
    });
    Object.keys(summary).forEach(p => { summary[p].balance = summary[p].paid - summary[p].share; });
    return summary;
  }, [expenses, people]);

  const settlements = useMemo<Settlement[]>(() => {
    if (people.length < 2 || expenses.length === 0) return [];
    const balances: Record<string, number> = {};
    people.forEach(p => balances[p] = 0);
    expenses.forEach(exp => {
      const { payer, amount, involved } = exp;
      if (involved.length > 0) {
        if (balances[payer] !== undefined) balances[payer] += amount;
        const share = amount / involved.length;
        involved.forEach(p => { if (balances[p] !== undefined) balances[p] -= share; });
      }
    });
    let debtors: { person: string, amount: number }[] = [];
    let creditors: { person: string, amount: number }[] = [];
    Object.keys(balances).forEach(p => {
      if (balances[p] < -0.01) debtors.push({ person: p, amount: balances[p] });
      if (balances[p] > 0.01) creditors.push({ person: p, amount: balances[p] });
    });
    debtors.sort((a, b) => a.amount - b.amount);
    creditors.sort((a, b) => b.amount - a.amount);
    const results: Settlement[] = [];
    let i = 0; let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amt = Math.min(Math.abs(debtors[i].amount), creditors[j].amount);
      results.push({ from: debtors[i].person, to: creditors[j].person, amount: amt });
      debtors[i].amount += amt;
      creditors[j].amount -= amt;
      if (Math.abs(debtors[i].amount) < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }
    return results;
  }, [expenses, people]);

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const currencies: Currency[] = CURRENCIES;

  return (
    <div className={`min-h-screen font-grotesk transition-colors duration-500 ${theme.appBg} text-sm md:text-base relative overflow-x-hidden pb-10`}>

      <Background isDark={isDark} />

      <div className="relative z-10 min-h-screen flex flex-col md:justify-center py-8 md:py-0">

        <Header
          theme={theme}
          currency={currency}
          setCurrency={setCurrency}
          currencies={currencies}
          totalSpent={totalSpent}
        />

        <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 w-full mb-4">

          <div className="md:col-span-5 flex flex-col gap-8">
            <PeopleSection
              theme={theme}
              people={people}
              personName={personName}
              nameError={nameError}
              setPersonName={setPersonName}
              setNameError={setNameError}
              handleAddPerson={handleAddPerson}
              handleRemovePerson={handleRemovePerson}
            />
            <AddExpense
              theme={theme}
              people={people}
              currency={currency}
              description={description}
              setDescription={setDescription}
              amount={amount}
              setAmount={setAmount}
              payer={payer}
              setPayer={setPayer}
              orderedBy={orderedBy}
              setOrderedBy={setOrderedBy}
              handleAddExpense={handleAddExpense}
            />
          </div>

          {/* Right Column */}
          <div className="md:col-span-7 flex flex-col h-full">
            <HistoryReports
              theme={theme}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expenses={expenses}
              currency={currency}
              deleteExpense={deleteExpense}
              people={people}
              personSummary={personSummary}
              settlements={settlements}
              handleCopy={handleCopy}
              copiedId={copiedId}
              cardStyle={{ height: '100%' }}
            />
          </div>
        </main>

        <Footer
          isDark={isDark}
          theme={theme}
          toggleTheme={toggleTheme}
          handleReset={handleReset}
        />

      </div>
    </div>
  );
}