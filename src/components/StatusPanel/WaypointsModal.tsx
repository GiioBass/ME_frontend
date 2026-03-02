import React, { useState } from 'react';
import { MapPin, X, Navigation } from 'lucide-react';

interface WaypointsModalProps {
    waypoints: Record<string, string>;
    isOpen: boolean;
    onClose: () => void;
    onTravel: (waypointName: string) => void;
    onCreateCamp: (campName: string) => void;
    isTraveling: boolean;
}

const WaypointsModal: React.FC<WaypointsModalProps> = ({ waypoints, isOpen, onClose, onTravel, onCreateCamp, isTraveling }) => {
    const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);
    const [newCampName, setNewCampName] = useState('');

    if (!isOpen) return null;

    const waypointEntries = Object.entries(waypoints || {});

    const handleTravel = (name: string) => {
        if (isTraveling) return;
        setSelectedWaypoint(name);
        onTravel(name);
    }

    const handleCreateCamp = () => {
        if (!newCampName.trim() || isTraveling) return;
        onCreateCamp(newCampName.trim());
        setNewCampName('');
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-blue-600 rounded-xl w-full max-w-md shadow-[0_0_30px_rgba(37,99,235,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-blue-900/20 p-4 border-b border-blue-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2 uppercase tracking-wider">
                        <MapPin size={24} /> Fast Travel Network
                    </h3>
                    <button onClick={onClose} disabled={isTraveling} className={`text-blue-500 hover:text-white transition-colors ${isTraveling ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 min-h-[300px] max-h-[60vh] overflow-y-auto bg-black/40 relative">
                    {isTraveling && (
                        <div className="absolute inset-0 z-10 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                            <Navigation size={48} className="text-blue-400 animate-pulse mb-4" />
                            <p className="text-blue-300 font-mono animate-pulse font-bold tracking-widest text-center">INITIATING SLIPSPACE...<br />TRAVELING TO {selectedWaypoint}</p>
                        </div>
                    )}

                    {waypointEntries.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {waypointEntries.map(([name, id], idx: number) => {
                                return (
                                    <div key={idx} className="bg-blue-900/10 border border-blue-800/50 p-4 rounded-lg flex items-center justify-between hover:bg-blue-900/20 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-900/30 rounded flex items-center justify-center border border-blue-700/50 group-hover:border-blue-500">
                                                <MapPin size={20} className="text-blue-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-blue-300 text-lg">{name}</span>
                                                <span className="text-[10px] text-blue-600 font-mono tracking-widest truncate max-w-[150px]">{id}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleTravel(name)}
                                            disabled={isTraveling}
                                            className="text-[10px] bg-blue-700/30 hover:bg-blue-600/50 px-3 py-2 rounded-md text-blue-100 uppercase tracking-widest transition-colors font-bold border border-blue-600/50 disabled:opacity-50"
                                        >
                                            Travel
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-blue-700 gap-4 mt-10">
                            <MapPin size={64} className="opacity-20" />
                            <p className="text-lg italic text-center text-blue-500/50">No Waypoints Discovered.<br /><span className="text-sm">Use the 'camp &lt;name&gt;' command to establish one.</span></p>
                        </div>
                    )}
                </div>

                <div className="bg-blue-900/10 p-4 border-t border-blue-900/50 flex flex-col gap-2">
                    <span className="text-[10px] text-center text-blue-600 font-mono mb-1">WARNING: LONG DISTANCE TRAVEL DEPLETES ENERGY LEVELS</span>
                    <div className="flex gap-2 items-center w-full">
                        <input
                            type="text"
                            value={newCampName}
                            onChange={(e) => setNewCampName(e.target.value)}
                            placeholder="Enter new camp name..."
                            disabled={isTraveling}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateCamp(); }}
                            className="bg-black/50 border border-blue-800/50 text-blue-100 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:border-blue-500 placeholder:text-blue-800/50 uppercase font-mono disabled:opacity-50"
                        />
                        <button
                            onClick={handleCreateCamp}
                            disabled={!newCampName.trim() || isTraveling}
                            className="bg-blue-600/80 hover:bg-blue-500 text-white font-bold tracking-widest uppercase text-xs px-4 py-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-blue-400/50"
                        >
                            Establish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaypointsModal;
