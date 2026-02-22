import React from 'react';
import { Backpack, Skull } from 'lucide-react';

interface EntityListProps {
    items: any[];
    enemies: any[];
    onTake: (itemName: string) => void;
    onAttack: (enemyName: string) => void;
}

const EntityList: React.FC<EntityListProps> = ({ items, enemies, onTake, onAttack }) => {
    return (
        <div className="mt-2 space-y-4 flex-shrink-0">
            {items && items.length > 0 && (
                <div className="bg-yellow-950/10 p-3 rounded-lg border border-yellow-900/20">
                    <span className="text-yellow-600 font-bold block mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Backpack size={14} /> Detected Items
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {items.map((item: any, idx: number) => (
                            <button key={idx}
                                className="group flex items-center gap-2 bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-500 hover:text-yellow-200 px-4 py-2 rounded border border-yellow-800/30 hover:border-yellow-500/50 transition-all active:scale-95 shadow-md flex-grow justify-between"
                                onClick={() => onTake(item.name)}
                            >
                                <span className="font-bold">{item.name}</span>
                                <span className="text-[10px] bg-yellow-900/50 px-1.5 py-0.5 rounded text-yellow-200 border border-yellow-700/50">TAKE</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {enemies && enemies.length > 0 && (
                <div className="bg-red-950/10 p-3 rounded-lg border border-red-900/20 animate-pulse-slow">
                    <span className="text-red-500 font-bold block mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                        Hostiles Detected
                    </span>
                    <div className="flex flex-col gap-3">
                        {enemies.map((enemy: any, idx: number) => (
                            <div key={idx} className="flex flex-col gap-2 text-xs text-red-300 bg-red-950/30 p-3 rounded border border-red-900/30">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm tracking-wide">{enemy.name}</span>
                                    <span className="text-red-400 font-mono">{enemy.hp} HP</span>
                                </div>

                                <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-red-900/50">
                                    <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(enemy.hp / enemy.max_hp) * 100}%` }}></div>
                                </div>

                                <button
                                    className="mt-1 w-full font-bold bg-red-900/40 hover:bg-red-600 text-red-200 hover:text-white py-3 rounded border border-red-700/50 hover:border-red-400 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider"
                                    onClick={() => onAttack(enemy.name)}
                                >
                                    <Skull size={16} /> ENGAGE TARGET
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EntityList;
