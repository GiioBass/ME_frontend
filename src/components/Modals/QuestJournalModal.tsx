import React, { useState, useEffect } from 'react';
import { Scroll, CheckCircle2, Award, Coins, X, Target, Sparkles, Package } from 'lucide-react';
import { type Quest } from '../../api';

interface QuestJournalModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeQuests?: Record<string, Quest> | Quest[];
    completedQuests?: string[];
    onTurnIn: (questId: string) => void;
}

const KNOWN_QUEST_NAMES: Record<string, string> = {
    the_awakening: 'The Awakening (Tutorial)',
    first_darkness: 'The First Darkness',
    worried_farmer: 'The Worried Farmer',
};

export const QuestJournalModal: React.FC<QuestJournalModalProps> = ({
    isOpen,
    onClose,
    activeQuests = {},
    completedQuests = [],
    onTurnIn
}) => {
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const activeList: Quest[] = Array.isArray(activeQuests)
        ? activeQuests
        : Object.values(activeQuests || {});

    const getQuestDisplayName = (questId: string) => {
        if (KNOWN_QUEST_NAMES[questId]) return KNOWN_QUEST_NAMES[questId];
        return questId
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="glass-panel w-full max-w-2xl rounded-2xl border border-fuchsia-500/30 shadow-[0_0_35px_rgba(217,70,239,0.25)] overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-fuchsia-500/30 flex items-center justify-between bg-fuchsia-950/40">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(217,70,239,0.4)]">
                            <Scroll size={20} className="text-fuchsia-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                                Quest Journal
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 font-bold">
                                    Chronicles
                                </span>
                            </h3>
                            <span className="text-[11px] text-slate-400">Expeditions, Bounties & Tasks</span>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                        title="Close (Esc)"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-black/30">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                            activeTab === 'active'
                                ? 'border-fuchsia-500 text-fuchsia-300 bg-fuchsia-500/10'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Target size={14} /> Active Tasks ({activeList.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
                            activeTab === 'completed'
                                ? 'border-fuchsia-500 text-fuchsia-300 bg-fuchsia-500/10'
                                : 'border-transparent text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <CheckCircle2 size={14} /> Completed Records ({completedQuests.length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                    {activeTab === 'active' ? (
                        activeList.length > 0 ? (
                            activeList.map((quest) => {
                                const objectives = quest.objectives || [];
                                const isReady =
                                    objectives.length > 0 &&
                                    objectives.every(
                                        (obj) => (obj.current_count ?? 0) >= (obj.required_count ?? 1)
                                    );

                                const xpReward = quest.reward?.xp ?? quest.reward_xp ?? 0;
                                const goldReward = quest.reward?.gold ?? quest.reward_gold ?? 0;
                                const itemsReward = quest.reward?.items ?? quest.reward_items ?? [];

                                return (
                                    <div
                                        key={quest.id}
                                        className={`p-4 rounded-xl border transition-all flex flex-col gap-3 ${
                                            isReady
                                                ? 'bg-fuchsia-950/30 border-fuchsia-500/60 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                                                : 'bg-black/40 border-white/10'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-sm">{quest.title}</span>
                                                    {isReady ? (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                                                            <Sparkles size={10} /> Ready to Claim
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-400">
                                                            In Progress
                                                        </span>
                                                    )}
                                                    {quest.is_main_quest && (
                                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                                                            Main Quest
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-300 mt-1 leading-relaxed font-serif italic">
                                                    "{quest.description}"
                                                </p>
                                            </div>

                                            {isReady && (
                                                <button
                                                    onClick={() => onTurnIn(quest.id)}
                                                    className="px-4 py-2 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)] shrink-0 active:scale-95 cursor-pointer"
                                                >
                                                    Claim Rewards
                                                </button>
                                            )}
                                        </div>

                                        {/* Objectives */}
                                        {objectives.length > 0 && (
                                            <div className="space-y-1.5 pt-2 border-t border-white/5">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                    Objectives:
                                                </span>
                                                {objectives.map((obj, oIdx) => {
                                                    const current = obj.current_count ?? 0;
                                                    const required = obj.required_count ?? 1;
                                                    const done = current >= required;
                                                    const percent = Math.min(100, Math.round((current / Math.max(1, required)) * 100));
                                                    const rawType = obj.objective_type || obj.type || 'TASK';
                                                    const objType = String(rawType).toUpperCase();

                                                    return (
                                                        <div
                                                            key={obj.id || oIdx}
                                                            className="bg-black/30 p-2.5 rounded-lg border border-white/5 flex flex-col gap-1.5"
                                                        >
                                                            <div className="flex justify-between items-center text-xs">
                                                                <span className={done ? 'text-emerald-300 line-through' : 'text-slate-200'}>
                                                                    <span className="text-[10px] font-mono font-bold text-fuchsia-300/80 mr-1.5">
                                                                        [{objType}]
                                                                    </span>
                                                                    {obj.description || `${obj.target}`}
                                                                </span>
                                                                <span className="font-mono font-bold text-cyan-300 text-[11px]">
                                                                    {current} / {required}
                                                                </span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-500 ${
                                                                        done ? 'bg-emerald-500' : 'bg-fuchsia-500'
                                                                    }`}
                                                                    style={{ width: `${percent}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Rewards Preview */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-t border-white/5 font-mono text-slate-400">
                                            <span className="text-[10px] uppercase font-bold text-slate-500">Rewards:</span>
                                            {xpReward > 0 && (
                                                <span className="flex items-center gap-1 text-cyan-300 font-bold">
                                                    <Award size={14} /> +{xpReward} XP
                                                </span>
                                            )}
                                            {goldReward > 0 && (
                                                <span className="flex items-center gap-1 text-amber-400 font-bold">
                                                    <Coins size={14} /> +{goldReward} Gold
                                                </span>
                                            )}
                                            {itemsReward.map((it, idx) => (
                                                <span key={idx} className="flex items-center gap-1 text-emerald-300 font-bold">
                                                    <Package size={14} />{' '}
                                                    {typeof it === 'string'
                                                        ? it
                                                        : `${it.name}${it.qty && it.qty > 1 ? ` x${it.qty}` : ''}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-14 text-slate-500">
                                <Scroll size={40} className="opacity-30 mb-2" />
                                <p className="text-xs italic">No active quests. Speak to citizens in the Village or Guild to accept missions.</p>
                            </div>
                        )
                    ) : (
                        completedQuests.length > 0 ? (
                            completedQuests.map((questId, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 rounded-xl bg-black/40 border border-emerald-900/40 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2 size={18} className="text-emerald-400" />
                                        <span className="text-sm font-bold text-slate-200">
                                            {getQuestDisplayName(questId)}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 uppercase font-bold">
                                        Completed
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-14 text-slate-500">
                                <CheckCircle2 size={40} className="opacity-30 mb-2" />
                                <p className="text-xs italic">No completed quests recorded yet.</p>
                            </div>
                        )
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    >
                        Close Journal
                    </button>
                </div>
            </div>
        </div>
    );
};
