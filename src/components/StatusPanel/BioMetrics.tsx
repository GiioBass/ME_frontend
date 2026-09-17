import React, { useState } from 'react';
import { Activity, Sun, Moon, Sword, Shield, ChevronDown, ChevronUp, Zap, Coins } from 'lucide-react';
import { type GameItem, type PlayerStats } from '../../api';

interface BioMetricsProps {
    name: string;
    stats: PlayerStats;
    time?: {
        total_ticks: number;
        day: number;
        hour: number;
        minute: number;
        is_night: boolean;
    };
    weapon?: GameItem | null;
    armor?: GameItem | null;
    onUnequip?: (slot: string) => void;
    onOpenClassSelect?: () => void;
}

const BioMetrics: React.FC<BioMetricsProps> = ({
    name,
    stats,
    time,
    weapon,
    armor,
    onUnequip,
    onOpenClassSelect
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const formattedHour = time?.hour.toString().padStart(2, '0') || '00';
    const formattedMin = time?.minute.toString().padStart(2, '0') || '00';

    const hpPercent = (stats.hp / stats.max_hp) * 100;
    let hpTextColor = 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]';
    let hpBgColor = 'bg-green-500';

    if (hpPercent <= 20) {
        hpTextColor = 'text-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]';
        hpBgColor = 'bg-orange-500';
    } else if (hpPercent <= 50) {
        hpTextColor = 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]';
        hpBgColor = 'bg-yellow-400';
    }

    const mpPercent = stats.max_mp > 0 ? (stats.mp / stats.max_mp) * 100 : 0;
    const charClass = (stats.character_class || 'adventurer').toLowerCase();

    const getClassBadge = () => {
        switch (charClass) {
            case 'mage':
                return 'bg-purple-950/80 text-purple-300 border-purple-700/60 shadow-[0_0_8px_rgba(168,85,247,0.3)]';
            case 'marksman':
                return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
            case 'fighter':
                return 'bg-red-950/80 text-red-300 border-red-700/60 shadow-[0_0_8px_rgba(239,68,68,0.3)]';
            default:
                return 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]';
        }
    };

    return (
        <div className="glass-panel rounded-2xl p-5 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex-shrink-0 border-stitch-blue/30 relative transition-all duration-300">

            {/* Operator Identifier & Gold Display */}
            <div className="absolute -top-3.5 left-5 right-5 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 bg-black/90 px-3 py-1 rounded-lg border border-stitch-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] pointer-events-auto">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-white font-mono text-xs font-bold uppercase tracking-widest">{name}</span>
                    <span className="text-[10px] text-stitch-lightBlue font-mono font-bold bg-white/10 px-1.5 py-0.2 rounded">
                        LV.{stats.level || 1}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 bg-black/90 px-3 py-1 rounded-lg border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)] pointer-events-auto">
                    <Coins size={14} className="text-amber-400" />
                    <span className="text-amber-300 font-mono text-xs font-bold">{stats.gold ?? 0}</span>
                </div>
            </div>

            {/* Header / Collapse Bar */}
            <div
                className="flex items-center justify-between cursor-pointer border-b border-stitch-blue/40 pb-3 pt-2"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-stitch-cyan">
                    <span className="flex items-center gap-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                        <Activity size={16} /> Bio-Metrics
                    </span>
                    {time && (
                        <span className={`text-[11px] ml-3 flex items-center gap-2 font-mono ${time.is_night ? 'text-indigo-300 drop-shadow-[0_0_5px_rgba(165,180,252,0.8)]' : 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]'}`}>
                            <span className="text-slate-400 font-sans tracking-tight">D{time.day}</span>
                            <span className="bg-black/40 px-2 py-0.5 rounded flex items-center gap-1 border border-white/10">
                                {time.is_night ? <Moon size={11} className="text-indigo-400" /> : <Sun size={11} className="text-yellow-500" />}
                                {formattedHour}:{formattedMin}
                            </span>
                        </span>
                    )}
                </h2>

                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenClassSelect) onOpenClassSelect();
                        }}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold transition-all ${getClassBadge()}`}
                    >
                        {stats.character_class || 'Adventurer'}
                    </button>
                    <button className="text-stitch-cyan hover:text-white transition-colors">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="space-y-3.5 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    
                    {/* HP & MP Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* HP Bar */}
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Activity size={12} className="text-red-400" /> Integrity (HP)
                                </span>
                                <span className={`font-bold font-mono text-sm ${hpTextColor}`}>
                                    {stats.hp}<span className="text-[10px] text-slate-500 ml-0.5">/{stats.max_hp}</span>
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${hpBgColor}`}
                                    style={{ width: `${Math.max(0, Math.min(100, hpPercent))}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* MP Bar */}
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                    <Zap size={12} className="text-stitch-cyan" /> Mana Energy (MP)
                                </span>
                                <span className="font-bold font-mono text-sm text-stitch-lightBlue drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">
                                    {stats.mp}<span className="text-[10px] text-slate-500 ml-0.5">/{stats.max_mp}</span>
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-stitch-cyan transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                                    style={{ width: `${Math.max(0, Math.min(100, mpPercent))}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Hunger & Thirst */}
                    {(stats.hunger !== undefined && stats.thirst !== undefined) && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/5 flex flex-col gap-1">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Nutrition</span>
                                    <span className={`font-mono text-[11px] ${stats.hunger < 20 ? 'text-orange-500 animate-pulse' : 'text-amber-400'}`}>{stats.hunger}%</span>
                                </div>
                                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${stats.hunger < 20 ? 'bg-orange-500' : 'bg-amber-400'}`} style={{ width: `${stats.hunger}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/5 flex flex-col gap-1">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Hydration</span>
                                    <span className={`font-mono text-[11px] ${stats.thirst < 20 ? 'text-orange-500 animate-pulse' : 'text-blue-400'}`}>{stats.thirst}%</span>
                                </div>
                                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${stats.thirst < 20 ? 'bg-orange-500' : 'bg-blue-400'}`} style={{ width: `${stats.thirst}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats Highlights (XP, Power, Defense, Level) */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-0.5">EXP</div>
                            <div className="text-stitch-lightBlue font-bold text-sm drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">{stats.xp}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1">
                                <Sword size={10} className="text-red-400" /> ATK
                            </div>
                            <div className="text-red-400 font-bold text-sm drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]">
                                {stats.strength}
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center">
                            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1">
                                <Shield size={10} className="text-blue-400" /> DEF
                            </div>
                            <div className="text-blue-400 font-bold text-sm drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]">
                                {stats.defense || 5}
                            </div>
                        </div>
                    </div>

                    {/* Equipment Loadout */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div
                            className={`bg-black/30 p-2.5 rounded-xl border flex flex-col items-center justify-center text-center group transition-colors overflow-hidden relative ${weapon ? 'hover:bg-red-900/20 cursor-pointer border-red-900/40' : 'hover:bg-black/50'}`}
                            onClick={() => weapon && onUnequip?.('weapon')}
                            title={weapon ? "Click to Unequip" : undefined}
                        >
                            {weapon ? (
                                <>
                                    <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Sword size={14} className="text-red-400 mb-1 drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <div className="text-slate-200 text-[10px] font-bold truncate w-full px-1">{weapon.name}</div>
                                    <div className="text-red-400/80 text-[8px] uppercase tracking-widest">+ {weapon.bonus || weapon.damage || '?'} ATK</div>
                                </>
                            ) : (
                                <>
                                    <Sword size={14} className="text-slate-600 mb-1" />
                                    <div className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">No Weapon</div>
                                </>
                            )}
                        </div>

                        <div
                            className={`bg-black/30 p-2.5 rounded-xl border flex flex-col items-center justify-center text-center group transition-colors overflow-hidden relative ${armor ? 'hover:bg-blue-900/20 cursor-pointer border-blue-900/40' : 'hover:bg-black/50'}`}
                            onClick={() => armor && onUnequip?.('armor')}
                            title={armor ? "Click to Unequip" : undefined}
                        >
                            {armor ? (
                                <>
                                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Shield size={14} className="text-stitch-blue mb-1 drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <div className="text-slate-200 text-[10px] font-bold truncate w-full px-1">{armor.name}</div>
                                    <div className="text-stitch-blue/80 text-[8px] uppercase tracking-widest">+ {armor.bonus || armor.shield || '?'} DEF</div>
                                </>
                            ) : (
                                <>
                                    <Shield size={14} className="text-slate-600 mb-1" />
                                    <div className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">No Armor</div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default BioMetrics;
