import React from 'react';
import { MessageSquare, X, ArrowRight, User } from 'lucide-react';
import { type ActiveDialogue } from '../../api';

interface DialogueModalProps {
    dialogue: ActiveDialogue | null;
    isOpen: boolean;
    onClose: () => void;
    onChoice: (choice: string) => void;
    availableActions?: string[];
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
    dialogue,
    isOpen,
    onClose,
    onChoice,
    availableActions = []
}) => {
    if (!isOpen || !dialogue) return null;

    // Detect numeric dialogue choices from available actions (e.g. "dialogue 1", "dialogue 2")
    const dialogueActions = availableActions.filter(act => act.startsWith('dialogue '));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="glass-panel w-full max-w-lg rounded-2xl border-stitch-cyan/50 shadow-[0_0_30px_rgba(6,182,212,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="p-4 border-b border-stitch-cyan/30 flex items-center justify-between bg-cyan-950/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-stitch-cyan/20 border border-stitch-cyan/40 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                            <User size={20} className="text-stitch-cyan" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                                {dialogue.npc_name}
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stitch-cyan/20 text-stitch-cyan border border-stitch-cyan/40">
                                    Dialogue Link
                                </span>
                            </h3>
                            <span className="text-[11px] text-slate-400 font-mono">Node: {dialogue.node_id}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content / Narrative Body */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    <div className="bg-black/40 p-4 rounded-xl border border-white/10 text-slate-200 leading-relaxed font-serif text-sm italic">
                        "{dialogue.text || "The figure observes you attentively..."}"
                    </div>

                    {/* Dialogue Choices */}
                    <div className="space-y-2.5">
                        <div className="text-[11px] font-bold uppercase tracking-widest text-stitch-cyan flex items-center gap-1.5">
                            <MessageSquare size={14} /> Available Responses
                        </div>

                        {dialogue.options && dialogue.options.length > 0 ? (
                            dialogue.options.map((opt, idx) => (
                                <button
                                    key={opt.id || idx}
                                    onClick={() => onChoice(opt.id || String(idx + 1))}
                                    className="w-full text-left p-3 rounded-xl bg-stitch-cyan/10 hover:bg-stitch-cyan/20 text-stitch-cyan hover:text-white border border-stitch-cyan/30 hover:border-stitch-cyan transition-all flex items-center justify-between group shadow-sm"
                                >
                                    <span className="text-xs font-medium tracking-wide">
                                        <span className="font-mono font-bold mr-2 text-stitch-lightBlue">[{idx + 1}]</span>
                                        {opt.text}
                                    </span>
                                    <ArrowRight size={16} className="text-stitch-cyan group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))
                        ) : dialogueActions.length > 0 ? (
                            dialogueActions.map((act) => {
                                const choiceNum = act.replace('dialogue ', '');
                                return (
                                    <button
                                        key={act}
                                        onClick={() => onChoice(choiceNum)}
                                        className="w-full text-left p-3 rounded-xl bg-stitch-cyan/10 hover:bg-stitch-cyan/20 text-stitch-cyan hover:text-white border border-stitch-cyan/30 hover:border-stitch-cyan transition-all flex items-center justify-between group"
                                    >
                                        <span className="text-xs font-mono font-bold tracking-wide">
                                            [Option {choiceNum}] Select choice {choiceNum}
                                        </span>
                                        <ArrowRight size={16} className="text-stitch-cyan group-hover:translate-x-1 transition-transform" />
                                    </button>
                                );
                            })
                        ) : (
                            <div className="text-xs text-slate-400 italic bg-white/5 p-3 rounded-lg text-center">
                                Conversation completed.
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                        End Conversation
                    </button>
                </div>

            </div>
        </div>
    );
};
