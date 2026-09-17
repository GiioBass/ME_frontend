import React, { useState } from 'react';
import { Hammer, Wrench, X, Check, AlertCircle, Package } from 'lucide-react';
import { type GameItem } from '../../api';

interface RecipeDef {
    name: string;
    result_item: string;
    result_qty: number;
    workstation: string;
    description: string;
    required_items: Record<string, number>;
}

const DEFAULT_RECIPES: RecipeDef[] = [
    {
        name: 'torch',
        result_item: 'Torch',
        result_qty: 1,
        workstation: 'none',
        description: 'A primitive flame stick providing light in dark caverns.',
        required_items: { 'Wood': 1, 'Cloth': 1 }
    },
    {
        name: 'wooden_spear',
        result_item: 'Wooden Spear',
        result_qty: 1,
        workstation: 'none',
        description: 'A carved pointed weapon for hunting and defense.',
        required_items: { 'Wood': 2, 'Flint': 1 }
    },
    {
        name: 'healing_salve',
        result_item: 'Healing Salve',
        result_qty: 1,
        workstation: 'campfire',
        description: 'Herbal mixture boiled over a campfire to patch wounds.',
        required_items: { 'Healing Herb': 2 }
    },
    {
        name: 'iron_dagger',
        result_item: 'Iron Dagger',
        result_qty: 1,
        workstation: 'forge',
        description: 'Forged iron blade with high attack velocity.',
        required_items: { 'Iron Ore': 2, 'Wood': 1 }
    },
    {
        name: 'mana_potion',
        result_item: 'Mana Potion',
        result_qty: 1,
        workstation: 'alchemy_lab',
        description: 'Distilled arcane elixir brewed in an alchemical laboratory.',
        required_items: { 'Mana Crystal': 1, 'Water Flask': 1 }
    }
];

interface CraftingModalProps {
    isOpen: boolean;
    onClose: () => void;
    playerInventory: GameItem[];
    availableActions?: string[];
    onCraft: (recipeName: string) => void;
}

export const CraftingModal: React.FC<CraftingModalProps> = ({
    isOpen,
    onClose,
    playerInventory = [],
    availableActions = [],
    onCraft
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    if (!isOpen) return null;

    // Build inventory counts
    const invCounts: Record<string, number> = {};
    playerInventory.forEach(item => {
        const name = item.name;
        invCounts[name] = (invCounts[name] || 0) + (item.qty || 1);
    });

    // Detect available workstations from actions or nearby
    const hasCampfire = availableActions.some(a => a.toLowerCase().includes('campfire') || a.toLowerCase().includes('camp')) || true;
    const hasForge = availableActions.some(a => a.toLowerCase().includes('forge'));
    const hasAlchemyLab = availableActions.some(a => a.toLowerCase().includes('alchemy'));

    const checkWorkstation = (reqStation: string) => {
        const req = reqStation.toLowerCase();
        if (req === 'none' || req === '') return true;
        if (req === 'campfire') return hasCampfire;
        if (req === 'forge') return hasForge;
        if (req === 'alchemy_lab' || req === 'alchemy') return hasAlchemyLab;
        return true;
    };

    const filteredRecipes = DEFAULT_RECIPES.filter(r => {
        if (selectedCategory === 'all') return true;
        return r.workstation === selectedCategory;
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-2xl rounded-2xl border-amber-600/40 shadow-[0_0_35px_rgba(217,119,6,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-amber-600/30 flex items-center justify-between bg-amber-950/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(217,119,6,0.4)]">
                            <Hammer size={20} className="text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                                Field Workshop & Crafting
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                                    Assembly
                                </span>
                            </h3>
                            <span className="text-[11px] text-slate-400">Combine raw materials into weapons, tools and elixirs</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex border-b border-white/10 bg-black/30 text-xs font-bold uppercase tracking-wider overflow-x-auto">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${selectedCategory === 'all' ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        <Package size={14} /> All Blueprints
                    </button>
                    <button
                        onClick={() => setSelectedCategory('none')}
                        className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${selectedCategory === 'none' ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        <Wrench size={14} /> Basic Field
                    </button>
                    <button
                        onClick={() => setSelectedCategory('campfire')}
                        className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${selectedCategory === 'campfire' ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        Campfire
                    </button>
                    <button
                        onClick={() => setSelectedCategory('forge')}
                        className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${selectedCategory === 'forge' ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        Forge
                    </button>
                    <button
                        onClick={() => setSelectedCategory('alchemy_lab')}
                        className={`px-4 py-2.5 transition-all border-b-2 flex items-center gap-1.5 ${selectedCategory === 'alchemy_lab' ? 'border-amber-400 text-amber-300 bg-amber-500/10' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                        Alchemy Lab
                    </button>
                </div>

                {/* Recipes List */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    {filteredRecipes.map((recipe, idx) => {
                        const hasStation = checkWorkstation(recipe.workstation);
                        const hasMats = Object.entries(recipe.required_items).every(
                            ([itemName, qty]) => (invCounts[itemName] || 0) >= qty
                        );
                        const canCraft = hasStation && hasMats;

                        return (
                            <div
                                key={idx}
                                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${canCraft ? 'bg-black/40 border-amber-500/40 hover:border-amber-400 shadow-sm' : 'bg-black/20 border-white/5 opacity-75'}`}
                            >
                                <div className="space-y-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-sm">{recipe.result_item}</span>
                                        {recipe.workstation !== 'none' && (
                                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                                                Req: {recipe.workstation.replace('_', ' ')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-400">{recipe.description}</p>
                                    
                                    {/* Material Requirements */}
                                    <div className="flex flex-wrap gap-2 pt-1.5">
                                        {Object.entries(recipe.required_items).map(([matName, reqQty], mIdx) => {
                                            const current = invCounts[matName] || 0;
                                            const satisfied = current >= reqQty;
                                            return (
                                                <span
                                                    key={mIdx}
                                                    className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 border font-mono ${satisfied ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40' : 'bg-red-950/40 text-red-300 border-red-800/40'}`}
                                                >
                                                    {satisfied ? <Check size={10} /> : <AlertCircle size={10} />}
                                                    {matName}: {current}/{reqQty}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onCraft(recipe.name)}
                                    disabled={!canCraft}
                                    className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shrink-0 flex items-center justify-center gap-1.5 ${canCraft ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                                >
                                    <Hammer size={14} />
                                    {canCraft ? 'Assemble' : !hasMats ? 'Missing Mats' : 'No Workstation'}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-400">
                    <span>Explore sectors to find Campfires, Anvils and Arcane Labs</span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors"
                    >
                        Close Workshop
                    </button>
                </div>

            </div>
        </div>
    );
};
