import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Users, Send, Radio, X, UserPlus, LogOut, Shield, MapPin, Check, AlertCircle, RefreshCw } from 'lucide-react';
import type { ChatMessage, PartyInfo, PartyInvite, OnlinePlayer } from '../../hooks/useMultiplayerSocket';

interface MultiplayerChatPanelProps {
    isOpen?: boolean;
    onToggleOpen?: (open: boolean) => void;
    isConnected: boolean;
    messages: ChatMessage[];
    party: PartyInfo | null;
    pendingInvite: PartyInvite | null;
    onlinePlayers: OnlinePlayer[];
    onSendParty: (text: string) => void;
    onSendShout: (text: string) => void;
    onSendWhisper: (target: string, text: string) => void;
    onCreateParty: () => void;
    onInviteToParty: (targetName: string) => void;
    onAcceptInvite: () => void;
    onDeclineInvite: () => void;
    onLeaveParty: () => void;
    onKickPartyMember: (targetId: string) => void;
    onRefreshOnline: () => void;
}

export const MultiplayerChatPanel: React.FC<MultiplayerChatPanelProps> = ({
    isOpen: controlledIsOpen,
    onToggleOpen,
    isConnected,
    messages,
    party,
    pendingInvite,
    onlinePlayers,
    onSendParty,
    onSendShout,
    onSendWhisper,
    onCreateParty,
    onInviteToParty,
    onAcceptInvite,
    onDeclineInvite,
    onLeaveParty,
    onKickPartyMember,
    onRefreshOnline
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const setIsOpen = (val: boolean) => {
        if (onToggleOpen) onToggleOpen(val);
        setInternalIsOpen(val);
    };
    const [activeTab, setActiveTab] = useState<'all' | 'party' | 'whisper' | 'group'>('all');
    const [inputText, setInputText] = useState('');
    const [whisperTarget, setWhisperTarget] = useState('');
    const [inviteInput, setInviteInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const filteredMessages = messages.filter(msg => {
        if (activeTab === 'all') return true;
        if (activeTab === 'party') return msg.channel === 'party' || msg.channel === 'system';
        if (activeTab === 'whisper') return msg.channel === 'whisper';
        return true;
    });

    useEffect(() => {
        if (isOpen && activeTab !== 'group') {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [filteredMessages, isOpen, activeTab]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const text = inputText.trim();

        // 1. Direct slash commands
        if (text.startsWith('/w ') || text.startsWith('/whisper ')) {
            const parts = text.split(' ');
            if (parts.length >= 3) {
                const target = parts[1];
                const msg = parts.slice(2).join(' ');
                onSendWhisper(target, msg);
            }
        } else if (text.startsWith('/p ') || text.startsWith('/party ')) {
            const msg = text.replace(/^\/(p|party)\s+/, '');
            onSendParty(msg);
        } else if (text.startsWith('/all ') || text.startsWith('/shout ') || text.startsWith('/g ')) {
            const msg = text.replace(/^\/(all|shout|g)\s+/, '');
            onSendShout(msg);
        } else if (text.startsWith('/invite ')) {
            const target = text.replace(/^\/invite\s+/, '').trim();
            if (target) onInviteToParty(target);
        } else if (activeTab === 'whisper' && whisperTarget) {
            onSendWhisper(whisperTarget, text);
        } else if (activeTab === 'party') {
            onSendParty(text);
        } else {
            // In 'all' tab, default is global shout to all players
            onSendShout(text);
        }

        setInputText('');
    };

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteInput.trim()) {
            onInviteToParty(inviteInput.trim());
            setInviteInput('');
        }
    };

    const partyMembersCount = party?.members.length || 0;

    return (
        <>
            {/* Desktop Toggle Button */}
            {!isOpen && (
                <div className="fixed bottom-4 right-4 z-40 hidden md:flex flex-col items-end">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/90 border border-stitch-cyan/40 hover:border-stitch-cyan text-stitch-cyan hover:text-white shadow-[0_0_20px_rgba(6,182,212,0.25)] backdrop-blur-md transition-all group cursor-pointer"
                    >
                        <div className="relative">
                            <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
                            <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500 animate-pulse'}`} />
                        </div>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                            Comms Net
                        </span>
                        {party && (
                            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                                <Shield size={10} />
                                <span>Party {partyMembersCount}/6</span>
                            </span>
                        )}
                        {pendingInvite && (
                            <span className="bg-amber-500/30 text-amber-300 text-[10px] font-mono px-1.5 py-0.5 rounded-full border border-amber-500/50 animate-pulse font-bold">
                                Party Invite!
                            </span>
                        )}
                    </button>
                </div>
            )}

            {/* Chat Box Container: Responsive for Mobile and Desktop */}
            {isOpen && (
                <div className="fixed inset-x-2 top-[max(env(safe-area-inset-top,32px),32px)] bottom-[76px] md:top-auto md:bottom-4 md:right-4 md:left-auto md:w-96 md:h-[26rem] z-50 flex flex-col rounded-2xl bg-slate-950/95 border border-stitch-cyan/40 shadow-[0_0_30px_rgba(6,182,212,0.3)] backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-black/60 border-b border-stitch-cyan/20">
                        <div className="flex items-center gap-2">
                            <Radio size={15} className="text-stitch-cyan animate-pulse" />
                            <span className="text-xs font-mono font-bold tracking-widest text-stitch-cyan uppercase">
                                Neural Comms
                            </span>
                            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Pending Invitation Alert Banner */}
                    {pendingInvite && (
                        <div className="bg-amber-950/70 border-b border-amber-500/40 p-2 flex items-center justify-between gap-2 text-xs font-mono">
                            <div className="flex items-center gap-1.5 text-amber-200 text-[11px] truncate">
                                <AlertCircle size={13} className="text-amber-400 shrink-0 animate-pulse" />
                                <span className="truncate">
                                    <strong className="text-white">{pendingInvite.from_player_name}</strong> invited you to Party!
                                </span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    onClick={onAcceptInvite}
                                    className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-0.5"
                                    title="Accept Invitation"
                                >
                                    <Check size={10} />
                                    <span>Accept</span>
                                </button>
                                <button
                                    onClick={onDeclineInvite}
                                    className="px-2 py-0.5 rounded bg-rose-950 hover:bg-rose-900 border border-rose-700/50 text-rose-300 text-[10px] transition-colors cursor-pointer"
                                    title="Decline"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Navigation Tabs */}
                    <div className="flex bg-black/40 border-b border-white/10 p-1 gap-1 text-[11px] font-mono">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 py-1 px-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-[0_0_8px_rgba(245,158,11,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                            title="Global Chat to All Players"
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveTab('party')}
                            className={`flex-1 py-1 px-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1 ${activeTab === 'party' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-[0_0_8px_rgba(52,211,153,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                            title="Party Group Chat across all dungeons"
                        >
                            <Shield size={11} />
                            <span>Party</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('whisper')}
                            className={`flex-1 py-1 px-1.5 rounded-md transition-all cursor-pointer ${activeTab === 'whisper' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-[0_0_8px_rgba(168,85,247,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                            title="Private Direct Messages"
                        >
                            Whisper
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('group');
                                onRefreshOnline();
                            }}
                            className={`flex items-center justify-center gap-1 py-1 px-2 rounded-md transition-all cursor-pointer relative ${activeTab === 'group' ? 'bg-stitch-cyan/20 text-stitch-cyan border border-stitch-cyan/40 font-bold shadow-[0_0_8px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                            title="Party Members & Group Management"
                        >
                            <Users size={12} />
                            <span>Group</span>
                            {pendingInvite && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
                            )}
                        </button>
                    </div>

                    {/* Content Body: Group / Party Management Tab */}
                    {activeTab === 'group' ? (
                        <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-xs">
                            {/* Party Status Section */}
                            {party ? (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1.5">
                                        <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                                            <Shield size={14} className="text-emerald-400" />
                                            <span>Active Party ({party.members.length}/6)</span>
                                        </div>
                                        <button
                                            onClick={onLeaveParty}
                                            className="px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-600/40 text-rose-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                                            title="Leave current party"
                                        >
                                            <LogOut size={10} />
                                            <span>Leave</span>
                                        </button>
                                    </div>

                                    {/* Members list */}
                                    <div className="space-y-1.5">
                                        {party.members.map(member => (
                                            <div
                                                key={member.id}
                                                className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/10 hover:border-emerald-500/30 transition-all"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-bold">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold flex items-center gap-1">
                                                            <span>{member.name}</span>
                                                            {member.is_leader && (
                                                                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/30">
                                                                    LEADER
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 flex items-center gap-2 capitalize">
                                                            <span>{member.character_class}</span>
                                                            <span className="text-slate-500 flex items-center gap-0.5">
                                                                <MapPin size={9} />
                                                                {member.location_id.replace('loc_', 'Sector ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            setWhisperTarget(member.name);
                                                            setActiveTab('whisper');
                                                        }}
                                                        className="px-2 py-1 text-[10px] rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 transition-colors cursor-pointer"
                                                    >
                                                        Whisper
                                                    </button>
                                                    {party.leader_id !== member.id && (
                                                        <button
                                                            onClick={() => onKickPartyMember(member.id)}
                                                            className="p-1 text-[10px] rounded bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 transition-colors cursor-pointer"
                                                            title="Remove member"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Invite More Members Input */}
                                    {party.members.length < 6 && (
                                        <form onSubmit={handleInviteSubmit} className="pt-2 flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={inviteInput}
                                                onChange={(e) => setInviteInput(e.target.value)}
                                                placeholder="Invite player by name..."
                                                className="flex-1 bg-black/60 border border-white/20 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                                            />
                                            <button
                                                type="submit"
                                                className="px-2.5 py-1 rounded bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                                            >
                                                <UserPlus size={12} />
                                                <span>Invite</span>
                                            </button>
                                        </form>
                                    )}
                                </div>
                            ) : (
                                /* Not in a party view */
                                <div className="space-y-3">
                                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center space-y-2">
                                        <Shield size={24} className="mx-auto text-slate-500" />
                                        <div className="text-white font-bold text-xs">No Active Party</div>
                                        <p className="text-[11px] text-slate-400">
                                            Form a party to communicate across dungeon floors and coordinates in real time.
                                        </p>
                                        <button
                                            onClick={onCreateParty}
                                            className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer flex items-center justify-center gap-1.5"
                                        >
                                            <Shield size={13} />
                                            <span>Create New Party</span>
                                        </button>
                                    </div>

                                    {/* Direct Invite form */}
                                    <form onSubmit={handleInviteSubmit} className="space-y-1">
                                        <div className="text-[10px] uppercase text-slate-400 font-bold">Quick Invite to Group</div>
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={inviteInput}
                                                onChange={(e) => setInviteInput(e.target.value)}
                                                placeholder="Player name to invite..."
                                                className="flex-1 bg-black/60 border border-white/20 rounded px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                                            />
                                            <button
                                                type="submit"
                                                className="px-2.5 py-1 rounded bg-stitch-cyan/20 border border-stitch-cyan/40 text-stitch-cyan hover:bg-stitch-cyan hover:text-black transition-all text-xs flex items-center gap-1 cursor-pointer font-bold"
                                            >
                                                <UserPlus size={12} />
                                                <span>Invite</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Online Adventurers Directory */}
                            <div className="pt-2 border-t border-white/10 space-y-2">
                                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-stitch-cyan/80">
                                    <span>Online Adventurers ({onlinePlayers.length})</span>
                                    <button
                                        onClick={onRefreshOnline}
                                        className="hover:text-white transition-colors cursor-pointer"
                                        title="Refresh player list"
                                    >
                                        <RefreshCw size={11} />
                                    </button>
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {onlinePlayers.length === 0 ? (
                                        <div className="text-slate-500 text-center py-2 text-[10px] italic">
                                            Scanning for other operators...
                                        </div>
                                    ) : (
                                        onlinePlayers.map(p => (
                                            <div
                                                key={p.id}
                                                className="flex items-center justify-between p-1.5 rounded bg-black/30 border border-white/5 text-[11px]"
                                            >
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                                    <span className="text-slate-200 font-bold truncate">{p.name}</span>
                                                    <span className="text-slate-500 text-[10px] capitalize shrink-0">({p.character_class})</span>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => onInviteToParty(p.name)}
                                                        className="px-1.5 py-0.5 text-[9px] rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 transition-colors cursor-pointer"
                                                    >
                                                        Invite
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setWhisperTarget(p.name);
                                                            setActiveTab('whisper');
                                                        }}
                                                        className="px-1.5 py-0.5 text-[9px] rounded bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:bg-purple-900 transition-colors cursor-pointer"
                                                    >
                                                        Whisper
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Chat Messages Stream */
                        <div className="flex-1 p-3 overflow-y-auto space-y-2 font-mono text-xs select-text">
                            {filteredMessages.length === 0 ? (
                                <div className="text-slate-500 text-center py-12 italic text-[11px]">
                                    {activeTab === 'party' && !party ? (
                                        <div className="space-y-2">
                                            <div>You are not currently in a party.</div>
                                            <button
                                                onClick={() => setActiveTab('group')}
                                                className="px-3 py-1 rounded bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-xs inline-block cursor-pointer"
                                            >
                                                Go to Group Tab
                                            </button>
                                        </div>
                                    ) : (
                                        'Channel quiet. Transmit a signal to begin.'
                                    )}
                                </div>
                            ) : (
                                filteredMessages.map(msg => {
                                    let badgeColor = 'text-stitch-cyan bg-stitch-cyan/10 border-stitch-cyan/30';
                                    let badgeText = 'CHAT';
                                    let textColor = 'text-slate-200';

                                    if (msg.channel === 'global') {
                                        badgeColor = 'text-amber-400 bg-amber-950/30 border-amber-500/30';
                                        badgeText = 'ALL';
                                        textColor = 'text-amber-100';
                                    } else if (msg.channel === 'party') {
                                        badgeColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40';
                                        badgeText = 'PARTY';
                                        textColor = 'text-emerald-100';
                                    } else if (msg.channel === 'whisper') {
                                        badgeColor = 'text-purple-400 bg-purple-950/30 border-purple-500/30';
                                        badgeText = 'WHISPER';
                                        textColor = 'text-purple-200';
                                    } else if (msg.channel === 'system') {
                                        badgeColor = 'text-slate-400 bg-slate-900 border-slate-700';
                                        badgeText = 'SYS';
                                        textColor = 'text-slate-400 italic';
                                    }

                                    return (
                                        <div key={msg.id} className="flex flex-col gap-0.5 leading-relaxed">
                                            <div className="flex items-center gap-1.5 text-[10px]">
                                                <span className={`px-1 rounded border text-[9px] uppercase tracking-wider font-bold ${badgeColor}`}>
                                                    {badgeText}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        if (msg.sender_name && msg.sender_name !== 'You' && msg.sender_name !== 'PARTY' && msg.sender_name !== 'SYSTEM' && !msg.sender_name.startsWith('To ')) {
                                                            setWhisperTarget(msg.sender_name);
                                                            setActiveTab('whisper');
                                                        }
                                                    }}
                                                    className="font-bold text-white hover:underline hover:text-stitch-cyan cursor-pointer transition-colors"
                                                >
                                                    {msg.sender_name}
                                                </button>
                                                <span className="text-slate-600 text-[9px] ml-auto">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className={`pl-1 ${textColor}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Input Footer */}
                    {activeTab !== 'group' && (
                        <div className="p-2 bg-black/80 border-t border-white/10 flex flex-col gap-1.5">
                            {activeTab === 'whisper' && (
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-[10px] font-mono text-purple-400 uppercase">Target:</span>
                                    <input
                                        type="text"
                                        value={whisperTarget}
                                        onChange={(e) => setWhisperTarget(e.target.value)}
                                        placeholder="Player callsign..."
                                        className="flex-1 bg-black/60 border border-purple-500/40 rounded px-2 py-0.5 text-xs text-purple-200 focus:outline-none focus:border-purple-400"
                                    />
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                                    placeholder={
                                        activeTab === 'all' ? "Broadcast to ALL players... (/w, /p, /invite)" :
                                        activeTab === 'party' ? (party ? "Send message to Party..." : "Create or join a party in Group tab...") :
                                        `Whisper to ${whisperTarget || 'player'}...`
                                    }
                                    disabled={activeTab === 'party' && !party}
                                    className="flex-1 bg-black/60 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-stitch-cyan disabled:opacity-50 transition-colors"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={activeTab === 'party' && !party}
                                    className="p-1.5 rounded-lg bg-stitch-cyan/20 border border-stitch-cyan/50 text-stitch-cyan hover:bg-stitch-cyan/30 hover:text-white disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] cursor-pointer"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
