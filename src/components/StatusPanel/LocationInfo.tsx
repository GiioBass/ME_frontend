import React from 'react';
import { Map, Droplet, Flame, Hammer, FlaskConical, Wrench } from 'lucide-react';

interface LocationInfoProps {
    name?: string;
    coordinates?: {
        x: number;
        y: number;
        z: number;
    };
    description: string;
    isDark?: boolean;
    availableActions?: string[];
    onDrink?: () => void;
    onOpenCrafting?: () => void;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
    name,
    coordinates,
    description,
    isDark,
    availableActions = [],
    onDrink,
    onOpenCrafting
}) => {
    const hasWater = availableActions.includes("drink");
    const hasCampfire = availableActions.some(a => a.toLowerCase().includes('campfire') || a.toLowerCase().includes('camp'));
    const hasForge = availableActions.some(a => a.toLowerCase().includes('forge'));
    const hasAlchemyLab = availableActions.some(a => a.toLowerCase().includes('alchemy'));
    const hasCraftStation = hasCampfire || hasForge || hasAlchemyLab;

    return (
        <div className="flex-shrink-0">
            {/* Sector Header */}
            <div className="flex justify-between items-center mb-2 border-b border-stitch-cyan/30 pb-2">
                <div className="flex items-center gap-2 text-stitch-cyan">
                    <Map size={16} className="text-stitch-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-200">
                        {name || "Unknown Sector"}
                    </span>
                </div>
                {coordinates && (
                    <span className="text-[10px] bg-black/60 text-stitch-lightBlue px-2 py-0.5 rounded border border-stitch-cyan/40 font-mono font-bold">
                        {coordinates.x},{coordinates.y},{coordinates.z}
                    </span>
                )}
            </div>

            {/* Environmental Narrative Box */}
            <div className={`relative transition-all duration-500 rounded-xl p-3.5 ${isDark ? 'bg-indigo-950/20 border border-indigo-900/40 text-indigo-200' : 'bg-black/30 border border-white/5 text-slate-300'}`}>
                <p className="leading-relaxed font-serif tracking-wide text-xs sm:text-sm italic">
                    "{description}"
                </p>
                {isDark && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 border border-indigo-500/40 text-[9px] uppercase tracking-wider text-indigo-300 font-bold animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]"></div>
                        Low Light / Darkness Detected
                    </div>
                )}
            </div>

            {/* Environment Features / Stations Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
                {hasWater && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/50 font-bold flex items-center gap-1">
                        <Droplet size={10} className="text-blue-400" /> Water Source
                    </span>
                )}
                {hasCampfire && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/50 font-bold flex items-center gap-1">
                        <Flame size={10} className="text-amber-400" /> Campfire Active
                    </span>
                )}
                {hasForge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-950/60 text-orange-300 border border-orange-800/50 font-bold flex items-center gap-1">
                        <Hammer size={10} className="text-orange-400" /> Blacksmith Forge
                    </span>
                )}
                {hasAlchemyLab && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-800/50 font-bold flex items-center gap-1">
                        <FlaskConical size={10} className="text-purple-400" /> Alchemy Station
                    </span>
                )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                {hasWater && onDrink && (
                    <button
                        onClick={onDrink}
                        className="py-2 rounded-xl flex items-center justify-center gap-1.5 text-stitch-cyan hover:text-white text-xs font-bold tracking-widest uppercase border border-stitch-cyan/40 bg-stitch-cyan/10 hover:bg-stitch-cyan/20 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    >
                        <Droplet size={14} /> Drink
                    </button>
                )}
                {hasCraftStation && onOpenCrafting && (
                    <button
                        onClick={onOpenCrafting}
                        className="py-2 rounded-xl flex items-center justify-center gap-1.5 text-amber-400 hover:text-white text-xs font-bold tracking-widest uppercase border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                    >
                        <Wrench size={14} /> Craft
                    </button>
                )}
            </div>
        </div>
    );
};

export default LocationInfo;
