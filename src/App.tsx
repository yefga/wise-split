import React, { useState, useMemo, useRef, useEffect, FormEvent } from 'react';
import { RotateCcw } from 'lucide-react';
import { useAppStore } from '@store';
import { ThemeConfig, PersonSummary, Settlement, Currency, Expense } from '@app-types';
import { GlassButton, Background, ThemeToggle, PeopleSection, AddExpense, Header, Footer, HistoryReports } from '@components';
import { CURRENCIES } from '@constants';
import { getTheme } from '@utils';

// --- Main App Component ---

export default function App() {
  // --- Store Hooks ---
  const {
    isDark, toggleTheme,
    people, addPerson: addPersonToStore, removePerson: removePersonFromStore,
    expenses, addExpense: addExpenseToStore, deleteExpense,
    currency, setCurrency,
    activeTab, setActiveTab,
    resetApp: resetStore
  } = useAppStore();

  // --- Local Form State (Transient) ---
  const [personName, setPersonName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [payer, setPayer] = useState<string>('');
  const [orderedBy, setOrderedBy] = useState<string>('');

  const [copiedId, setCopiedId] = useState<number | null>(null);

  // --- Layout Refs for Equal Height ---
  const leftCardRef = useRef<HTMLDivElement>(null);
  const [rightCardHeight, setRightCardHeight] = useState<number | 'auto'>('auto');

  useEffect(() => {
    const syncHeight = () => {
      if (leftCardRef.current) {
        setRightCardHeight(leftCardRef.current.offsetHeight);
      }
    };
    syncHeight();

    const resizeObserver = new ResizeObserver(() => syncHeight());
    if (leftCardRef.current) resizeObserver.observe(leftCardRef.current);

    window.addEventListener('resize', syncHeight);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [people.length, expenses.length]); // Trigger on data changes

  // --- Glassmorphism Theme Configuration ---
  // --- Glassmorphism Theme Configuration ---
  const theme: ThemeConfig = getTheme(isDark);

  // --- Handlers ---
  const handleReset = () => {
    if (window.confirm('Reset everything?')) {
      resetStore();
      // Reset local form state
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
    } catch (err) { console.error('Failed', err); }
    document.body.removeChild(textArea);
  };

  const handleAddPerson = (e: FormEvent) => {
    e.preventDefault();
    const name = personName.trim();
    if (!name) return;

    const success = addPersonToStore(name);
    if (!success) {
      setNameError(`"${name}" is taken. Please add more identity.`);
    } else {
      setPersonName('');
      setNameError('');
    }
  };

  const handleRemovePerson = (name: string) => {
    removePersonFromStore(name);
    // Clear local selection if that person was selected
    if (payer === name) setPayer('');
    if (orderedBy === name) setOrderedBy('');
  };

  const handleAddExpense = (e: FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !payer || !orderedBy) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const involved = orderedBy === 'Everyone' ? [...people] : [orderedBy];

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

    // Reset Form
    setDescription('');
    setAmount('');
    setPayer('');
    setOrderedBy('');
  };

  // --- Calculations ---
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
    <div className={`min-h-screen font-grotesk transition-colors duration-500 ${theme.appBg} text-sm md:text-base relative overflow-x-hidden pb-20 md:pb-10`}>

      <Background isDark={isDark} />

      {/* Main Content */}
      <div className="relative z-10">

        {/* Header */}
        <Header
          theme={theme}
          currency={currency}
          setCurrency={setCurrency}
          currencies={currencies}
          totalSpent={totalSpent}
        />

        <main className="max-w-5xl mx-auto px-4 space-y-8">

          {/* People Section */}
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

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Add Expense */}
            <div className="md:col-span-5">
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
                cardRef={leftCardRef}
              />
            </div>

            {/* History & Reports */}
            <div className="md:col-span-7">
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
                cardStyle={{ height: rightCardHeight }}
              />
            </div>
          </div>
        </main>

        {/* Fixed Bottom Elements */}
        <Footer isDark={isDark} />

        <div className="fixed bottom-4 right-4 flex gap-3 z-50">
          <ThemeToggle theme={theme} isDark={isDark} toggleTheme={toggleTheme} />
          <GlassButton theme={theme} onClick={handleReset} className="!p-3 !rounded-full shadow-lg backdrop-blur-xl bg-black/40 border-white/20 text-rose-400">
            <RotateCcw className="w-5 h-5" />
          </GlassButton>
        </div>
      </div>
    </div>
  );
}