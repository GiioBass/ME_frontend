import React from 'react';
import { Sparkles, X, Check } from 'lucide-react';

interface ClassSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentClass: string;
    onSelectClass: (className: string) => void;
}

interface ClassArchetype {
    id: string;
    name: string;
    role: string;
    description: string;
    statsHighlight: string;
    skills: string[];
    theme: {
        border: string;
        bg: string;
        text: string;
        badge: string;
    };
}

const ARCHETYPES: ClassArchetype[] = [
    {
        id: 'fighter',
        name: 'Fighter',
        role: 'Vanguard Warrior',
        description: 'Masters of brutal close-quarters combat, wielding heavy strikes and impenetrable defense.',
        statsHighlight: '+STR & Defense Focus & High Vitality',
        skills: ['Slash', 'Heavy Strike', 'Shield Bash'],
        theme: {
            border: 'border-red-500/40 hover:border-red-400',
            bg: 'bg-red-950/20',
            text: 'text-red-400',
            badge: 'bg-red-950/60 text-red-300 border-red-800/60'
        }
    },
    {
        id: 'marksman',
        name: 'Marksman',
        role: 'Ranged Scout',
        description: 'Eagle-eyed snipers who utilize agility, tactical range and lethal precision weak-point strikes.',
        statsHighlight: '+Agility & Critical Damage Focus',
        skills: ['Quick Shot', 'Snipe', 'Evade'],
        theme: {
            border: 'border-emerald-500/40 hover:border-emerald-400',
            bg: 'bg-emerald-950/20',
            text: 'text-emerald-400',
            badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
        }
    },
    {
        id: 'mage',
        name: 'Mage',
        role: 'Arcane Scholar',
        description: 'Wielders of primordial elemental energy, able to unleash incinerating fireballs and restorative healing.',
        statsHighlight: '+Mana Capacity & Arcane Spells & Regeneration',
        skills: ['Fireball', 'Magic Shield', 'Heal'],
        theme: {
            border: 'border-purple-500/40 hover:border-purple-400',
            bg: 'bg-purple-950/20',
            text: 'text-purple-400',
            badge: 'bg-purple-950/60 text-purple-300 border-purple-800/60'
        }
    }
];

export const ClassSelectModal: React.FC<ClassSelectModalProps> = ({
    isOpen,
    onClose,
    currentClass,
    onSelectClass
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-2xl rounded-2xl border-stitch-cyan/40 shadow-[0_0_35px_rgba(6,182,212,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-stitch-cyan/30 flex items-center justify-between bg-cyan-950/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-stitch-cyan/20 border border-stitch-cyan/40 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                            <Sparkles size={20} className="text-stitch-cyan" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                                Specialization Protocol
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stitch-cyan/20 text-stitch-cyan border border-stitch-cyan/40 font-bold">
                                    Class Mastery
                                </span>
                            </h3>
                            <span className="text-[11px] text-slate-400">Select your combat archetype to unlock unique class abilities</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    {ARCHETYPES.map((arch) => {
                        const isSelected = currentClass.toLowerCase() === arch.id;

                        return (
                            <div
                                key={arch.id}
                                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${arch.theme.border} ${arch.theme.bg} ${isSelected ? 'ring-1 ring-white/50 shadow-md' : ''}`}
                            >
                                <div className="space-y-1.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-base">{arch.name}</span>
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${arch.theme.badge}`}>
                                            {arch.role}
                                        </span>
                                        {isSelected && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white flex items-center gap-1">
                                                <Check size={12} /> Active Class
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                                        "{arch.description}"
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
                                        <span className={`font-semibold ${arch.theme.text}`}>{arch.statsHighlight}</span>
                                        <span className="text-slate-600">&bull;</span>
                                        <span className="text-slate-300 font-mono">Skills: {arch.skills.join(', ')}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        onSelectClass(arch.id);
                                        onClose();
                                    }}
                                    disabled={isSelected}
                                    className={`px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center justify-center gap-1.5 ${isSelected ? 'bg-white/10 text-slate-400 border border-white/10 cursor-default' : 'bg-stitch-cyan hover:bg-white text-black shadow-[0_0_12px_rgba(6,182,212,0.4)]'}`}
                                >
                                    {isSelected ? 'Current' : 'Select Class'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors"
                    >
                        Dismiss
                    </button>
                </div>

            </div>
        </div>
    );
};
