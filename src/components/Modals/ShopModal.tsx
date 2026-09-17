import React, { useState } from 'react';
import { ShoppingBag, Coins, X, Shield, Sword, Package, ArrowUpRight } from 'lucide-react';
import { type GameItem } from '../../api';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    playerGold: number;
    playerInventory: GameItem[];
    onBuy: (itemName: string) => void;
    onSell: (itemName: string) => void;
    merchantName?: string;
}

interface ShopItem {
    name: string;
    price: number;
    description?: string;
    type?: string;
    bonus?: number;
    stat?: string;
}

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
    { name: 'Health Potion', price: 25, description: 'Restores 40 HP instantly.', type: 'Consumable' },
    { name: 'Mana Potion', price: 20, description: 'Restores 30 MP.', type: 'Consumable' },
    { name: 'Iron Dagger', price: 50, description: 'Lightweight blade with swift piercing damage.', type: 'Weapon', bonus: 6, stat: 'ATK' },
    { name: 'Leather Armor', price: 80, description: 'Toughened hide tunic granting physical defense.', type: 'Armor', bonus: 5, stat: 'DEF' },
    { name: 'Torch', price: 15, description: 'Illuminates dark caverns and deep dungeon sectors.', type: 'Tool' },
    { name: 'Rations', price: 10, description: 'Nutritious trail food restoring 50 hunger.', type: 'Food' },
    { name: 'Water Flask', price: 15, description: 'Container holding fresh water to quench thirst.', type: 'Utility' }
];

export const ShopModal: React.FC<ShopModalProps> = ({
    isOpen,
    onClose,
    playerGold,
    playerInventory,
    onBuy,
    onSell,
    merchantName = 'Merchant Silas'
}) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

    if (!isOpen) return null;

    // Filter sellable inventory items
    const sellableItems = (playerInventory || []).filter(item => {
        const name = item.name.toLowerCase();
        return name !== 'fists' && name !== 'cloth tunic';
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-2xl rounded-2xl border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-amber-500/30 flex items-center justify-between bg-amber-950/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                            <ShoppingBag size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                                {merchantName}
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                                    Market Outpost
                                </span>
                            </h3>
                            <span className="text-[11px] text-slate-400">Trading & Provisions Exchange</span>
                        </div>
                    </div>

                    {/* Gold Balance Header */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-inner">
                            <Coins size={16} className="text-amber-400 animate-bounce" />
                            <span className="font-mono font-bold text-amber-300 text-sm">{playerGold} <span className="text-[10px] text-amber-500 font-sans">GOLD</span></span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-black/30">
                    <button
                        onClick={() => setActiveTab('buy')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === 'buy' ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        <ShoppingBag size={14} /> Buy Supplies ({DEFAULT_SHOP_ITEMS.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('sell')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 ${activeTab === 'sell' ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        <Coins size={14} /> Sell Loot ({sellableItems.length})
                    </button>
                </div>

                {/* Content List */}
                <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
                    {activeTab === 'buy' ? (
                        DEFAULT_SHOP_ITEMS.map((item, idx) => {
                            const canAfford = playerGold >= item.price;
                            return (
                                <div
                                    key={idx}
                                    className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                                            {item.type === 'Weapon' ? <Sword size={16} /> : item.type === 'Armor' ? <Shield size={16} /> : <Package size={16} />}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-white text-xs sm:text-sm truncate">{item.name}</span>
                                                {item.bonus && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                                        +{item.bonus} {item.stat}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right">
                                            <span className="font-mono font-bold text-amber-400 text-sm">{item.price}</span>
                                            <span className="text-[9px] text-amber-500/80 block uppercase">Gold</span>
                                        </div>
                                        <button
                                            onClick={() => onBuy(item.name)}
                                            disabled={!canAfford}
                                            className={`px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1 ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                                        >
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        sellableItems.length > 0 ? (
                            sellableItems.map((item, idx) => {
                                // Default sell value estimate (half base or fixed)
                                const sellPrice = Math.max(5, Math.floor((item.value || (item.damage ? 25 : item.shield ? 30 : 10))));
                                return (
                                    <div
                                        key={idx}
                                        className="p-3.5 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4 group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                                                <Package size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-xs sm:text-sm truncate">{item.name}</span>
                                                    {item.qty && item.qty > 1 && (
                                                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                                                            x{item.qty}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400 truncate">{item.description || 'Inventory item'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0">
                                            <div className="text-right">
                                                <span className="font-mono font-bold text-emerald-400 text-sm">+{sellPrice}</span>
                                                <span className="text-[9px] text-emerald-500/80 block uppercase">Gold</span>
                                            </div>
                                            <button
                                                onClick={() => onSell(item.name)}
                                                className="px-3.5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center gap-1"
                                            >
                                                Sell <ArrowUpRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <Package size={40} className="opacity-30 mb-2" />
                                <p className="text-xs italic">No items available to sell.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Prices fixed by the Merchant Guild</span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors"
                    >
                        Close Market
                    </button>
                </div>

            </div>
        </div>
    );
};
