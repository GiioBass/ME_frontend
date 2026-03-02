import React, { useState } from 'react';
import { Map, Radio, Activity } from 'lucide-react';
import RadarPanel from './RadarPanel';

interface LocationInfoProps {
    name?: string;
    coordinates?: {
        x: number;
        y: number;
        z: number;
    };
    description: string;
    scoutedLocations?: { name: string; distance: number; direction: string }[];
    onScout?: () => void;
    isDark?: boolean;
    availableActions?: string[];
    onDrink?: () => void;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ name, coordinates, description, scoutedLocations, onScout, isDark, availableActions = [], onDrink }) => {
    const [isScanning, setIsScanning] = useState(false);

    const handleScout = () => {
        if (onScout) {
            setIsScanning(true);
            onScout();
            setTimeout(() => setIsScanning(false), 1000);
        }
    };
    return (
        <div className="flex-shrink-0">
            <h2 className="text-sm font-bold mb-4 flex flex-col gap-1 uppercase tracking-widest text-green-400/80 border-b border-green-900/50 pb-2">
                <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2"><Map size={18} /> Sector Data</span>
                    {coordinates && (
                        <span className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded border border-green-800/50 font-mono">
                            {coordinates.x},{coordinates.y},{coordinates.z}
                        </span>
                    )}
                </div>
                {name && <span className="text-green-200 text-xs font-mono ml-6">{name}</span>}
            </h2>
            <div className={`relative transition-all duration-700 ${isDark ? 'grayscale-[0.8] opacity-60' : ''}`}>
                <p className={`mb-6 leading-relaxed font-serif tracking-wide border-l-2 pl-4 italic py-3 rounded-r text-base transition-colors duration-700 ${isDark ? 'border-indigo-900 bg-indigo-950/20 text-indigo-300' : 'border-green-700/50 bg-green-900/5 text-green-100'}`}>
                    "{description}"
                </p>
                {isDark && (
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-indigo-500/30 text-[10px] uppercase tracking-tighter text-indigo-400 font-bold animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.8)]"></div>
                        Low Light Sector
                    </div>
                )}
            </div>

            {onScout && (
                <button
                    onClick={handleScout}
                    disabled={isScanning}
                    className="w-full mt-2 glass-panel-interactive py-2 rounded-xl flex items-center justify-center gap-2 text-stitch-cyan hover:text-white text-xs font-bold tracking-widest uppercase border-stitch-blue/30 hover:border-stitch-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Radio size={16} className={isScanning ? "animate-pulse text-white" : ""} />
                    {isScanning ? "Scanning Sector..." : "Pulse Radar"}
                </button>
            )}

            {onDrink && availableActions.includes("drink") && (
                <button
                    onClick={onDrink}
                    className="w-full mt-2 glass-panel-interactive py-2 rounded-xl flex items-center justify-center gap-2 text-blue-400 hover:text-white text-xs font-bold tracking-widest uppercase border-blue-500/30 hover:border-blue-400 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                >
                    <Activity size={16} />
                    Drink from Source
                </button>
            )}

            {scoutedLocations !== undefined && (
                <RadarPanel locations={scoutedLocations} />
            )}
        </div>
    );
};

export default LocationInfo;
