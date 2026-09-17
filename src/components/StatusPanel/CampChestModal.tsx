import React from 'react';
import { Package, X, ArrowLeftRight, Sword, Shield } from 'lucide-react';
import { type GameItem } from '../../api';

interface CampChestModalProps {
    isOpen: boolean;
    onClose: () => void;
    inventory: GameItem[];
    chest: GameItem[];
    currentWeight: number;
    maxWeight: number;
    onStore: (itemName: string) => void;
    onRetrieve: (itemName: string) => void;
}

const CampChestModal: React.FC<CampChestModalProps> = ({ isOpen, onClose, inventory, chest, currentWeight, maxWeight, onStore, onRetrieve }) => {
    if (!isOpen) return null;

    const isOverloaded = currentWeight > maxWeight;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-green-600 rounded-xl w-full max-w-4xl shadow-[0_0_30px_rgba(34,197,94,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-green-900/20 p-4 border-b border-green-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-green-400 flex items-center gap-2 uppercase tracking-wider">
                        <Package size={24} /> Camp Storage
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 bg-black rounded font-mono text-sm border ${isOverloaded ? 'border-red-500/50 text-red-400' : 'border-green-500/30 text-green-400'}`}>
                            WEIGHT: {currentWeight.toFixed(1)} / {maxWeight.toFixed(1)}
                        </div>
                        <button onClick={onClose} className="text-green-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row h-[60vh] md:h-[500px] overflow-hidden">
                    {/* INVENTORY SIDE */}
                    <div className="flex-1 bg-black/40 border-r border-green-900/50 flex flex-col items-center p-4 overflow-y-auto">
                        <h4 className="text-green-500 font-bold mb-4 uppercase tracking-widest text-sm border-b border-green-900 w-full pb-2 text-center">Your Backpack</h4>
                        {inventory.length > 0 ? (
                            <div className="grid grid-cols-1 w-full gap-2">
                                {inventory.map((item, idx) => (
                                    <div key={idx} className="bg-green-900/10 border border-green-800/30 p-3 rounded flex items-center justify-between group">
                                        <div className="flex flex-col text-left">
                                            <span className="text-green-100 font-bold text-sm truncate">{item.name}</span>
                                            <div className="flex flex-col items-start gap-1 mt-0.5">
                                                <span className="text-[10px] text-green-600 uppercase">TYPE: {item.item_type || 'UNKNOWN'} | QTY: {item.qty || 1}</span>
                                                {(item.damage || item.shield) ? (
                                                    <div className="flex items-center gap-2">
                                                        {item.damage !== undefined && item.damage > 0 && (
                                                            <span className="flex items-center gap-1 text-[10px] bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-bold tracking-wider">
                                                                <Sword size={10} /> {item.damage}
                                                            </span>
                                                        )}
                                                        {item.shield !== undefined && item.shield > 0 && (
                                                            <span className="flex items-center gap-1 text-[10px] bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold tracking-wider">
                                                                <Shield size={10} /> {item.shield}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onStore(item.name)}
                                            className="bg-green-800/40 text-green-100 px-3 py-1 rounded text-xs uppercase font-bold tracking-widest hover:bg-green-600 transition-colors flex items-center gap-2 border border-green-600/50"
                                        >
                                            Store <ArrowLeftRight size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="m-auto text-green-800/50 italic text-sm text-center">Backpack is empty...</div>
                        )}
                    </div>

                    {/* CHEST SIDE */}
                    <div className="flex-1 bg-black/60 flex flex-col items-center p-4 overflow-y-auto">
                        <h4 className="text-green-500 font-bold mb-4 uppercase tracking-widest text-sm border-b border-green-900 w-full pb-2 text-center">Camp Chest</h4>
                        {chest && chest.length > 0 ? (
                            <div className="grid grid-cols-1 w-full gap-2">
                                {chest.map((item, idx) => (
                                    <div key={idx} className="bg-green-900/10 border border-green-800/30 p-3 rounded flex items-center justify-between group">
                                        <div className="flex flex-col text-left">
                                            <span className="text-green-100 font-bold text-sm truncate">{item.name}</span>
                                            <div className="flex flex-col items-start gap-1 mt-0.5">
                                                <span className="text-[10px] text-green-600 uppercase">TYPE: {item.item_type || 'UNKNOWN'} | QTY: {item.qty || 1}</span>
                                                {(item.damage || item.shield) ? (
                                                    <div className="flex items-center gap-2">
                                                        {item.damage !== undefined && item.damage > 0 && (
                                                            <span className="flex items-center gap-1 text-[10px] bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30 font-bold tracking-wider">
                                                                <Sword size={10} /> {item.damage}
                                                            </span>
                                                        )}
                                                        {item.shield !== undefined && item.shield > 0 && (
                                                            <span className="flex items-center gap-1 text-[10px] bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 font-bold tracking-wider">
                                                                <Shield size={10} /> {item.shield}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRetrieve(item.name)}
                                            className="bg-blue-800/40 text-blue-100 px-3 py-1 rounded text-xs uppercase font-bold tracking-widest hover:bg-blue-600 transition-colors flex items-center gap-2 border border-blue-600/50"
                                        >
                                            <ArrowLeftRight size={12} /> Take
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="m-auto text-green-800/50 italic text-sm text-center">Storage chest is empty...</div>
                        )}
                    </div>
                </div>

                <div className="bg-green-900/20 p-2 text-center text-[10px] text-green-500 font-mono border-t border-green-900">
                    ITEMS ARE SAVED PERSISTENTLY AT THIS EXACT COORDINATE
                </div>
            </div>
        </div>
    );
};

export default CampChestModal;
