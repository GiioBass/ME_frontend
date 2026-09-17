import React from 'react';
import { Backpack, Skull, MessageSquare, ShoppingBag, Wrench } from 'lucide-react';
import { type GameItem, type GameEnemy } from '../../api';

interface EntityListProps {
    items: GameItem[];
    enemies: GameEnemy[];
    availableActions?: string[];
    onTake: (itemName: string) => void;
    onAttack: (enemyName: string) => void;
    onTalk?: (npcName: string) => void;
    onOpenShop?: (npcName?: string) => void;
    onOpenCrafting?: () => void;
}

interface GroupedItem extends GameItem {
    qty: number;
}

const EntityList: React.FC<EntityListProps> = ({
    items,
    enemies,
    availableActions = [],
    onTake,
    onAttack,
    onTalk,
    onOpenShop,
    onOpenCrafting
}) => {
    // Group ground items by name to display stacks
    const groupedItems = React.useMemo(() => {
        if (!items) return [];
        const groups: Record<string, GroupedItem> = {};
        items.forEach(item => {
            const name = item.name;
            if (!groups[name]) {
                groups[name] = { ...item, qty: 0 };
            }
            groups[name].qty += item.qty || 1;
        });
        return Object.values(groups);
    }, [items]);

    // Extract NPCs from available actions (e.g., "talk Village Elder", "talk Merchant Silas")
    const npcs = React.useMemo(() => {
        const list: string[] = [];
        availableActions.forEach(action => {
            if (action.startsWith('talk ')) {
                const name = action.replace('talk ', '').trim();
                if (!list.includes(name)) {
                    list.push(name);
                }
            }
        });
        return list;
    }, [availableActions]);

    const hasShop = availableActions.some(act => act === 'shop' || act.startsWith('buy') || act.startsWith('sell'));
    const hasCraft = availableActions.some(act => act.startsWith('craft ') || act === 'craft');

    return (
        <div className="mt-2 space-y-4 flex-shrink-0">
            {/* NPCs Detected */}
            {npcs.length > 0 && (
                <div className="bg-cyan-950/20 p-3 rounded-xl border border-cyan-800/30">
                    <span className="text-stitch-cyan font-bold block mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                        <MessageSquare size={14} className="text-stitch-cyan" /> Citizens & Explorers
                    </span>
                    <div className="flex flex-col gap-2">
                        {npcs.map((npcName, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-cyan-900/30 px-3 py-2 rounded-lg border border-cyan-700/40">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-stitch-cyan animate-pulse"></div>
                                    <span className="text-white font-bold text-xs tracking-wide">{npcName}</span>
                                </div>
                                <div className="flex gap-2">
                                    {onTalk && (
                                        <button
                                            onClick={() => onTalk(npcName)}
                                            className="text-[10px] bg-stitch-cyan/20 hover:bg-stitch-cyan/40 text-stitch-cyan hover:text-white px-2.5 py-1 rounded border border-stitch-cyan/40 font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                                        >
                                            <MessageSquare size={12} /> Talk
                                        </button>
                                    )}
                                    {hasShop && npcName.toLowerCase().includes('merchant') && onOpenShop && (
                                        <button
                                            onClick={() => onOpenShop(npcName)}
                                            className="text-[10px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white px-2.5 py-1 rounded border border-amber-500/40 font-bold uppercase tracking-wider transition-all flex items-center gap-1 shadow-[0_0_8px_rgba(245,158,11,0.2)]"
                                        >
                                            <ShoppingBag size={12} /> Trade
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Workstations / Crafting */}
            {hasCraft && onOpenCrafting && (
                <div className="bg-amber-950/20 p-3 rounded-xl border border-amber-800/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wrench size={14} className="text-amber-400" />
                        <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">Workstation in Range</span>
                    </div>
                    <button
                        onClick={onOpenCrafting}
                        className="text-[10px] bg-amber-600/30 hover:bg-amber-600/60 text-amber-200 px-3 py-1 rounded border border-amber-500/50 font-bold uppercase tracking-wider transition-all"
                    >
                        Open Workshop
                    </button>
                </div>
            )}

            {/* Detected Ground Items */}
            {groupedItems && groupedItems.length > 0 && (
                <div className="bg-yellow-950/10 p-3 rounded-xl border border-yellow-900/20">
                    <span className="text-yellow-600 font-bold block mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Backpack size={14} /> Detected Items
                    </span>
                    <div className="flex flex-col gap-2">
                        {groupedItems.map((item, idx: number) => (
                            <div key={idx} className="group flex items-center gap-2 bg-yellow-900/20 text-yellow-500 px-3 py-2 rounded-lg border border-yellow-800/30 flex-grow justify-between">
                                <span className="font-bold text-xs">{item.name} {item.qty > 1 ? `(x${item.qty})` : ''}</span>
                                <div className="flex gap-2">
                                    <button
                                        className="text-[10px] bg-yellow-900/50 hover:bg-yellow-700/80 hover:text-white transition-colors px-2 py-1 rounded text-yellow-200 border border-yellow-700/50"
                                        onClick={() => onTake(item.name)}
                                    >
                                        TAKE 1
                                    </button>
                                    {item.qty > 1 && (
                                        <button
                                            className="text-[10px] bg-yellow-800/60 hover:bg-yellow-600/80 hover:text-white transition-colors px-2 py-1 rounded text-yellow-100 border border-yellow-500/50 font-bold"
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

            {/* Hostiles Detected */}
            {enemies && enemies.length > 0 && (
                <div className="bg-red-950/20 p-3 rounded-xl border border-red-900/30 animate-pulse-slow">
                    <span className="text-red-500 font-bold block mb-3 text-xs uppercase tracking-widest flex items-center gap-2">
                        <Skull size={14} /> Hostiles Detected
                    </span>
                    <div className="flex flex-col gap-3">
                        {enemies.map((enemy, idx: number) => (
                            <div key={idx} className="flex flex-col gap-2 text-xs text-red-300 bg-red-950/40 p-3 rounded-lg border border-red-900/40">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm tracking-wide text-white">{enemy.name}</span>
                                    <span className="text-red-400 font-mono font-bold">{enemy.hp}/{enemy.max_hp} HP</span>
                                </div>

                                <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-red-900/50">
                                    <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, (enemy.hp / enemy.max_hp) * 100))}%` }}></div>
                                </div>

                                <button
                                    className="mt-1 w-full font-bold bg-red-900/50 hover:bg-red-600 text-red-100 hover:text-white py-2.5 rounded-lg border border-red-700/50 hover:border-red-400 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                                    onClick={() => onAttack(enemy.name)}
                                >
                                    <Skull size={14} /> Attack Target
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
