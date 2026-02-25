import React from 'react';
import { Activity, Sun, Moon } from 'lucide-react';

interface BioMetricsProps {
    name: string;
    stats: {
        hp: number;
        max_hp: number;
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
}

const BioMetrics: React.FC<BioMetricsProps> = ({ name, stats, time }) => {
    const formattedHour = time?.hour.toString().padStart(2, '0') || '00';
    const formattedMin = time?.minute.toString().padStart(2, '0') || '00';

    return (
        <div className="glass-panel rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex-shrink-0 border-stitch-blue/30 relative">

            {/* Player Name Display */}
            <div className="absolute -top-3 left-6 flex items-center gap-2 bg-black px-3 py-1 rounded-md border border-stitch-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] z-10">
                <div className="w-2 h-2 rounded-full bg-stitch-green animate-pulse"></div>
                <span className="text-white font-mono text-xs font-bold uppercase tracking-widest">{name}</span>
            </div>

            <h2 className="text-sm font-bold mt-2 mb-4 flex items-center justify-between uppercase tracking-widest text-stitch-cyan border-b border-stitch-blue/40 pb-3">
                <span className="flex items-center gap-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"><Activity size={18} /> Bio-Metrics</span>
                {time && (
                    <span className={`text-xs ml-auto flex items-center gap-2 font-mono ${time.is_night ? 'text-indigo-300 drop-shadow-[0_0_5px_rgba(165,180,252,0.8)]' : 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]'}`}>
                        <span className="text-slate-400 font-sans tracking-tight">DAY {time.day}</span>
                        <span className="bg-black/40 px-2 py-0.5 rounded flex items-center gap-1.5 border border-white/10">
                            {time.is_night ? <Moon size={12} className="text-indigo-400" /> : <Sun size={12} className="text-yellow-500" />}
                            {formattedHour}:{formattedMin}
                        </span>
                    </span>
                )}
            </h2>
            <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/5 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Integrity (HP)</span>
                        <span className={`font-bold font-mono text-lg ${stats.hp < 10 ? 'text-stitch-orange animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-stitch-green drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`}>
                            {stats.hp}<span className="text-xs text-slate-500 ml-1">/{stats.max_hp}</span>
                        </span>
                    </div>
                    {/* HP Bar */}
                    <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${stats.hp < 10 ? 'bg-stitch-orange' : 'bg-stitch-green'}`} style={{ width: `${Math.max(0, Math.min(100, (stats.hp / stats.max_hp) * 100))}%` }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Energy (XP)</div>
                        <div className="text-stitch-lightBlue font-bold text-xl drop-shadow-[0_0_5px_rgba(56,189,248,0.5)]">{stats.xp}</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Power (STR)</div>
                        <div className="text-stitch-magenta font-bold text-xl drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]">{stats.strength}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BioMetrics;
