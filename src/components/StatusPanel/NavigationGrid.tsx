import React from 'react';

interface NavigationGridProps {
    exits: Record<string, string>;
    onMove: (direction: string) => void;
}

const NavigationGrid: React.FC<NavigationGridProps> = ({ exits, onMove }) => {
    return (
        <div className="my-4 bg-black/40 p-4 rounded-xl border border-green-900/30 shadow-inner flex-shrink-0">
            <div className="grid grid-cols-3 gap-2 text-center max-w-[140px] mx-auto">
                <div />
                <button
                    className={`aspect-square flex items-center justify-center rounded transition-all ${exits['north']
                        ? 'bg-green-800/30 hover:bg-green-600/50 text-green-300 border border-green-600/50 shadow-[0_0_5px_rgba(0,255,0,0.1)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['north'] && onMove('north')}
                    disabled={!exits['north']}
                >N</button>
                <div />
                <button
                    className={`aspect-square flex items-center justify-center rounded transition-all ${exits['west']
                        ? 'bg-green-800/30 hover:bg-green-600/50 text-green-300 border border-green-600/50 shadow-[0_0_5px_rgba(0,255,0,0.1)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['west'] && onMove('west')}
                    disabled={!exits['west']}
                >W</button>

                <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute opacity-75"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full relative z-10"></div>
                </div>

                <button
                    className={`aspect-square flex items-center justify-center rounded transition-all ${exits['east']
                        ? 'bg-green-800/30 hover:bg-green-600/50 text-green-300 border border-green-600/50 shadow-[0_0_5px_rgba(0,255,0,0.1)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['east'] && onMove('east')}
                    disabled={!exits['east']}
                >E</button>
                <div />
                <button
                    className={`aspect-square flex items-center justify-center rounded transition-all ${exits['south']
                        ? 'bg-green-800/30 hover:bg-green-600/50 text-green-300 border border-green-600/50 shadow-[0_0_5px_rgba(0,255,0,0.1)]'
                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                    onClick={() => exits['south'] && onMove('south')}
                    disabled={!exits['south']}
                >S</button>
                <div />
            </div>
            <div className="flex justify-center gap-4 mt-6 text-sm font-bold text-gray-500">
                <button disabled={!exits['up']} onClick={() => onMove('up')} className={`flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${exits['up'] ? 'border-green-800 text-green-400 hover:bg-green-900/50 hover:border-green-500 hover:text-white cursor-pointer shadow-lg' : 'border-transparent opacity-30 cursor-not-allowed bg-black/20'}`}>ASCEND ▲</button>
                <button disabled={!exits['down']} onClick={() => onMove('down')} className={`flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${exits['down'] ? 'border-green-800 text-green-400 hover:bg-green-900/50 hover:border-green-500 hover:text-white cursor-pointer shadow-lg' : 'border-transparent opacity-30 cursor-not-allowed bg-black/20'}`}>DESCEND ▼</button>
            </div>
        </div>
    );
};

export default NavigationGrid;
