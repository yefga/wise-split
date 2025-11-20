import React, { useState, useMemo, useRef, useEffect, FormEvent } from 'react';
import { Trash2, Receipt, ArrowRight, Wallet, RotateCcw, Copy, Check, Activity } from 'lucide-react';
import { useAppStore } from '@store';
import { ThemeConfig, PersonSummary, Settlement, Currency, Expense } from '@app-types';
import { GlassButton, GlassCard, Background, ThemeToggle, PeopleSection, AddExpense, Header, Footer } from '@components';
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
              <GlassCard theme={theme} style={{ height: rightCardHeight }} className="flex flex-col !p-0 overflow-hidden">

                {/* Tabs Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
                  <h3 className={`font-bold ${theme.textMuted} uppercase tracking-wider text-sm`}>
                    {activeTab === 'expenses' ? 'Activity' : 'Settlement'}
                  </h3>
                  <div className={`flex p-1 rounded-lg ${theme.input}`}>
                    {(['expenses', 'report'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab ? `${theme.buttonPrimary}` : `hover:text-white ${theme.textMuted}`}`}
                      >
                        {tab === 'expenses' ? 'History' : 'Plan'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                  {activeTab === 'expenses' && (
                    expenses.length === 0 ? (
                      <div className={`flex flex-col items-center justify-center h-full ${theme.textMuted} opacity-50`}>
                        <Receipt className="w-12 h-12 mb-4 opacity-50" />
                        <p>No records yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {expenses.map(ex => (
                          <div key={ex.id} className={`animate-slide p-4 rounded-xl flex justify-between items-center group transition-all hover:bg-white/5 border border-transparent hover:border-white/10`}>
                            <div>
                              <div className="font-bold">{ex.description}</div>
                              <div className={`text-xs ${theme.textMuted} mt-1`}>
                                <span className={theme.accent}>{ex.payer}</span> paid <span className="font-mono font-bold">{currency}{ex.amount.toFixed(2)}</span>
                              </div>
                              <div className={`text-[10px] uppercase font-bold mt-1 opacity-60`}>
                                To: {ex.payer === ex.orderedBy ? 'Himself' : ex.orderedBy}
                              </div>
                            </div>
                            <button onClick={() => deleteExpense(ex.id)} className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 ${theme.danger} transition-all`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {activeTab === 'report' && (
                    <div className="space-y-8">
                      {/* Balances */}
                      <div className={`p-4 rounded-2xl ${theme.input} animate-slide`}>
                        <div className="flex items-center gap-2 mb-4 opacity-70">
                          <Wallet className="w-4 h-4" />
                          <h4 className="font-bold uppercase text-xs">Net Balances</h4>
                        </div>
                        <div className="space-y-2">
                          {people.map(p => {
                            const d = personSummary[p] || { balance: 0 };
                            const isOwed = d.balance > 0.01;
                            const isOwing = d.balance < -0.01;
                            return (
                              <div key={p} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                <span className="font-medium">{p}</span>
                                <span className={`font-bold font-mono ${isOwed ? theme.success : isOwing ? theme.danger : theme.textMuted}`}>
                                  {isOwed ? '+' : ''}{currency}{d.balance.toFixed(2)}
                                </span>
                              </div>
                            )
                          })}
                          {people.length === 0 && <div className={`text-center py-2 ${theme.textMuted}`}>No data</div>}
                        </div>
                      </div>

                      {/* Settlement */}
                      <div className="animate-slide" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-2 mb-4 opacity-70 px-2">
                          <Activity className="w-4 h-4" />
                          <h4 className="font-bold uppercase text-xs">Settlement Plan</h4>
                        </div>

                        {settlements.length === 0 ? (
                          <div className={`py-8 text-center rounded-2xl border border-dashed border-white/10 ${theme.textMuted}`}>
                            <p>{expenses.length === 0 ? "Add expenses" : "Settled up!"}</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {settlements.map((item, i) => {
                              const txt = `${item.from} pay to ${item.to} for ${currency}${item.amount.toFixed(2)}`;
                              return (
                                <div key={i} className={`relative p-4 rounded-xl flex items-center justify-between ${theme.input} border ${theme.border} group`}>
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="font-bold truncate max-w-[80px]">{item.from}</span>
                                    <ArrowRight className={`w-3 h-3 ${theme.textMuted}`} />
                                    <span className="font-bold truncate max-w-[80px]">{item.to}</span>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className={`font-bold font-mono ${theme.success}`}>{currency}{item.amount.toFixed(2)}</span>
                                    <button onClick={() => handleCopy(txt, i)} className={`p-1.5 rounded-lg hover:bg-white/10 transition-all text-white/60 hover:text-white`}>
                                      {copiedId === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
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