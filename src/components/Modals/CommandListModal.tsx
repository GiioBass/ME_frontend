import React, { useEffect, useState } from 'react';
import { X, Search, Terminal as TerminalIcon, Move, Zap, Package, Info } from 'lucide-react';
import { getCommands, type CommandHelp } from '../../api';

interface CommandListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
    switch (category.toLowerCase()) {
        case 'movement': return <Move size={18} className="text-blue-400" />;
        case 'interaction': return <Zap size={18} className="text-yellow-400" />;
        case 'advanced': return <Package size={18} className="text-purple-400" />;
        default: return <Info size={18} className="text-emerald-400" />;
    }
};

export const CommandListModal: React.FC<CommandListModalProps> = ({ isOpen, onClose }) => {
    const [commands, setCommands] = useState<CommandHelp[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            const fetchCommands = async () => {
                try {
                    const data = await getCommands();
                    setCommands(data);
                } catch (error) {
                    console.error("Failed to fetch commands", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCommands();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredCommands = commands.filter(cmd =>
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['movement', 'general', 'interaction', 'advanced'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <TerminalIcon size={20} className="text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Command Protocol Guide</h2>
                            <p className="text-xs text-slate-400">Available neural-link interface commands</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Filter commands..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {categories.map(category => {
                                const catCmds = filteredCommands.filter(c => c.category === category);
                                if (catCmds.length === 0) return null;

                                return (
                                    <div key={category} className="space-y-3">
                                        <div className="flex items-center gap-2 px-1">
                                            <CategoryIcon category={category} />
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">{category}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {catCmds.map(cmd => (
                                                <div key={cmd.command} className="group bg-slate-800/30 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 p-3 rounded-lg transition-all duration-200">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <code className="text-emerald-400 font-mono font-bold text-base leading-none">
                                                            {cmd.usage}
                                                        </code>
                                                        {cmd.alias && (
                                                            <span className="text-[10px] bg-slate-700/50 text-slate-300 px-1.5 py-0.5 rounded uppercase font-bold border border-slate-600/50">
                                                                Alias: {cmd.alias}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                                        {cmd.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredCommands.length === 0 && (
                                <div className="text-center py-10">
                                    <p className="text-slate-500 italic">No matching protocols discovered.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-slate-800/30 border-t border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Interface System v1.4.2 // Secure Terminal Access
                    </p>
                </div>
            </div>
        </div>
    );
};
