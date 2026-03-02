import React from 'react';
import { Backpack, Skull } from 'lucide-react';

import { type GameItem, type GameEnemy } from '../../api';

interface EntityListProps {
    items: GameItem[];
    enemies: GameEnemy[];
    onTake: (itemName: string) => void;
    onAttack: (enemyName: string) => void;
}

const EntityList: React.FC<EntityListProps> = ({ items, enemies, onTake, onAttack }) => {
    // Group ground items by name to display stacks
    const groupedItems = React.useMemo(() => {
        if (!items) return [];
        const groups: Record<string, any> = {};
        items.forEach(item => {
            if (!groups[item.name]) {
                groups[item.name] = { ...item, qty: 0 };
            }
            groups[item.name].qty++;
        });
        return Object.values(groups);
    }, [items]);

    return (
        <div className="mt-2 space-y-4 flex-shrink-0">
            {groupedItems && groupedItems.length > 0 && (
                <div className="bg-yellow-950/10 p-3 rounded-lg border border-yellow-900/20">
                    <span className="text-yellow-600 font-bold block mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Backpack size={14} /> Detected Items
                    </span>
                    <div className="flex flex-col gap-3">
                        {groupedItems.map((item, idx: number) => (
                            <div key={idx} className="group flex items-center gap-2 bg-yellow-900/20 text-yellow-500 px-4 py-2 rounded border border-yellow-800/30 flex-grow justify-between">
                                <span className="font-bold">{item.name} {item.qty > 1 ? `(x${item.qty})` : ''}</span>
                                <div className="flex gap-2">
                                    <button
                                        className="text-[10px] bg-yellow-900/50 hover:bg-yellow-700/80 hover:text-white transition-colors px-2 py-1 rounded text-yellow-200 border border-yellow-700/50"
                                        onClick={() => onTake(item.name)}
                                    >
                                        TAKE 1
                                    </button>
                                    {item.qty > 1 && (
                                        <button
                                            className="text-[10px] bg-yellow-800/60 hover:bg-yellow-600/80 hover:text-white transition-colors px-2 py-1 rounded text-yellow-100 border border-yellow-500/50"
                                            onClick={() => onTake(`${item.name} ${item.qty}`)}
                                        >
                                            TAKE ALL
                                        </button>
                                    )}
                                </div>
                            </div>
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
                        {enemies.map((enemy, idx: number) => (
                            <div key={idx} className="flex flex-col gap-2 text-xs text-red-300 bg-red-950/30 p-3 rounded border border-red-900/30">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm tracking-wide">{enemy.name}</span>
                                    <span className="text-red-400 font-mono">{enemy.hp} HP</span>
                                </div>

                                <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-red-900/50">
                                    <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(enemy.hp / enemy.max_hp) * 100}%` }}></div>
                                </div>

                                <button
                                    className="mt-1 w-full font-bold bg-red-900/40 hover:bg-red-600 text-red-200 hover:text-white py-3 rounded border border-red-700/50 hover:border-red-400 transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider"
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
