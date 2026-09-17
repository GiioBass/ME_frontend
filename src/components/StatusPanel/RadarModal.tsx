import React from 'react';
import { Radio, X, Crosshair } from 'lucide-react';
import RadarPanel from './RadarPanel';

interface RadarModalProps {
    isOpen: boolean;
    onClose: () => void;
    scoutedLocations?: { name: string; distance: number; direction: string }[];
    isScanning?: boolean;
}

const RadarModal: React.FC<RadarModalProps> = ({ isOpen, onClose, scoutedLocations, isScanning = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-stitch-cyan rounded-xl w-full max-w-md shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-stitch-blue/20 p-4 border-b border-stitch-cyan/30 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-stitch-cyan flex items-center gap-2 uppercase tracking-wider">
                        <Crosshair size={24} className={isScanning ? "animate-spin-slow" : ""} /> Sector Radar
                    </h3>
                    <button onClick={onClose} disabled={isScanning} className={`text-stitch-cyan hover:text-white transition-colors ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 bg-black/40 flex flex-col items-center">
                    {(!scoutedLocations || scoutedLocations.length === 0) && !isScanning ? (
                        <div className="flex flex-col items-center justify-center h-48 text-stitch-cyan/50 gap-4">
                            <Radio size={48} className="opacity-20" />
                            <p className="font-mono text-sm tracking-widest text-center">NO DATA.<br /><span className="text-xs">INITIATE PULSE TO SCAN.</span></p>
                        </div>
                    ) : (
                        <div className="w-full max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-stitch-blue/30 pr-2">
                            <RadarPanel locations={scoutedLocations || []} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RadarModal;
