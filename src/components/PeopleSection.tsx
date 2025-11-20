import React, { FormEvent, useState } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { ThemeConfig } from '@app-types';
import { GlassCard, GlassInput, GlassButton } from '@components';
import { SECTION_PEOPLE, PLACEHOLDER_NAME, BTN_ADD, MSG_NO_PEOPLE, ERROR_NAME_TAKEN } from '@constants';
import { trackError } from '@google';

interface PeopleSectionProps {
    theme: ThemeConfig;
    people: string[];
    addPersonToStore: (name: string) => boolean;
    removePersonFromStore: (name: string) => void;
    onPersonRemoved?: (name: string) => void;
}

export const PeopleSection: React.FC<PeopleSectionProps> = ({
    theme,
    people,
    addPersonToStore,
    removePersonFromStore,
    onPersonRemoved
}) => {
    const [personName, setPersonName] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');

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
        }
    };

    const handleRemovePerson = (name: string) => {
        removePersonFromStore(name);
        if (onPersonRemoved) {
            onPersonRemoved(name);
        }
    };

    return (
        <section className="w-full">
            <GlassCard theme={theme}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 rounded-xl ${theme.input}`}>
                        <Users className={`w-5 h-5 ${theme.accent}`} />
                    </div>
                    <h2 className="text-lg font-bold">{SECTION_PEOPLE}</h2>
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
                            placeholder={PLACEHOLDER_NAME}
                            className="flex-1"
                        />
                        <GlassButton theme={theme} primary type="submit" disabled={!personName.trim()}>
                            <Plus className="w-5 h-5" /> {BTN_ADD}
                        </GlassButton>
                    </form>
                    {nameError && (
                        <p className={`text-xs mt-2 ml-1 font-bold ${theme.danger} animate-slide`}>{nameError}</p>
                    )}
                </div>

                <div className="flex flex-wrap gap-3">
                    {people.length === 0 && <p className={`text-sm italic w-full text-center py-4 ${theme.textMuted}`}>{MSG_NO_PEOPLE}</p>}
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
