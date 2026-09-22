import React, { useMemo, useState } from 'react';
import { Crosshair, Navigation, Radio } from 'lucide-react';
import type { ScoutedLocation } from '../../api';

interface RadarPanelProps {
    locations: ScoutedLocation[];
}

const RadarPanel: React.FC<RadarPanelProps> = ({ locations }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Calculate maximum distance to scale the radar grid proportionally
    const maxRadius = useMemo(() => {
        if (!locations || locations.length === 0) return 5;
        const maxDist = Math.max(
            5,
            ...locations.map(loc => {
                if (typeof loc.dx === 'number' && typeof loc.dy === 'number') {
                    return Math.max(Math.abs(loc.dx), Math.abs(loc.dy));
                }
                return loc.distance || 1;
            })
        );
        return maxDist;
    }, [locations]);

    // Plot locations using exact Cartesian projection (dx, dy)
    const plottedNodes = useMemo(() => {
        if (!locations) return [];
        // Max offset percent from center (circle boundary is at 50%, nodes stay within 40%)
        const maxDisplayPercent = 38;

        return locations.map((loc, idx) => {
            let xOffset = 0;
            let yOffset = 0;

            if (typeof loc.dx === 'number' && typeof loc.dy === 'number') {
                // Exact Cartesian coordinates
                xOffset = (loc.dx / maxRadius) * maxDisplayPercent;
                // In 2D screen coordinates, North (+dy) is Up (-y), South (-dy) is Down (+y)
                yOffset = -(loc.dy / maxRadius) * maxDisplayPercent;
            } else {
                // Fallback using direction string and distance
                const dist = Math.min(loc.distance || 1, maxRadius);
                let fallbackDx = 0;
                let fallbackDy = 0;

                if (loc.direction.includes('North')) fallbackDy += 1;
                if (loc.direction.includes('South')) fallbackDy -= 1;
                if (loc.direction.includes('East')) fallbackDx += 1;
                if (loc.direction.includes('West')) fallbackDx -= 1;

                const mag = Math.sqrt(fallbackDx * fallbackDx + fallbackDy * fallbackDy);
                if (mag > 0) {
                    fallbackDx = (fallbackDx / mag) * dist;
                    fallbackDy = (fallbackDy / mag) * dist;
                }

                xOffset = (fallbackDx / maxRadius) * maxDisplayPercent;
                yOffset = -(fallbackDy / maxRadius) * maxDisplayPercent;
            }

            // Determine POI color and badge
            const isCave = loc.type === 'cave' || loc.name.toLowerCase().includes('cave') || loc.name.toLowerCase().includes('dungeon') || loc.name.toLowerCase().includes('exit');
            const isWater = loc.type === 'water' || loc.name.toLowerCase().includes('water') || loc.name.toLowerCase().includes('river') || loc.name.toLowerCase().includes('lake') || loc.name.toLowerCase().includes('stream') || loc.name.toLowerCase().includes('well');
            const isTown = loc.type === 'town' || loc.name.toLowerCase().includes('oakfield') || loc.name.toLowerCase().includes('village') || loc.name.toLowerCase().includes('town') || loc.name.toLowerCase().includes('hub');

            let colorClass = 'bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.9)]';
            let dotBorder = 'border-fuchsia-200';
            let badgeBg = 'bg-fuchsia-950/60 border-fuchsia-500/40 text-fuchsia-300';
            let poiLabel = 'Point of Interest';

            if (isCave) {
                colorClass = 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]';
                dotBorder = 'border-amber-200';
                badgeBg = 'bg-amber-950/60 border-amber-500/40 text-amber-300';
                poiLabel = 'Subterranean Entrance';
            } else if (isWater) {
                colorClass = 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]';
                dotBorder = 'border-cyan-200';
                badgeBg = 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300';
                poiLabel = 'Water Resource';
            } else if (isTown) {
                colorClass = 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]';
                dotBorder = 'border-emerald-200';
                badgeBg = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
                poiLabel = 'Civilization / Hub';
            }

            return {
                ...loc,
                index: idx,
                xOffset,
                yOffset,
                left: `calc(50% + ${xOffset}%)`,
                top: `calc(50% + ${yOffset}%)`,
                colorClass,
                dotBorder,
                badgeBg,
                poiLabel,
                formattedCoord: typeof loc.dx === 'number' && typeof loc.dy === 'number' 
                    ? `ΔX: ${loc.dx > 0 ? '+' : ''}${loc.dx}, ΔY: ${loc.dy > 0 ? '+' : ''}${loc.dy}` 
                    : `${loc.distance}u ${loc.direction}`
            };
        });
    }, [locations, maxRadius]);

    const activeNode = hoveredIndex !== null ? plottedNodes.find(n => n.index === hoveredIndex) : null;

    if (!locations) return null;

    return (
        <div className="glass-panel rounded-2xl p-4 mt-2 shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col items-center border-stitch-cyan/30 w-full">
            
            {/* Header Telemetry */}
            <div className="w-full flex items-center justify-between mb-3 border-b border-stitch-cyan/20 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stitch-cyan flex items-center gap-2">
                    <Crosshair size={14} className="animate-spin-slow text-stitch-cyan" /> Sector Radar (Range: {maxRadius} Chunks)
                </h3>
                <span className="text-[10px] font-mono text-stitch-lightBlue bg-black/40 px-2 py-0.5 rounded border border-stitch-cyan/30">
                    {locations.length} Signals
                </span>
            </div>

            {/* Radar Scope Wrapper (Allows Popups to overflow and layer on top with z-50) */}
            <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center my-1 select-none">
                
                {/* 1. Radar Circular Background & Grid (Clipped inside circular border) */}
                <div className="absolute inset-0 rounded-full border-2 border-stitch-cyan/40 bg-black/70 overflow-hidden shadow-[inset_0_0_25px_rgba(6,182,212,0.25)]">
                    
                    {/* Concentric Range Rings */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute w-[30%] h-[30%] rounded-full border border-stitch-cyan/20"></div>
                        <div className="absolute w-[60%] h-[60%] rounded-full border border-stitch-cyan/25"></div>
                        <div className="absolute w-[85%] h-[85%] rounded-full border border-stitch-cyan/35 border-dashed"></div>
                        
                        {/* Crosshairs */}
                        <div className="w-full h-px bg-stitch-cyan/25 absolute"></div>
                        <div className="h-full w-px bg-stitch-cyan/25 absolute"></div>
                    </div>

                    {/* Cardinal Direction Markers */}
                    <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[11px] font-mono font-bold text-stitch-cyan drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]">N</span>
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-mono font-bold text-stitch-cyan/70">S</span>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-stitch-cyan/70">E</span>
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-stitch-cyan/70">W</span>

                    {/* Radar Sweep Beam Animation */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin-slow origin-center z-10">
                        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-stitch-cyan/15 to-transparent absolute top-0 -left-1/2 origin-right skew-x-12"></div>
                    </div>
                </div>

                {/* 2. Center Point (Player Current Position) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-stitch-cyan shadow-[0_0_12px_rgba(255,255,255,1)] z-20 pointer-events-none" title="Player Position">
                    <div className="w-full h-full rounded-full animate-ping opacity-75 bg-stitch-cyan"></div>
                </div>

                {/* 3. Interactive Landmark Nodes Layer (Unclipped with ultra-high z-index for popups) */}
                <div className="absolute inset-0 z-30 pointer-events-auto">
                    {plottedNodes.map((node) => {
                        const isHovered = hoveredIndex === node.index;
                        // Determine smart popup orientation (render above if on lower half to prevent bottom clipping)
                        const renderAbove = node.yOffset > 0;
                        const renderLeft = node.xOffset > 15;

                        return (
                            <div
                                key={node.index}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-150 ${isHovered ? 'z-50 scale-125' : 'z-30 hover:scale-110'}`}
                                style={{ left: node.left, top: node.top }}
                                onMouseEnter={() => setHoveredIndex(node.index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* Blip Indicator */}
                                <div className="relative flex items-center justify-center p-2 -m-2">
                                    <div className={`w-3 h-3 rounded-full border-2 ${node.dotBorder} ${node.colorClass} ${isHovered ? 'animate-bounce' : 'animate-pulse'}`}></div>
                                </div>

                                {/* Floating Popup Information (Brought to the extreme foreground: z-[100]) */}
                                {isHovered && (
                                    <div 
                                        className={`absolute ${renderAbove ? 'bottom-full mb-2' : 'top-full mt-2'} ${renderLeft ? 'right-0 translate-x-2' : 'left-1/2 -translate-x-1/2'} bg-slate-950/95 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-xl whitespace-nowrap border-2 border-stitch-cyan shadow-[0_0_25px_rgba(6,182,212,0.6)] pointer-events-none z-[100] font-mono flex flex-col items-center gap-1 min-w-[130px] animate-in fade-in zoom-in-95 duration-150`}
                                    >
                                        <div className="flex items-center gap-1.5 font-bold text-stitch-cyan text-xs">
                                            <Navigation size={12} className="text-stitch-cyan" />
                                            <span>{node.name}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-300 flex items-center gap-2">
                                            <span className="font-bold text-white">{node.formattedCoord}</span>
                                            <span className="text-stitch-lightBlue">({node.direction})</span>
                                        </div>
                                        <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded font-bold ${node.badgeBg}`}>
                                            {node.poiLabel}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Live Telemetry Bar when Hovering */}
            {activeNode ? (
                <div className="w-full mt-2 p-2 rounded-xl bg-cyan-950/50 border border-stitch-cyan/60 flex items-center justify-between text-xs text-white animate-in fade-in duration-150 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <div className="flex items-center gap-2 truncate">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${activeNode.colorClass}`}></div>
                        <span className="font-bold text-stitch-cyan truncate">{activeNode.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[10px]">
                        <span className="text-slate-300">{activeNode.formattedCoord}</span>
                        <span className={`px-1.5 py-0.5 rounded font-bold ${activeNode.badgeBg}`}>
                            {activeNode.direction}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="w-full mt-2 p-1.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-center text-[10px] font-mono text-slate-400">
                    <Radio size={12} className="mr-1.5 text-stitch-cyan/60" /> Hover over a radar signal for coordinates
                </div>
            )}

            {/* List of Scanned Landmarks */}
            <div className="mt-2 w-full text-xs space-y-1.5 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-stitch-blue/30 pr-1">
                {plottedNodes.map((loc) => {
                    const isHovered = hoveredIndex === loc.index;
                    return (
                        <div
                            key={loc.index}
                            onMouseEnter={() => setHoveredIndex(loc.index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className={`flex justify-between items-center px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                isHovered 
                                    ? 'bg-stitch-cyan/25 border-stitch-cyan text-white shadow-[0_0_12px_rgba(6,182,212,0.35)]' 
                                    : 'bg-black/30 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10'
                            }`}
                        >
                            <div className="flex items-center gap-2 truncate max-w-[65%]">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${loc.colorClass}`}></div>
                                <span className="truncate font-medium" title={loc.name}>{loc.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="font-mono text-[10px] text-slate-400">{loc.formattedCoord}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${loc.badgeBg}`}>
                                    {loc.direction}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RadarPanel;
