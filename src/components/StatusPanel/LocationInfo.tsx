import React from 'react';
import { Map } from 'lucide-react';

interface LocationInfoProps {
    name?: string;
    coordinates?: {
        x: number;
        y: number;
        z: number;
    };
    description: string;
}

const LocationInfo: React.FC<LocationInfoProps> = ({ name, coordinates, description }) => {
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
            <p className="mb-6 text-green-100 leading-relaxed font-serif tracking-wide border-l-2 border-green-700/50 pl-4 italic bg-green-900/5 py-3 rounded-r text-base">
                "{description}"
            </p>
        </div>
    );
};

export default LocationInfo;
