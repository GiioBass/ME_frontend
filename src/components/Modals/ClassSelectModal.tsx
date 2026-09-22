import React, { useEffect } from 'react';
import { Sparkles, X, Shield, Sword, Crosshair, Compass, Zap, Flame, Heart, Lock } from 'lucide-react';

interface ClassSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentClass: string;
    onSelectClass?: (className: string) => void;
}

interface ClassArchetype {
    id: string;
    name: string;
    role: string;
    icon: any;
    description: string;
    statsHighlight: string;
    primaryAttribute: string;
    bonusOverview: string[];
    skills: Array<{ name: string; cost: string; desc: string; icon: any }>;
    theme: {
        border: string;
        bg: string;
        text: string;
        badge: string;
        glow: string;
    };
}

const ARCHETYPES: Record<string, ClassArchetype> = {
    fighter: {
        id: 'fighter',
        name: 'Fighter',
        role: 'Vanguard Warrior',
        icon: Sword,
        description: 'Masters of brutal close-quarters combat, wielding heavy strikes, retaliatory counters and impenetrable physical defense.',
        statsHighlight: '+20 Max HP & +4 Base Strength',
        primaryAttribute: 'Strength & Physical Vitality',
        bonusOverview: [
            '+20 Bonus Max Integrity (HP)',
            '+4 Base Physical Attack Power',
            'Heavy Weapon & Armor Proficiency'
        ],
        skills: [
            { name: 'Slash', cost: '0 MP', desc: 'Basic sweeping melee slash with bonus physical damage.', icon: Sword },
            { name: 'Heavy Strike', cost: '10 MP', desc: 'Crushing heavy strike that deals massive blunt trauma.', icon: Sword },
            { name: 'Shield Bash', cost: '15 MP', desc: 'Stuns the hostile target and reinforces physical defense.', icon: Shield }
        ],
        theme: {
            border: 'border-red-500/50',
            bg: 'bg-red-950/30',
            text: 'text-red-400',
            badge: 'bg-red-950/80 text-red-300 border-red-700/60',
            glow: 'shadow-[0_0_25px_rgba(239,68,68,0.2)]'
        }
    },
    marksman: {
        id: 'marksman',
        name: 'Marksman',
        role: 'Ranged Tactical Scout',
        icon: Crosshair,
        description: 'Eagle-eyed snipers who utilize agility, tactical range, high evasion and lethal precision weak-point strikes.',
        statsHighlight: '+5 Agility & Critical Precision Focus',
        primaryAttribute: 'Agility & Ranged Accuracy',
        bonusOverview: [
            '+5 Base Agility & Dodge Velocity',
            'Increased critical strike chance from distance',
            'Ranged Weapons & Hunting Proficiency'
        ],
        skills: [
            { name: 'Quick Shot', cost: '0 MP', desc: 'Swift precision arrow shot with high velocity.', icon: Crosshair },
            { name: 'Aimed Shot', cost: '15 MP', desc: 'Deadly aimed shot piercing enemy armor.', icon: Crosshair },
            { name: 'Evade', cost: '10 MP', desc: 'Evasive roll to avoid incoming enemy counter-attacks.', icon: Zap }
        ],
        theme: {
            border: 'border-emerald-500/50',
            bg: 'bg-emerald-950/30',
            text: 'text-emerald-400',
            badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
            glow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]'
        }
    },
    mage: {
        id: 'mage',
        name: 'Mage',
        role: 'Arcane Scholar',
        icon: Sparkles,
        description: 'Wielders of primordial elemental energy, able to unleash incinerating fireballs, restorative healing and mystic shielding.',
        statsHighlight: '+40 Max MP & +6 Base Intelligence',
        primaryAttribute: 'Intelligence & Arcane Mana Flow',
        bonusOverview: [
            '+40 Bonus Arcane Mana Capacity (MP)',
            '+6 Base Arcane Intelligence',
            'Spellcasting & Elemental Staff Proficiency'
        ],
        skills: [
            { name: 'Fireball', cost: '15 MP', desc: 'Burst of incinerating elemental flames.', icon: Flame },
            { name: 'Mana Shield', cost: '15 MP', desc: 'Arcane barrier absorbing incoming damage.', icon: Shield },
            { name: 'Heal', cost: '20 MP', desc: 'Channel pure mana into restorative vital energy (+25 HP).', icon: Heart }
        ],
        theme: {
            border: 'border-purple-500/50',
            bg: 'bg-purple-950/30',
            text: 'text-purple-400',
            badge: 'bg-purple-950/80 text-purple-300 border-purple-700/60',
            glow: 'shadow-[0_0_25px_rgba(168,85,247,0.2)]'
        }
    },
    adventurer: {
        id: 'adventurer',
        name: 'Adventurer',
        role: 'Pioneer & Explorer',
        icon: Compass,
        description: 'A versatile pioneer skilled in exploration, field crafting, resource gathering, and balanced adaptability across all biomes.',
        statsHighlight: 'Balanced Attributes & Universal Field Utility',
        primaryAttribute: 'Adaptability & Survival Instinct',
        bonusOverview: [
            'Balanced starting attributes across all metrics',
            'Versatile access to basic field crafting & gathering',
            'Universal gear and weapon handling'
        ],
        skills: [
            { name: 'Slash', cost: '0 MP', desc: 'Standard melee attack for self-defense.', icon: Sword }
        ],
        theme: {
            border: 'border-cyan-500/50',
            bg: 'bg-cyan-950/30',
            text: 'text-cyan-400',
            badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
            glow: 'shadow-[0_0_25px_rgba(6,182,212,0.2)]'
        }
    }
};

