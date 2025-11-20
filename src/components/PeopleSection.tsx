import React, { FormEvent } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { ThemeConfig } from '@app-types';
import { GlassCard, GlassInput, GlassButton } from '@components';

interface PeopleSectionProps {
    theme: ThemeConfig;
    people: string[];
    personName: string;
    nameError: string;
    setPersonName: (name: string) => void;
    setNameError: (error: string) => void;
    handleAddPerson: (e: FormEvent) => void;
    handleRemovePerson: (name: string) => void;
}

export const PeopleSection: React.FC<PeopleSectionProps> = ({
    theme,
    people,
    personName,
    nameError,
    setPersonName,
    setNameError,
    handleAddPerson,
    handleRemovePerson
}) => {
    return (
        <section className="w-full">
            <GlassCard theme={theme}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-xl ${theme.input}`}>
                        <Users className={`w-5 h-5 ${theme.accent}`} />
                    </div>
                    <h2 className="text-lg font-bold">People</h2>
                </div>

                <div className="mb-6">
                    <form onSubmit={handleAddPerson} className="flex gap-3">
                        <GlassInput
                            theme={theme}
                            type="text"
                            value={personName}
                            onChange={(e) => {
                                setPersonName(e.target.value);
                                if (nameError) setNameError('');
                            }}
                            placeholder="Enter Name..."
                            className="flex-1"
                        />
                        <GlassButton theme={theme} primary type="submit" disabled={!personName.trim()}>
                            <Plus className="w-5 h-5" /> Add
                        </GlassButton>
                    </form>
                    {nameError && (
                        <p className={`text-xs mt-2 ml-1 font-bold ${theme.danger} animate-slide`}>{nameError}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    {people.length === 0 && <p className={`text-sm italic w-full text-center py-4 ${theme.textMuted}`}>Add friends to start splitting</p>}
                    {people.map((p) => (
                        <div key={p} className={`animate-pop group flex items-center gap-2 pl-4 pr-2 py-1.5 rounded-full text-sm font-medium transition-all ${theme.input} border ${theme.border}`}>
                            {p}
                            <button onClick={() => handleRemovePerson(p)} className={`p-1.5 rounded-full hover:bg-white/20 ${theme.danger} transition-colors`}>
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </section>
    );
};
