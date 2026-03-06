import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronsUp, ChevronsDown } from 'lucide-react';

interface NavigationGridProps {
    exits: Record<string, string>;
    onMove: (direction: string) => void;
}

const NavigationGrid: React.FC<NavigationGridProps> = ({ exits, onMove }) => {
    return (
        <div className="my-4 p-4 rounded-xl border border-stitch-blue/20 bg-black/20 shadow-[0_0_20px_rgba(6,182,212,0.05)] flex-shrink-0">
            <h3 className="text-center text-[10px] tracking-[0.3em] text-stitch-cyan/50 uppercase mb-4">Nav-Comm Panel</h3>

            <div className="grid grid-cols-4 gap-2">
                <button
                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${exits['west']
                        ? 'bg-gradient-to-l from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['west'] && onMove('west')}
                    disabled={!exits['west']}
                ><ArrowLeft size={24} /></button>
                <button
                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${exits['north']
                        ? 'bg-gradient-to-t from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['north'] && onMove('north')}
                    disabled={!exits['north']}
                ><ArrowUp size={24} /></button>
                <button
                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${exits['south']
                        ? 'bg-gradient-to-b from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['south'] && onMove('south')}
                    disabled={!exits['south']}
                ><ArrowDown size={24} /></button>
                <button
                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${exits['east']
                        ? 'bg-gradient-to-r from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['east'] && onMove('east')}
                    disabled={!exits['east']}
                ><ArrowRight size={24} /></button>
            </div>

            <div className="flex justify-center gap-3 mt-8 text-xs font-bold uppercase tracking-widest">
                <button disabled={!exits['up']} onClick={() => onMove('up')} className={`flex-1 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${exits['up'] ? 'border-stitch-cyan text-stitch-cyan hover:bg-stitch-cyan/20 hover:text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-transparent opacity-30 cursor-not-allowed bg-black/40 text-gray-500'}`}><ChevronsUp size={16} /> Ascend</button>
                <button disabled={!exits['down']} onClick={() => onMove('down')} className={`flex-1 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${exits['down'] ? 'border-stitch-cyan text-stitch-cyan hover:bg-stitch-cyan/20 hover:text-white shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-transparent opacity-30 cursor-not-allowed bg-black/40 text-gray-500'}`}><ChevronsDown size={16} /> Descend</button>
            </div>
        </div>
    );
};

export default NavigationGrid;
