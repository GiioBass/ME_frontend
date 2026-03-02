import React, { useState } from 'react';
import { Activity, Sun, Moon, Sword, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { type GameItem } from '../../api';

interface BioMetricsProps {
    name: string;
    stats: {
        hp: number;
        max_hp: number;
        hunger?: number;
        thirst?: number;
        xp: number;
        strength: number;
    };
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
}

const BioMetrics: React.FC<BioMetricsProps> = ({ name, stats, time, weapon, armor, onUnequip }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const formattedHour = time?.hour.toString().padStart(2, '0') || '00';
    const formattedMin = time?.minute.toString().padStart(2, '0') || '00';

    const hpPercent = (stats.hp / stats.max_hp) * 100;
    let hpTextColor = 'text-green-500 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]';
    let hpBgColor = 'bg-green-500';
    let hpHexColor = '#22c55e'; // green-500

    if (hpPercent <= 20) {
        hpTextColor = 'text-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]';
        hpBgColor = 'bg-orange-500';
        hpHexColor = '#f97316'; // orange-500
    } else if (hpPercent <= 50) {
        hpTextColor = 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]';
        hpBgColor = 'bg-yellow-400';
        hpHexColor = '#eab308'; // yellow-400
    }

    return (
        <div className="glass-panel rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex-shrink-0 border-stitch-blue/30 relative transition-all duration-300">

            {/* Player Name Display */}
            <div className="absolute -top-3 left-6 flex items-center gap-2 bg-black px-3 py-1 rounded-md border border-stitch-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] z-10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-white font-mono text-xs font-bold uppercase tracking-widest">{name}</span>
            </div>

            <div
                className="flex items-center justify-between cursor-pointer border-b border-stitch-blue/40 pb-3"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="text-sm font-bold mt-2 flex items-center gap-2 uppercase tracking-widest text-stitch-cyan">
                    <span className="flex items-center gap-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                        <Activity size={18} /> Bio-Metrics
                    </span>
                    {time && (
                        <span className={`text-xs ml-4 flex items-center gap-2 font-mono ${time.is_night ? 'text-indigo-300 drop-shadow-[0_0_5px_rgba(165,180,252,0.8)]' : 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]'}`}>
                            <span className="text-slate-400 font-sans tracking-tight">DAY {time.day}</span>
                            <span className="bg-black/40 px-2 py-0.5 rounded flex items-center gap-1.5 border border-white/10">
                                {time.is_night ? <Moon size={12} className="text-indigo-400" /> : <Sun size={12} className="text-yellow-500" />}
                                {formattedHour}:{formattedMin}
                            </span>
                        </span>
                    )}
                </h2>
                <button className="text-stitch-cyan hover:text-white transition-colors mt-2">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {isExpanded && (
                <div className="space-y-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Integrity (HP)</span>
                            <span className={`font-bold font-mono text-lg ${hpTextColor}`}>
                                {stats.hp}<span className="text-xs text-slate-500 ml-1">/{stats.max_hp}</span>
                            </span>
                        </div>
                        {/* HP Bar */}
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${hpBgColor}`}
                                style={{
                                    width: `${Math.max(0, Math.min(100, hpPercent))}%`,
                                    backgroundColor: hpHexColor // Fallback
                                }}
                            ></div>
                        </div>
                    </div>

                    {(stats.hunger !== undefined && stats.thirst !== undefined) && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col gap-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Nutrition</span>
                                    <span className={`font-mono text-xs ${stats.hunger < 20 ? 'text-orange-500 animate-pulse' : 'text-amber-400'}`}>{stats.hunger}%</span>
                                </div>
                                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${stats.hunger < 20 ? 'bg-orange-500' : 'bg-amber-400'}`} style={{ width: `${stats.hunger}%` }}></div>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col gap-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Hydration</span>
                                    <span className={`font-mono text-xs ${stats.thirst < 20 ? 'text-orange-500 animate-pulse' : 'text-blue-400'}`}>{stats.thirst}%</span>
                                </div>
                                <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-500 ${stats.thirst < 20 ? 'bg-orange-500' : 'bg-blue-400'}`} style={{ width: `${stats.thirst}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">EXP</div>
                            <div className="text-stitch-lightBlue font-bold text-xl drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">{stats.xp}</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Power (STR)</div>
                            <div className="text-stitch-magenta font-bold text-xl drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">{stats.strength}</div>
                        </div>
                    </div>

                    {/* Equipment Loadout */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div
                            className={`bg-black/30 p-3 rounded-xl border flex flex-col items-center justify-center text-center group transition-colors overflow-hidden relative ${weapon ? 'hover:bg-red-900/20 cursor-pointer border-red-900/40' : 'hover:bg-black/50'}`}
                            onClick={() => weapon && onUnequip?.('weapon')}
                            title={weapon ? "Click to Unequip" : undefined}
                        >
                            {weapon ? (
                                <>
                                    <div className="absolute inset-0 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Sword size={16} className="text-red-400 mb-1 drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <div className="text-slate-300 text-[10px] font-bold truncate w-full px-1">{weapon.name}</div>
                                    <div className="text-red-500/70 text-[8px] uppercase tracking-widest">+ {weapon.bonus || '?'} ATK</div>
                                </>
                            ) : (
                                <>
                                    <Sword size={16} className="text-slate-600 mb-1" />
                                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No Weapon</div>
                                </>
                            )}
                            <div className={`absolute top-0 right-0 p-1 rounded-bl ${weapon ? 'bg-red-900/40 border-l border-b border-red-800' : 'bg-slate-800/40 border-l border-b border-slate-700/50'}`}></div>
                        </div>
                        <div
                            className={`bg-black/30 p-3 rounded-xl border flex flex-col items-center justify-center text-center group transition-colors overflow-hidden relative ${armor ? 'hover:bg-blue-900/20 cursor-pointer border-blue-900/40' : 'hover:bg-black/50'}`}
                            onClick={() => armor && onUnequip?.('armor')}
                            title={armor ? "Click to Unequip" : undefined}
                        >
                            {armor ? (
                                <>
                                    <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Shield size={16} className="text-stitch-blue mb-1 drop-shadow-md group-hover:scale-110 transition-transform" />
                                    <div className="text-slate-300 text-[10px] font-bold truncate w-full px-1">{armor.name}</div>
                                    <div className="text-stitch-blue/70 text-[8px] uppercase tracking-widest">+ {armor.bonus || '?'} DEF</div>
                                </>
                            ) : (
                                <>
                                    <Shield size={16} className="text-slate-600 mb-1" />
                                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">No Armor</div>
                                </>
                            )}
                            <div className={`absolute top-0 right-0 p-1 rounded-bl ${armor ? 'bg-blue-900/40 border-l border-b border-blue-800' : 'bg-slate-800/40 border-l border-b border-slate-700/50'}`}></div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default BioMetrics;
