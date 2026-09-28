import React from 'react';
import { X, Heart, Sparkles, Compass, Sword, Crosshair, Coins, MapPin, Scroll, Power, Award, Shield } from 'lucide-react';
import type { PlayerStats, Equipment } from '../../api';

interface PlayerProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    playerId: string;
    playerName: string;
    stats: PlayerStats;
    equipment?: Equipment;
    waypointsCount?: number;
    activeQuestsCount?: number;
    currentWeight?: number;
    onLogout: () => void;
}

const getClassIcon = (characterClass: string) => {
    switch (characterClass.toLowerCase()) {
        case 'fighter': return Sword;
        case 'marksman': return Crosshair;
        case 'mage': return Sparkles;
        default: return Compass;
    }
};

const getClassColors = (characterClass: string) => {
    switch (characterClass.toLowerCase()) {
        case 'fighter': return {
            border: 'border-red-500/50',
            bg: 'bg-red-950/40',
            text: 'text-red-400',
            glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        };
        case 'marksman': return {
            border: 'border-emerald-500/50',
            bg: 'bg-emerald-950/40',
            text: 'text-emerald-400',
            glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
        };
        case 'mage': return {
            border: 'border-purple-500/50',
            bg: 'bg-purple-950/40',
            text: 'text-purple-400',
            glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]'
        };
        default: return {
            border: 'border-cyan-500/50',
            bg: 'bg-cyan-950/40',
            text: 'text-cyan-400',
            glow: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]'
        };
    }
};

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
    isOpen,
    onClose,
    playerId,
    playerName,
    stats,
    equipment,
    waypointsCount = 0,
    activeQuestsCount = 0,
    currentWeight = 0,
    onLogout
}) => {
    if (!isOpen) return null;

    const charClass = stats.character_class || 'Adventurer';
    const ClassIcon = getClassIcon(charClass);
    const classColors = getClassColors(charClass);

    // XP calculation: each level requires level * 100 XP
    const xpNeeded = (stats.level || 1) * 100;
    const xpPercent = Math.min(100, Math.max(0, (stats.xp / xpNeeded) * 100));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-slate-950 border border-stitch-cyan/40 rounded-2xl w-full max-w-lg flex flex-col shadow-[0_0_35px_rgba(6,182,212,0.2)] overflow-hidden">
                
                {/* Header */}
                <div className="p-4 border-b border-stitch-cyan/20 flex items-center justify-between bg-black/60">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${classColors.border} ${classColors.bg} ${classColors.text} ${classColors.glow}`}>
                            <ClassIcon size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-white font-mono tracking-wider">{playerName}</h2>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${classColors.border} ${classColors.text} ${classColors.bg}`}>
                                    {charClass}
                                </span>
                            </div>
                            <p className="text-slate-400 text-[11px] font-mono">
                                Operator ID: <span className="text-stitch-cyan/80">{playerId.substring(0, 8)}...</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-5 overflow-y-auto space-y-4 max-h-[75vh] font-mono">
                    
                    {/* Level & XP Progression */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-stitch-cyan font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                <Award size={14} /> Tier Rank
                            </span>
                            <span className="text-white font-bold">
                                Level {stats.level || 1} <span className="text-slate-500 text-[10px]">({stats.xp}/{xpNeeded} XP)</span>
                            </span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-stitch-blue to-stitch-cyan rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                style={{ width: `${xpPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Vitals Grid */}
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-3 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-red-400 mb-1">
                                <span className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-wider">
                                    <Heart size={13} /> Vitality
                                </span>
                                <span className="text-[11px] font-bold">{stats.hp}/{stats.max_hp}</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 rounded-full"
                                    style={{ width: `${(stats.hp / stats.max_hp) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-cyan-400 mb-1">
                                <span className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-wider">
                                    <Sparkles size={13} /> Neural Mana
                                </span>
                                <span className="text-[11px] font-bold">{stats.mp}/{stats.max_mp}</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-cyan-400 rounded-full"
                                    style={{ width: `${stats.max_mp > 0 ? (stats.mp / stats.max_mp) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Primary Attributes */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3.5">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2.5">
                            Combat & Core Attributes
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="text-slate-400 text-[10px] block uppercase">Strength</span>
                                <span className="text-white font-bold text-sm">{stats.strength || 10}</span>
                            </div>
                            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="text-slate-400 text-[10px] block uppercase">Defense</span>
                                <span className="text-white font-bold text-sm">{stats.defense || 5}</span>
                            </div>
                            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="text-slate-400 text-[10px] block uppercase">Agility</span>
                                <span className="text-white font-bold text-sm">{stats.agility || 10}</span>
                            </div>
                            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="text-slate-400 text-[10px] block uppercase">Intellect</span>
                                <span className="text-white font-bold text-sm">{stats.intelligence || 10}</span>
                            </div>
                        </div>
                    </div>

                    {/* Adventure Progression Matrix */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-amber-950/20 border border-amber-500/30 p-2.5 rounded-xl">
                            <Coins size={15} className="text-amber-400 mx-auto mb-1" />
                            <span className="text-amber-300 font-bold block">{stats.gold ?? 0}</span>
                            <span className="text-[9px] text-amber-400/70 uppercase">Credits</span>
                        </div>
                        <div className="bg-blue-950/20 border border-blue-500/30 p-2.5 rounded-xl">
                            <MapPin size={15} className="text-blue-400 mx-auto mb-1" />
                            <span className="text-blue-300 font-bold block">{waypointsCount}</span>
                            <span className="text-[9px] text-blue-400/70 uppercase">Waypoints</span>
                        </div>
                        <div className="bg-fuchsia-950/20 border border-fuchsia-500/30 p-2.5 rounded-xl">
                            <Scroll size={15} className="text-fuchsia-400 mx-auto mb-1" />
                            <span className="text-fuchsia-300 font-bold block">{activeQuestsCount}</span>
                            <span className="text-[9px] text-fuchsia-400/70 uppercase">Active Quests</span>
                        </div>
                    </div>

                    {/* Active Loadout / Equipment */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-3.5">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">
                            Equipped Gear
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                                <Sword size={14} className="text-red-400 flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[10px] text-slate-400 uppercase">Weapon</div>
                                    <div className="text-white font-bold text-xs truncate">
                                        {equipment?.weapon?.name || 'Unarmed'}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
                                <Shield size={14} className="text-blue-400 flex-shrink-0" />
                                <div className="min-w-0">
                                    <div className="text-[10px] text-slate-400 uppercase">Armor</div>
                                    <div className="text-white font-bold text-xs truncate">
                                        {equipment?.armor?.name || 'Unarmored'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weight Capacity */}
                    <div className="flex justify-between items-center bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-xs">
                        <span className="text-slate-400 uppercase text-[10px] tracking-wider">Encumbrance / Pack Load</span>
                        <span className="text-white font-bold">
                            {currentWeight.toFixed(1)} / {(stats.max_weight || 50).toFixed(1)} kg
                        </span>
                    </div>

                    {/* Disconnect Action */}
                    <div className="pt-2">
                        <button
                            onClick={() => {
                                onClose();
                                onLogout();
                            }}
                            className="w-full bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 hover:text-white border border-rose-500/40 hover:border-rose-400 py-3 rounded-xl font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(244,63,94,0.2)] flex items-center justify-center gap-2 text-xs cursor-pointer active:scale-98"
                        >
                            <Power size={16} />
                            Terminate Session (Disconnect)
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
