import React, { useState } from 'react';
import { Package, X } from 'lucide-react';

interface InventoryModalProps {
    inventory: any[];
    isOpen: boolean;
    onClose: () => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ inventory, isOpen, onClose }) => {
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
                            {inventory.map((item: any, idx: number) => (
                                <div key={idx} className="bg-green-900/10 border border-green-800/50 p-4 rounded-lg flex items-center justify-between hover:bg-green-900/20 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-900/30 rounded flex items-center justify-center border border-green-700/50 group-hover:border-green-500">
                                            <Package size={20} className="text-green-400" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-green-300 text-lg">{typeof item === 'string' ? item : item.name || 'Unknown Object'}</span>
                                            <span className="text-[10px] text-green-600 uppercase tracking-widest">Standard Item</span>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-green-900/50 px-2 py-1 rounded text-green-200 opacity-0 group-hover:opacity-100 transition-opacity">INSPECT</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-green-700 gap-4 mt-10">
                            <Package size={64} className="opacity-20" />
                            <p className="text-lg italic">Storage Unit Empty</p>
                        </div>
                    )}
                </div>

                <div className="bg-green-900/10 p-3 border-t border-green-900/50 text-[10px] text-center text-green-600 font-mono">
                    CAPACITY: UNLIMITED &bull; SECURE LINK ESTABLISHED
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;
