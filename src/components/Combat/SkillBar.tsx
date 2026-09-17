import React from 'react';
import { Zap, Flame, Shield, Heart, Crosshair, Sparkles, AlertTriangle } from 'lucide-react';
import { type GameEnemy } from '../../api';

interface SkillBarProps {
    characterClass: string;
    playerMp: number;
    maxMp: number;
    enemies: GameEnemy[];
    onUseSkill: (skillName: string, targetName?: string) => void;
    onOpenClassSelect?: () => void;
}

interface SkillInfo {
    name: string;
    mpCost: number;
    type: 'attack' | 'defense' | 'heal' | 'utility';
    desc: string;
    icon: string;
}

const CLASS_SKILLS: Record<string, SkillInfo[]> = {
    fighter: [
        { name: 'Slash', mpCost: 0, type: 'attack', desc: 'Basic sweeping melee slash (+15 DMG)', icon: 'sword' },
        { name: 'Heavy Strike', mpCost: 10, type: 'attack', desc: 'Crushing heavy strike (+30 DMG)', icon: 'sword' },
        { name: 'Shield Bash', mpCost: 15, type: 'defense', desc: 'Stuns enemy and boosts defense', icon: 'shield' }
    ],
    marksman: [
        { name: 'Quick Shot', mpCost: 0, type: 'attack', desc: 'Swift precision arrow (+14 DMG)', icon: 'crosshair' },
        { name: 'Snipe', mpCost: 15, type: 'attack', desc: 'Deadly aimed shot (+35 DMG)', icon: 'crosshair' },
        { name: 'Evade', mpCost: 10, type: 'utility', desc: 'Evasive roll to avoid counter-attack', icon: 'zap' }
    ],
    mage: [
        { name: 'Fireball', mpCost: 15, type: 'attack', desc: 'Burst of incinerating flames (+35 DMG)', icon: 'flame' },
        { name: 'Magic Shield', mpCost: 20, type: 'defense', desc: 'Arcane barrier blocking damage', icon: 'shield' },
        { name: 'Heal', mpCost: 20, type: 'heal', desc: 'Channel mana to restore +40 HP', icon: 'heart' }
    ],
    adventurer: [
        { name: 'Slash', mpCost: 0, type: 'attack', desc: 'Standard melee attack', icon: 'sword' }
    ]
};

export const SkillBar: React.FC<SkillBarProps> = ({
    characterClass = 'adventurer',
    playerMp,
    maxMp,
    enemies = [],
    onUseSkill,
    onOpenClassSelect
}) => {
    const normClass = characterClass.toLowerCase();
    const skills = CLASS_SKILLS[normClass] || CLASS_SKILLS['adventurer'];
    const primaryTarget = enemies.length > 0 ? enemies[0].name : undefined;

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'flame': return <Flame size={14} className="text-orange-400" />;
            case 'shield': return <Shield size={14} className="text-blue-400" />;
            case 'heart': return <Heart size={14} className="text-emerald-400" />;
            case 'crosshair': return <Crosshair size={14} className="text-emerald-400" />;
            default: return <Zap size={14} className="text-amber-400" />;
        }
    };

    return (
        <div className="bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-stitch-blue/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            
            {/* Class & MP info */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${normClass === 'mage' ? 'bg-purple-950/60 text-purple-300 border-purple-800/60' : normClass === 'marksman' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' : normClass === 'fighter' ? 'bg-red-950/60 text-red-300 border-red-800/60' : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60'}`}>
                        {characterClass}
                    </span>
                    {normClass === 'adventurer' && onOpenClassSelect && (
                        <button
                            onClick={onOpenClassSelect}
                            className="text-[10px] text-amber-400 hover:text-amber-300 underline flex items-center gap-1 font-bold"
                        >
                            <Sparkles size={12} /> Specialize Class
                        </button>
                    )}
                </div>

                {/* Mana Pill */}
                <div className="flex items-center gap-2 bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-800/40">
                    <Zap size={12} className="text-stitch-cyan animate-pulse" />
                    <span className="font-mono text-xs font-bold text-stitch-lightBlue">
                        {playerMp} <span className="text-[9px] text-slate-400">/{maxMp} MP</span>
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto justify-start sm:justify-end pb-1 sm:pb-0">
                {skills.map((skill, idx) => {
                    const hasMp = playerMp >= skill.mpCost;
                    const isTargetRequired = skill.type === 'attack';
                    const hasTarget = !isTargetRequired || enemies.length > 0;
                    const canCast = hasMp && (hasTarget || skill.type === 'heal' || skill.type === 'defense' || skill.type === 'utility');

                    return (
                        <button
                            key={idx}
                            onClick={() => onUseSkill(skill.name, isTargetRequired ? primaryTarget : undefined)}
                            disabled={!canCast}
                            title={skill.desc}
                            className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 transition-all shrink-0 text-xs font-bold uppercase tracking-wider group ${canCast ? 'bg-slate-900/80 hover:bg-slate-800 text-white border-stitch-cyan/40 hover:border-stitch-cyan shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-95' : 'bg-black/40 text-slate-600 border-slate-800 cursor-not-allowed'}`}
                        >
                            <span className="font-mono text-[10px] text-stitch-cyan/70 group-hover:text-stitch-cyan">
                                [{idx + 1}]
                            </span>
                            {renderIcon(skill.icon)}
                            <span>{skill.name}</span>
                            {skill.mpCost > 0 && (
                                <span className={`text-[10px] font-mono ml-1 ${hasMp ? 'text-stitch-lightBlue' : 'text-red-400'}`}>
                                    {skill.mpCost}MP
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {enemies.length === 0 && (
                <div className="text-[10px] text-slate-500 italic hidden lg:flex items-center gap-1">
                    <AlertTriangle size={12} className="text-slate-600" /> Cast buffs or enter hostile sectors to engage targets
                </div>
            )}

        </div>
    );
};