export const ClassSelectModal: React.FC<ClassSelectModalProps> = ({
    isOpen,
    onClose,
    currentClass
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const normClass = (currentClass || 'adventurer').toLowerCase();
    const arch = ARCHETYPES[normClass] || ARCHETYPES['adventurer'];
    const ClassIcon = arch.icon;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={`glass-panel w-full max-w-xl rounded-2xl border ${arch.theme.border} ${arch.theme.glow} overflow-hidden flex flex-col max-h-[90vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`p-4 border-b ${arch.theme.border} flex items-center justify-between ${arch.theme.bg}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${arch.theme.bg} border ${arch.theme.border} flex items-center justify-center shadow-md`}>
                            <ClassIcon size={20} className={arch.theme.text} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                                Operator Archetype Dossier
                                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${arch.theme.badge}`}>
                                    {arch.name}
                                </span>
                            </h3>
                            <span className="text-[11px] text-slate-400">{arch.role} &bull; Permanent Specialization</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 overflow-y-auto space-y-4">
                    {/* Lore description */}
                    <div className="bg-black/40 p-3.5 rounded-xl border border-white/5">
                        <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                            "{arch.description}"
                        </p>
                    </div>

                    {/* Stat Affinities & Primary Focus */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Archetype Specialization & Passives:
                        </span>
                        <div className="bg-black/30 p-3 rounded-xl border border-white/5 space-y-1.5">
                            <div className="flex items-center justify-between text-xs pb-1 border-b border-white/5">
                                <span className="text-slate-400 font-mono">Primary Focus:</span>
                                <span className={`font-bold font-mono ${arch.theme.text}`}>{arch.primaryAttribute}</span>
                            </div>
                            <div className="space-y-1 pt-1">
                                {arch.bonusOverview.map((bonus, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-2 text-xs text-slate-200 font-mono">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                        <span>{bonus}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Class Combat Skills */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Available Class Skills:
                        </span>
                        <div className="space-y-2">
                            {arch.skills.map((skill, sIdx) => {
                                const SkillIcon = skill.icon;
                                return (
                                    <div
                                        key={sIdx}
                                        className="bg-black/30 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                <SkillIcon size={16} className={arch.theme.text} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-xs">{skill.name}</span>
                                                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-cyan-300">
                                                        {skill.cost}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate">{skill.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Permanent Lock Notice */}
                    <div className="flex items-center gap-2 bg-black/40 p-3 rounded-xl border border-white/10 text-slate-400 text-xs font-mono">
                        <Lock size={14} className="text-amber-400 shrink-0" />
                        <span>Class archetype is permanently locked to this operator. Classes are chosen only at enlistment.</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    >
                        Close Dossier
                    </button>
                </div>

            </div>
        </div>
    );
};
