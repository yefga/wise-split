import React, { CSSProperties, useState, useMemo } from 'react';
import { Receipt, Trash2, Wallet, Activity, ArrowRight, Check, Copy } from 'lucide-react';
import { ThemeConfig, Expense, PersonSummary, Settlement } from '@app-types';
import { GlassCard } from '@components';
import {
    SECTION_ACTIVITY, SECTION_SETTLEMENT, BTN_HISTORY, BTN_PLAN,
    MSG_NO_RECORDS, MSG_NO_DATA, SECTION_NET_BALANCES, SECTION_SETTLEMENT_PLAN,
    MSG_ADD_EXPENSES, MSG_SETTLED_UP, LABEL_PAID, LABEL_TO_PREFIX, LABEL_HIMSELF,
    LABEL_PAY_TO, LABEL_FOR
} from '@constants';
import { trackError } from '@google';

interface HistoryReportsProps {
    theme: ThemeConfig;
    activeTab: 'expenses' | 'report';
    setActiveTab: (tab: 'expenses' | 'report') => void;
    expenses: Expense[];
    currency: string;
    deleteExpense: (id: number) => void;
    people: string[];
    cardStyle?: CSSProperties;
}

export const HistoryReports: React.FC<HistoryReportsProps> = ({
    theme,
    activeTab,
    setActiveTab,
    expenses,
    currency,
    deleteExpense,
    people,
    cardStyle
}) => {
    const [copiedId, setCopiedId] = useState<number | null>(null);

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

    const handleCopy = (text: string, id: number) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);

        } catch (err) {
            console.error('Failed', err);
            trackError('Copy failed', 'handleCopy');
        }
        document.body.removeChild(textArea);
    };

    return (
        <GlassCard theme={theme} style={cardStyle} className="flex flex-col !p-0 overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md">
                <h3 className={`font-bold ${theme.textMuted} uppercase tracking-wider text-sm`}>
                    {activeTab === 'expenses' ? SECTION_ACTIVITY : SECTION_SETTLEMENT}
                </h3>
                <div className={`flex p-1 rounded-lg ${theme.input}`}>
                    {(['expenses', 'report'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab ? `${theme.buttonPrimary}` : `hover:text-white ${theme.textMuted}`}`}
                        >
                            {tab === 'expenses' ? BTN_HISTORY : BTN_PLAN}
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
                            <p>{MSG_NO_RECORDS}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {expenses.map(ex => (
                                <div key={ex.id} className={`animate-slide p-4 rounded-xl flex justify-between items-center group transition-all hover:bg-white/5 border border-transparent hover:border-white/10`}>
                                    <div>
                                        <div className="font-bold">{ex.description}</div>
                                        <div className={`text-xs ${theme.textMuted} mt-1`}>
                                            <span className={theme.accent}>{ex.payer}</span>{LABEL_PAID}<span className="font-mono font-bold">{currency}{ex.amount.toFixed(2)}</span>
                                        </div>
                                        <div className={`text-[10px] uppercase font-bold mt-1 opacity-60`}>
                                            {LABEL_TO_PREFIX}{ex.payer === ex.orderedBy ? LABEL_HIMSELF : ex.orderedBy}
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
                                <h4 className="font-bold uppercase text-xs">{SECTION_NET_BALANCES}</h4>
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
                                {people.length === 0 && <div className={`text-center py-2 ${theme.textMuted}`}>{MSG_NO_DATA}</div>}
                            </div>
                        </div>

                        {/* Settlement */}
                        <div className="animate-slide" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 mb-4 opacity-70 px-2">
                                <Activity className="w-4 h-4" />
                                <h4 className="font-bold uppercase text-xs">{SECTION_SETTLEMENT_PLAN}</h4>
                            </div>

                            {settlements.length === 0 ? (
                                <div className={`py-8 text-center rounded-2xl border border-dashed border-white/10 ${theme.textMuted}`}>
                                    <p>{expenses.length === 0 ? MSG_ADD_EXPENSES : MSG_SETTLED_UP}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {settlements.map((item, i) => {
                                        const txt = `${item.from}${LABEL_PAY_TO}${item.to}${LABEL_FOR}${currency}${item.amount.toFixed(2)}`;
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
    );
};
