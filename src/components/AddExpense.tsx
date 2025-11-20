import React, { FormEvent, RefObject } from 'react';
import { Receipt, AlertCircle } from 'lucide-react';
import { ThemeConfig } from '@app-types';
import { GlassCard, GlassInput, GlassSelect, GlassButton } from '@components';
import {
    SECTION_ADD_EXPENSE, LABEL_DESCRIPTION, LABEL_AMOUNT, LABEL_ORDERED_BY, LABEL_PAID_BY,
    PLACEHOLDER_DESCRIPTION, PLACEHOLDER_AMOUNT, PLACEHOLDER_SELECT, EVERYONE_OPTION,
    BTN_ADD_EXPENSE, MSG_ADD_PEOPLE_FIRST
} from '@constants';

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
                <h2 className="text-lg font-bold">{SECTION_ADD_EXPENSE}</h2>
            </div>

            {people.length > 0 ? (
                <form onSubmit={handleAddExpense} className="space-y-5">
                    <div>
                        <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>{LABEL_DESCRIPTION}</label>
                        <GlassInput theme={theme} type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={PLACEHOLDER_DESCRIPTION} />
                    </div>
                    <div>
                        <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>{LABEL_AMOUNT}</label>
                        <div className="relative">
                            <span className={`absolute left-4 top-3.5 font-bold ${theme.textMuted}`}>{currency}</span>
                            <GlassInput theme={theme} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={PLACEHOLDER_AMOUNT} step="0.01" className="pl-10 font-mono" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>{LABEL_ORDERED_BY}</label>
                            <GlassSelect theme={theme} value={orderedBy} onChange={(e) => setOrderedBy(e.target.value)}>
                                <option value="" disabled>{PLACEHOLDER_SELECT}</option>
                                <option value={EVERYONE_OPTION} className="text-slate-800 bg-white">{EVERYONE_OPTION}</option>
                                {people.map(p => <option key={p} value={p} className="text-slate-800 bg-white">{p}</option>)}
                            </GlassSelect>
                        </div>
                        <div>
                            <label className={`block text-xs font-bold ml-1 mb-1.5 uppercase tracking-wider ${theme.textMuted}`}>{LABEL_PAID_BY}</label>
                            <GlassSelect theme={theme} value={payer} onChange={(e) => setPayer(e.target.value)}>
                                <option value="" disabled>{PLACEHOLDER_SELECT}</option>
                                {people.map(p => <option key={p} value={p} className="text-slate-800 bg-white">{p}</option>)}
                            </GlassSelect>
                        </div>
                    </div>
                    <div className="pt-2">
                        <GlassButton theme={theme} primary type="submit" className="w-full !py-3.5" disabled={!description || !amount || !payer || !orderedBy}>
                            {BTN_ADD_EXPENSE}
                        </GlassButton>
                    </div>
                </form>
            ) : (
                <div className={`text-center py-12 rounded-2xl border-2 border-dashed border-white/10 bg-white/5`}>
                    <AlertCircle className={`w-8 h-8 mx-auto mb-2 ${theme.textMuted}`} />
                    <p className={`text-sm ${theme.textMuted}`}>{MSG_ADD_PEOPLE_FIRST}</p>
                </div>
            )}
        </GlassCard>
    );
};
