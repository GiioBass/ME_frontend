import React from 'react';
import { Package, X, Activity } from 'lucide-react';

import { type GameItem } from '../../api';

interface InventoryModalProps {
    inventory: (GameItem | string)[];
    currentWeight: number;
    maxWeight: number;
    isOpen: boolean;
    onClose: () => void;
    onEquip: (item: string) => void;
    onDrop: (itemName: string) => void;
    onConsume?: (itemName: string) => void;
    onFill?: (itemName: string) => void;
    availableActions: string[];
}

const InventoryModal: React.FC<InventoryModalProps> = ({ inventory, currentWeight, maxWeight, isOpen, onClose, onEquip, onDrop, onConsume, onFill, availableActions = [] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-green-600 rounded-xl w-full max-w-md shadow-[0_0_30px_rgba(0,255,0,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-green-900/20 p-4 border-b border-green-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-green-400 flex items-center gap-2 uppercase tracking-wider">
                        <Package size={24} /> Storage Unit
                    </h3>
                    <button onClick={onClose} className="text-green-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 min-h-[300px] max-h-[60vh] overflow-y-auto bg-black/40">
                    {inventory && inventory.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3">
                            {inventory.map((item, idx: number) => {
                                const itemName = typeof item === 'string' ? item : item.name || 'Unknown Object';
                                const itemQty = typeof item === 'string' ? 1 : item.qty || 1;
                                const isEquippable = typeof item !== 'string' && (item.item_type === 'weapon' || item.item_type === 'armor');

                                return (
                                    <div key={idx} className="bg-green-900/10 border border-green-800/50 p-4 rounded-lg flex flex-col gap-3 hover:bg-green-900/20 transition-colors group">
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 shrink-0 bg-green-900/30 rounded flex items-center justify-center border border-green-700/50 group-hover:border-green-500">
                                                    <Package size={20} className="text-green-400" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-green-300 text-sm sm:text-base truncate">{itemName}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-green-600 uppercase tracking-widest truncate">Qty: {itemQty} {isEquippable && typeof item !== 'string' ? `| ${item.item_type}` : ''}</span>
                                                        {typeof item !== 'string' && item.is_light_source && (
                                                            <span className="text-[8px] bg-yellow-500/20 text-yellow-400 px-1 rounded border border-yellow-500/30 font-bold uppercase tracking-tighter shadow-[0_0_5px_rgba(234,179,8,0.4)]">
                                                                Light Source
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                                                {isEquippable && (
                                                    <button
                                                        onClick={() => onEquip(itemName)}
                                                        className="text-[10px] bg-green-700/30 hover:bg-green-600/50 px-2 py-1 rounded text-green-100 uppercase tracking-widest transition-colors font-bold border border-green-600/50"
                                                    >
                                                        Equip
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onDrop(itemName)}
                                                    className="text-[10px] bg-red-900/30 hover:bg-red-800/50 px-2 py-1 rounded text-red-200 uppercase tracking-widest transition-colors border border-red-800/50"
                                                >
                                                    Drop {itemQty > 1 ? '1' : ''}
                                                </button>
                                                {itemQty > 1 && (
                                                    <button
                                                        onClick={() => onDrop(`${itemName} ${itemQty}`)}
                                                        className="text-[10px] bg-red-800/50 hover:bg-red-600/70 px-2 py-1 rounded text-red-100 uppercase tracking-widest transition-colors border border-red-600/70 font-bold"
                                                    >
                                                        Drop All
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Second row for Consume / Fill */}
                                        <div className="flex justify-end mt-1 pt-2 border-t border-green-800/30 gap-2">
                                            {onConsume && availableActions.includes(`consume ${itemName}`) && (
                                                <button
                                                    onClick={() => onConsume(itemName)}
                                                    className="text-[10px] bg-yellow-900/40 hover:bg-yellow-600/60 px-4 py-1.5 rounded text-yellow-200 uppercase tracking-widest transition-colors font-bold border border-yellow-600/50 flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                                                >
                                                    <Package size={12} className="text-yellow-400" />
                                                    Consume
                                                </button>
                                            )}
                                            {onFill && availableActions.includes(`fill ${itemName}`) && (
                                                <button
                                                    onClick={() => onFill(itemName)}
                                                    className="text-[10px] bg-blue-900/40 hover:bg-blue-600/60 px-4 py-1.5 rounded text-blue-200 uppercase tracking-widest transition-colors font-bold border border-blue-600/50 flex items-center gap-1 shadow-[0_0_10px_rgba(37,99,235,0.1)]"
                                                >
                                                    <Activity size={12} className="text-blue-400" />
                                                    Fill
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-green-700 gap-4 mt-10">
                            <Package size={64} className="opacity-20" />
                            <p className="text-lg italic">Storage Unit Empty</p>
                        </div>
                    )}
                </div>

                <div className={`p-3 border-t text-[10px] text-center font-mono ${currentWeight >= maxWeight ? 'bg-red-900/20 border-red-900/50 text-red-500' : 'bg-green-900/10 border-green-900/50 text-green-600'}`}>
                    CAPACITY: {currentWeight.toFixed(1)} / {maxWeight.toFixed(1)} kg &bull; SECURE LINK ESTABLISHED
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;

