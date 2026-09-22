import React from 'react';
import { Zap, Flame, Shield, Heart, Crosshair, Sword, Sparkles } from 'lucide-react';
import { type GameEnemy } from '../../api';

interface SkillBarProps {
    characterClass: string;
    playerMp: number;
    maxMp?: number;
    skillCooldowns?: Record<string, number>;
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
        { name: 'Slash', mpCost: 0, type: 'attack', desc: 'Tactical slash (~5-6 HP, recharges on basic attack)', icon: 'sword' },
        { name: 'Heavy Strike', mpCost: 10, type: 'attack', desc: 'Heavy strike & stun (~9-10 HP)', icon: 'sword' },
        { name: 'Shield Bash', mpCost: 15, type: 'defense', desc: 'Stuns & reinforces defense (~5 HP)', icon: 'shield' }
    ],
    marksman: [
        { name: 'Quick Shot', mpCost: 0, type: 'attack', desc: 'Swift arrow shot (~5-6 HP, recharges on basic attack)', icon: 'crosshair' },
        { name: 'Aimed Shot', mpCost: 15, type: 'attack', desc: 'Deadly precision shot (~8-9 HP)', icon: 'crosshair' },
        { name: 'Evade', mpCost: 10, type: 'utility', desc: 'Evasive roll to avoid counter-attack', icon: 'zap' }
    ],
    mage: [
        { name: 'Fireball', mpCost: 15, type: 'attack', desc: 'Blazing fireball burst (~9-11 HP)', icon: 'flame' },
        { name: 'Mana Shield', mpCost: 15, type: 'defense', desc: 'Arcane barrier absorbing damage', icon: 'shield' },
        { name: 'Heal', mpCost: 20, type: 'heal', desc: 'Channel mana to restore +25 HP', icon: 'heart' }
    ],
    adventurer: [
        { name: 'Slash', mpCost: 0, type: 'attack', desc: 'Tactical slash (~4-5 HP, recharges on basic attack)', icon: 'sword' }
    ]
};

export const SkillBar: React.FC<SkillBarProps> = ({
    characterClass = 'adventurer',
    playerMp,
    maxMp,
    skillCooldowns = {},
    enemies = [],
    onUseSkill
}) => {
    const normClass = characterClass.toLowerCase();
    const skills = CLASS_SKILLS[normClass] || CLASS_SKILLS['adventurer'];
    const primaryTarget = enemies.length > 0 ? enemies[0].name : undefined;

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'flame': return <Flame size={14} className="text-orange-400 shrink-0" />;
            case 'shield': return <Shield size={14} className="text-blue-400 shrink-0" />;
            case 'heart': return <Heart size={14} className="text-emerald-400 shrink-0" />;
            case 'crosshair': return <Crosshair size={14} className="text-emerald-400 shrink-0" />;
            case 'sword': return <Sword size={14} className="text-red-400 shrink-0" />;
            default: return <Zap size={14} className="text-amber-400 shrink-0" />;
        }
    };

    return (
        <div className="bg-cyan-950/20 p-3 rounded-xl border border-cyan-800/30 space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-stitch-cyan" />
                    <span className="text-stitch-cyan font-bold text-xs uppercase tracking-widest">
                        Tactical Abilities
                    </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="uppercase text-slate-400">{characterClass}</span>
                    {maxMp !== undefined && (
                        <span className="text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/50">
                            {playerMp}/{maxMp} MP
                        </span>
                    )}
                </div>
            </div>

            {/* Target Notification if hostile present */}
            {enemies.length > 0 && (
                <div className="flex items-center justify-between text-[11px] bg-red-950/40 px-2.5 py-1 rounded-lg border border-red-900/40 text-red-300 font-mono">
                    <span className="flex items-center gap-1">
                        <Crosshair size={12} className="text-red-400 animate-pulse" />
                        Target: <strong className="text-white">{primaryTarget}</strong>
                    </span>
                    <span className="text-[10px] text-red-400 uppercase font-bold">In Range</span>
                </div>
            )}

            {/* Skills Grid */}
            <div className="grid grid-cols-1 gap-2">
                {skills.map((skill, idx) => {
                    const cdRemaining = skillCooldowns[skill.name.toLowerCase()] || 0;
                    const isOnCooldown = cdRemaining > 0;
                    const hasMp = playerMp >= skill.mpCost;
                    const isTargetRequired = skill.type === 'attack';
                    const hasTarget = !isTargetRequired || enemies.length > 0;
                    const canCast = !isOnCooldown && hasMp && (hasTarget || skill.type === 'heal' || skill.type === 'defense' || skill.type === 'utility');

                    return (
                        <button
                            key={idx}
                            onClick={() => onUseSkill(skill.name, isTargetRequired ? primaryTarget : undefined)}
                            disabled={!canCast}
                            title={
                                isOnCooldown
                                    ? `On Cooldown! Perform a basic attack (bare-handed / weapon strike) to recharge.`
                                    : !hasMp
                                    ? `Insufficient MP (Requires ${skill.mpCost} MP)`
                                    : !hasTarget
                                    ? 'Requires hostile target in sector'
                                    : skill.desc
                            }
                            className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all text-left group ${
                                canCast
                                    ? 'bg-slate-900/70 hover:bg-slate-800 text-white border-stitch-cyan/40 hover:border-stitch-cyan shadow-[0_0_10px_rgba(6,182,212,0.15)] active:scale-[0.98] cursor-pointer'
                                    : isOnCooldown
                                    ? 'bg-amber-950/20 text-amber-300/70 border-amber-800/40 cursor-not-allowed opacity-80'
                                    : 'bg-black/30 text-slate-500 border-white/5 cursor-not-allowed opacity-60'
                            }`}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                    canCast 
                                        ? 'bg-white/5 border border-white/10' 
                                        : isOnCooldown
                                        ? 'bg-amber-950/40 border border-amber-700/40'
                                        : 'bg-black/40'
                                }`}>
                                    {renderIcon(skill.icon)}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`font-bold text-xs tracking-wide truncate ${
                                            canCast ? 'text-white' : isOnCooldown ? 'text-amber-200' : 'text-slate-500'
                                        }`}>
                                            {skill.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 block truncate font-sans">
                                        {isOnCooldown ? 'Recharge with Basic Attack' : skill.desc}
                                    </span>
                                </div>
                            </div>

                            <div className="shrink-0 flex flex-col items-end">
                                {isOnCooldown ? (
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/50 uppercase">
                                        Cooldown
                                    </span>
                                ) : (
                                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                        skill.mpCost === 0 
                                            ? 'bg-slate-800 text-slate-300' 
                                            : hasMp 
                                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/40' 
                                            : 'bg-red-950 text-red-400 border border-red-800/40'
                                    }`}>
                                        {skill.mpCost > 0 ? `${skill.mpCost} MP` : 'FREE'}
                                    </span>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
