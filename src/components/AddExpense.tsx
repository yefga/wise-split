import React, { FormEvent, RefObject } from 'react';
import { Receipt, AlertCircle } from 'lucide-react';
import { ThemeConfig } from '@app-types';
import { GlassCard, GlassInput, GlassSelect, GlassButton } from '@components';

interface AddExpenseProps {
    theme: ThemeConfig;
    people: string[];
    currency: string;
    description: string;
    setDescription: (value: string) => void;
    amount: string;
    setAmount: (value: string) => void;
    payer: string;
    setPayer: (value: string) => void;
    orderedBy: string;
    setOrderedBy: (value: string) => void;
    handleAddExpense: (e: FormEvent) => void;
    cardRef?: RefObject<HTMLDivElement | null>;
}

export const AddExpense: React.FC<AddExpenseProps> = ({
    theme,
    people,
    currency,
    description,
    setDescription,
    amount,
    setAmount,
    payer,
    setPayer,
    orderedBy,
    setOrderedBy,
    handleAddExpense,
    cardRef
}) => {
    return (
        <GlassCard theme={theme} cardRef={cardRef} className="h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl ${theme.input}`}>
                    <Receipt className={`w-5 h-5 ${theme.accent}`} />
                </div>
                <h2 className="text-lg font-bold">Add Expense</h2>
            </div>

            {people.length > 0 ? (
                <form onSubmit={handleAddExpense} className="space-y-5">
                    <div>
                        <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>Description</label>
                        <GlassInput theme={theme} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Dinner" />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>Amount</label>
                        <div className="relative">
                            <span className={`absolute left-4 top-3.5 font-bold ${theme.textMuted}`}>{currency}</span>
                            <GlassInput theme={theme} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" className="pl-10 font-mono" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>Ordered By</label>
                            <GlassSelect theme={theme} value={orderedBy} onChange={(e) => setOrderedBy(e.target.value)}>
                                <option value="" disabled>Select...</option>
                                <option value="Everyone" className="text-slate-800 bg-white">Everyone</option>
                                {people.map(p => <option key={p} value={p} className="text-slate-800 bg-white">{p}</option>)}
                            </GlassSelect>
                        </div>
                        <div>
                            <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>Paid By</label>
                            <GlassSelect theme={theme} value={payer} onChange={(e) => setPayer(e.target.value)}>
                                <option value="" disabled>Select...</option>
                                {people.map(p => <option key={p} value={p} className="text-slate-800 bg-white">{p}</option>)}
                            </GlassSelect>
                        </div>
                    </div>
                    <div className="pt-2">
                        <GlassButton theme={theme} primary type="submit" className="w-full !py-3.5" disabled={!description || !amount || !payer || !orderedBy}>
                            Add Expense
                        </GlassButton>
                    </div>
                </form>
            ) : (
                <div className={`text-center py-12 rounded-2xl border-2 border-dashed border-white/10 bg-white/5`}>
                    <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
                    <p className={`text-sm ${theme.textMuted}`}>Add people above first.</p>
                </div>
            )}
        </GlassCard>
    );
};
