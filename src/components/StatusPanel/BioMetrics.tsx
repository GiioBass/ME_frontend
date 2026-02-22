import React from 'react';
import { Activity } from 'lucide-react';

interface BioMetricsProps {
    name: string;
    stats: {
        hp: number;
        max_hp: number;
        xp: number;
        strength: number;
    };
}

const BioMetrics: React.FC<BioMetricsProps> = ({ name, stats }) => {
    return (
        <div className="glass-panel rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex-shrink-0 border-stitch-blue/30">
            <h2 className="text-sm font-bold mb-4 flex items-center justify-between uppercase tracking-widest text-stitch-cyan border-b border-stitch-blue/40 pb-3">
                <span className="flex items-center gap-2 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"><Activity size={18} /> Bio-Metrics</span>
                <span className="text-white font-mono text-xs font-bold px-2 py-1 bg-stitch-blue/30 rounded-full">{name}</span>
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
