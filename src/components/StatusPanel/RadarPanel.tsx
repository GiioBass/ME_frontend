import React, { useMemo } from 'react';
import { Crosshair } from 'lucide-react';

interface ScoutedLocation {
    name: string;
    distance: number;
    direction: string;
}

interface RadarPanelProps {
    locations: ScoutedLocation[];
}

const RadarPanel: React.FC<RadarPanelProps> = ({ locations }) => {
    // We'll plot locations on a 100x100 grid where center is (50, 50).
    const plottedNodes = useMemo(() => {
        if (!locations) return [];
        return locations.map(loc => {
            let xOffset = 0;
            let yOffset = 0;
            const distScale = loc.distance * 8; // scale distance to percentage pixels

            if (loc.direction.includes('North')) yOffset = -distScale;
            if (loc.direction.includes('South')) yOffset = distScale;
            if (loc.direction.includes('West')) xOffset = -distScale;
            if (loc.direction.includes('East')) xOffset = distScale;

            return {
                ...loc,
                left: `calc(50% + ${xOffset}%)`,
                top: `calc(50% + ${yOffset}%)`
            };
        });
    }, [locations]);

    if (!locations) return null;

    return (
        <div className="glass-panel rounded-2xl p-4 mt-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col items-center border-stitch-cyan/30">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stitch-cyan mb-4 flex items-center gap-2">
                <Crosshair size={14} className="animate-spin-slow" /> Sector Radar
            </h3>

            <div className="relative w-full aspect-square max-w-[250px] rounded-full border border-stitch-cyan/30 bg-black/40 overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
                {/* Radar Grid Lines */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                    <div className="w-full h-px bg-stitch-cyan"></div>
                    <div className="h-full w-px bg-stitch-cyan absolute"></div>
                    <div className="w-[50%] h-[50%] rounded-full border border-stitch-cyan absolute"></div>
                    <div className="w-[80%] h-[80%] rounded-full border border-stitch-cyan absolute"></div>
                </div>

                {/* Radar Sweep Animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin-slow origin-center z-10">
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-stitch-cyan/10 to-transparent absolute top-0 -left-1/2 origin-right skew-x-12"></div>
                </div>

                {/* Center point (Player) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,1)] z-20"></div>

                {/* Plot the Nodes */}
                {plottedNodes.map((node, i) => (
                    <div
                        key={i}
                        className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 z-20 group"
                        style={{ left: node.left, top: node.top }}
                    >
                        <div className="w-2 h-2 bg-stitch-magenta rounded-full shadow-[0_0_8px_rgba(217,70,239,0.8)] animate-pulse"></div>
                        <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black/90 text-stitch-lightBlue text-[9px] px-2 py-0.5 rounded whitespace-nowrap border border-stitch-blue/50 opacity-0 group-hover:opacity-100 transition-opacity z-30 font-mono tracking-tighter">
                            {node.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 w-full text-xs space-y-1 max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-stitch-blue/30 pr-1">
                {locations.map((loc, i) => (
                    <div key={i} className="flex justify-between items-center text-slate-400 bg-black/20 px-2 py-1 rounded border border-white/5">
                        <span className="truncate w-3/5" title={loc.name}>{loc.name}</span>
                        <span className="font-mono text-stitch-cyan text-[10px] w-2/5 text-right">{loc.distance}u {loc.direction}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RadarPanel;
