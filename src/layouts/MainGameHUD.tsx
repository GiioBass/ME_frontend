import React, { useState } from 'react';
import {
    TerminalSquare,
    Activity,
    Map,
    Radio,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    Scroll,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    HelpCircle
} from 'lucide-react';
import GameTerminal from '../components/Terminal/GameTerminal';
import BioMetrics from '../components/StatusPanel/BioMetrics';
import LocationInfo from '../components/StatusPanel/LocationInfo';
import NavigationGrid from '../components/StatusPanel/NavigationGrid';
import EntityList from '../components/StatusPanel/EntityList';
import InventoryModal from '../components/StatusPanel/InventoryModal';
import WaypointsModal from '../components/StatusPanel/WaypointsModal';
import CampChestModal from '../components/StatusPanel/CampChestModal';
import RadarModal from '../components/StatusPanel/RadarModal';
import { CommandListModal } from '../components/Modals/CommandListModal';
import { DialogueModal } from '../components/Modals/DialogueModal';
import { ShopModal } from '../components/Modals/ShopModal';
import { QuestJournalModal } from '../components/Modals/QuestJournalModal';
import { CraftingModal } from '../components/Modals/CraftingModal';
import { ClassSelectModal } from '../components/Modals/ClassSelectModal';
import { PlayerProfileModal } from '../components/Modals/PlayerProfileModal';
import { SkillBar } from '../components/Combat/SkillBar';
import { MultiplayerChatPanel } from '../components/Chat/MultiplayerChatPanel';
import { useMultiplayerSocket } from '../hooks/useMultiplayerSocket';
import type { CommandResponse } from '../api';

interface MainGameHUDProps {
    gameState: CommandResponse | null;
    history: string[];
    onCommand: (cmd: string) => void;
    onLogout: () => void;
    onEquip: (itemName: string) => void;
    onUnequip: (slot: string) => void;
    onDrop: (itemName: string) => void;
    onScout?: () => void;
    onTravel?: (waypointName: string) => void;
    onStore?: (itemName: string) => void;
    onRetrieve?: (itemName: string) => void;
    onConsume?: (itemName: string) => void;
    onFill?: (itemName: string) => void;
    onDrink?: () => void;
    onFetchInventory?: () => Promise<void>;
    onTalk?: (npcName: string) => Promise<CommandResponse | null>;
    onDialogueChoice?: (choice: string) => Promise<CommandResponse | null>;
    onEndDialogue?: () => Promise<CommandResponse | null>;
    onBuy?: (itemName: string) => Promise<CommandResponse | null>;
    onSell?: (itemName: string) => Promise<CommandResponse | null>;
    onTurnInQuest?: (questId: string) => Promise<CommandResponse | null>;
    onSelectClass?: (className: string) => Promise<CommandResponse | null>;
    onUseSkill?: (skillName: string, targetName?: string) => Promise<CommandResponse | null>;
    onCraft?: (recipeName: string) => Promise<CommandResponse | null>;
}

const MainGameHUD: React.FC<MainGameHUDProps> = ({
    gameState,
    history,
    onCommand,
    onLogout,
    onEquip,
    onUnequip,
    onDrop,
    onScout,
    onTravel,
    onStore,
    onRetrieve,
    onConsume,
    onFill,
    onDrink,
    onFetchInventory,
    onTalk,
    onDialogueChoice,
    onEndDialogue,
    onBuy,
    onSell,
    onTurnInQuest,
    onSelectClass,
    onUseSkill,
    onCraft
}) => {
    // Modal states
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isWaypointsOpen, setIsWaypointsOpen] = useState(false);
    const [isCampChestOpen, setIsCampChestOpen] = useState(false);
    const [isRadarOpen, setIsRadarOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isQuestsOpen, setIsQuestsOpen] = useState(false);
    const [isCraftingOpen, setIsCraftingOpen] = useState(false);
    const [isClassSelectOpen, setIsClassSelectOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isTraveling, setIsTraveling] = useState(false);
    const [isDialogueDismissed, setIsDialogueDismissed] = useState(false);
    const [activeTab, setActiveTab] = useState<'terminal' | 'stats' | 'nav'>('terminal');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMobileNavCollapsed, setIsMobileNavCollapsed] = useState(false);

    // Multiplayer WebSocket Link & Party Comms
    const {
        isConnected: isMultiplayerConnected,
        roomPlayers,
        chatMessages,
        party,
        pendingInvite,
        onlinePlayers,
        sendParty,
        sendShout,
        sendWhisper,
        createParty,
        inviteToParty,
        acceptPartyInvite,
        declinePartyInvite,
        leaveParty,
        kickFromParty,
        refreshOnlinePlayers
    } = useMultiplayerSocket({
        playerId: gameState?.player?.id || '',
        currentLocationId: gameState?.location?.id || ''
    });

    const hasEnemies = (gameState?.location?.enemies?.length || 0) > 0;
    const hasItems = (gameState?.location?.items?.length || 0) > 0;
    const isPlayerLowHealth = gameState?.player ? (gameState.player.stats.hp / gameState.player.stats.max_hp) < 0.3 : false;
    const activeDialogue = gameState?.player?.active_dialogue;
    const activeQuestsCount = Object.keys(gameState?.player?.active_quests || {}).length;

    // Reset dismissed state when new dialogue node/npc begins
    React.useEffect(() => {
        setIsDialogueDismissed(false);
    }, [activeDialogue?.node_id, activeDialogue?.npc_id]);

    const handleCloseDialogue = () => {
        setIsDialogueDismissed(true);
        if (onEndDialogue) {
            onEndDialogue();
        } else {
            onCommand('leave');
        }
    };

    const handleTravel = (waypointName: string) => {
        if (!onTravel) return;
        setIsTraveling(true);
        setTimeout(() => {
            onTravel(waypointName);
            setIsTraveling(false);
            setIsWaypointsOpen(false);
        }, 1200);
    };

    const handleTalkToNpc = (npcName: string) => {
        if (onTalk) {
            onTalk(npcName);
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-space-gradient text-slate-200 font-sans overflow-hidden flex flex-col p-2.5 sm:p-4 md:p-6 relative pt-[max(env(safe-area-inset-top,28px),28px)] md:pt-6 pb-[64px] md:pb-6">

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stitch-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Mobile Top Header - Shields content from camera/notch & displays at-a-glance telemetry */}
            <div className="md:hidden flex items-center justify-between px-3 py-1.5 mb-2 bg-black/60 border border-stitch-blue/30 rounded-xl backdrop-blur-md shadow-sm flex-shrink-0 z-20">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isMultiplayerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                    <span className="font-bold text-xs tracking-wider text-stitch-cyan uppercase font-mono">
                        Mystic Explorers
                    </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                    {gameState?.time && (
                        <span className="flex items-center gap-1 text-slate-300 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                            <span>{gameState.time.is_night ? '🌙' : '☀️'}</span>
                            <span>{String(gameState.time.hour).padStart(2, '0')}:{String(gameState.time.minute).padStart(2, '0')}</span>
                        </span>
                    )}
                    {gameState?.player && (
                        <span className="text-amber-300 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                            🪙 {gameState.player.stats.gold ?? 0}
                        </span>
                    )}
                    <button
                        onClick={() => setIsHelpOpen(true)}
                        className="text-slate-400 hover:text-white p-0.5 rounded"
                        title="Command Help"
                    >
                        <HelpCircle size={15} />
                    </button>
                </div>
            </div>

            {/* Main Container */}
            <div className="w-full max-w-7xl flex-1 flex flex-col md:flex-row gap-3 md:gap-5 relative z-20 mx-auto min-h-0">

                {/* Center Column: Terminal (Hidden on mobile if not active tab) */}
                <div className={`w-full flex-1 flex flex-col gap-3 min-h-0 ${activeTab === 'terminal' ? 'flex' : 'hidden md:flex'}`}>
                    
                    {/* Game Terminal Output & Prompt */}
                    <GameTerminal
                        history={history}
                        onCommand={onCommand}
                        onShowHelp={() => setIsHelpOpen(true)}
                        isMultiplayerConnected={isMultiplayerConnected}
                        roomPlayersCount={roomPlayers.length}
                    />

                    {/* Mobile Quick Action Directional Pad */}
                    <div className="md:hidden flex flex-col gap-2 flex-shrink-0 mb-1">
                        <div className="bg-black/40 p-2 rounded-xl border border-stitch-blue/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    className={`p-2.5 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['west'] ? 'bg-gradient-to-l from-stitch-blue/20 to-stitch-cyan/40 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'opacity-30 cursor-not-allowed bg-black/40 text-gray-500 border border-gray-800'}`}
                                    onClick={() => onCommand('west')}
                                    disabled={!gameState?.location?.exits?.['west']}
                                ><ArrowLeft size={20} /></button>
                                <button
                                    className={`p-2.5 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['north'] ? 'bg-gradient-to-t from-stitch-blue/20 to-stitch-cyan/40 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'opacity-30 cursor-not-allowed bg-black/40 text-gray-500 border border-gray-800'}`}
                                    onClick={() => onCommand('north')}
                                    disabled={!gameState?.location?.exits?.['north']}
                                ><ArrowUp size={20} /></button>
                                <button
                                    className={`p-2.5 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['south'] ? 'bg-gradient-to-b from-stitch-blue/20 to-stitch-cyan/40 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'opacity-30 cursor-not-allowed bg-black/40 text-gray-500 border border-gray-800'}`}
                                    onClick={() => onCommand('south')}
                                    disabled={!gameState?.location?.exits?.['south']}
                                ><ArrowDown size={20} /></button>
                                <button
                                    className={`p-2.5 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['east'] ? 'bg-gradient-to-r from-stitch-blue/20 to-stitch-cyan/40 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'opacity-30 cursor-not-allowed bg-black/40 text-gray-500 border border-gray-800'}`}
                                    onClick={() => onCommand('east')}
                                    disabled={!gameState?.location?.exits?.['east']}
                                ><ArrowRight size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status Panels, Location & Navigation */}
                <div className={`w-full md:w-80 lg:w-96 flex-col gap-3 min-h-0 md:flex-shrink-0 ${activeTab !== 'terminal' ? 'flex flex-1' : 'hidden md:flex'}`}>
                    
                    {/* BioMetrics & Action Hub (Desktop + Stats Tab) */}
                    <div className={`flex-col gap-3 flex-1 overflow-y-auto pb-4 md:pb-0 scrollbar-thin pt-2 ${activeTab === 'stats' ? 'flex' : 'hidden md:flex'}`}>
                        {gameState?.player ? (
                            <>
                                <BioMetrics
                                    name={gameState.player.name}
                                    stats={gameState.player.stats}
                                    time={gameState.time}
                                    weapon={gameState.player.equipment?.weapon}
                                    armor={gameState.player.equipment?.armor}
                                    onUnequip={onUnequip}
                                    onOpenClassSelect={() => setIsClassSelectOpen(true)}
                                    onOpenProfile={() => setIsProfileOpen(true)}
                                />

                                {/* Quick System Actions Matrix */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={async () => {
                                             if (onFetchInventory) await onFetchInventory();
                                            setIsInventoryOpen(true);
                                        }}
                                        className="glass-panel-interactive py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 text-stitch-cyan hover:text-white border-stitch-cyan/30 hover:border-stitch-cyan shadow-[0_0_10px_rgba(6,182,212,0.15)] text-[10px] font-bold uppercase tracking-wider transition-all"
                                    >
                                        <Activity size={16} /> Inventory
                                    </button>

                                    <button
                                        onClick={() => setIsQuestsOpen(true)}
                                        className="glass-panel-interactive py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 text-fuchsia-400 hover:text-white border-fuchsia-500/30 hover:border-fuchsia-400 shadow-[0_0_10px_rgba(217,70,239,0.15)] text-[10px] font-bold uppercase tracking-wider transition-all relative cursor-pointer"
                                    >
                                        <Scroll size={16} /> Quests
                                        {activeQuestsCount > 0 && (
                                            <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-fuchsia-500 text-black text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                                {activeQuestsCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="glass-panel rounded-2xl p-6 text-center text-slate-500 italic text-xs font-mono">
                                No Link Established
                            </div>
                        )}
                    </div>

                    {/* Location Info, Detected Entities, Tactical Actions & Exits */}
                    <div className={`glass-panel rounded-2xl p-3 sm:p-5 flex-1 flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-0 ${activeTab === 'nav' ? 'flex' : 'hidden md:flex'}`}>
                        {gameState?.location ? (
                            <>
                                {/* Top Scrollable Area: Location Info & Entities */}
                                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-stitch-blue/50 scrollbar-track-transparent pr-1 min-h-0 flex flex-col gap-2">
                                    <LocationInfo
                                        name={gameState.location.name}
                                        coordinates={gameState.location.coordinates}
                                        description={gameState.location.description}
                                        isDark={gameState.location.is_dark}
                                        availableActions={gameState.available_actions || []}
                                        interactables={gameState.location.interactables || []}
                                        onDrink={onDrink}
                                        onOpenCrafting={() => setIsCraftingOpen(true)}
                                    />

                                    <EntityList
                                        items={gameState.location.items}
                                        enemies={gameState.location.enemies}
                                        interactables={gameState.location.interactables || []}
                                        availableActions={gameState.available_actions || []}
                                        presentPlayers={roomPlayers}
                                        currentPlayerId={gameState.player?.id}
                                        onTake={(item) => onCommand(`take ${item}`)}
                                        onAttack={(enemy) => onCommand(`attack ${enemy}`)}
                                        onTalk={handleTalkToNpc}
                                        onOpenShop={() => setIsShopOpen(true)}
                                        onOpenCrafting={() => setIsCraftingOpen(true)}
                                        onWhisperPlayer={(target) => sendWhisper(target, 'Hello')}
                                    />

                                    {/* Tactical Abilities - ONLY shown during combat when hostiles are detected */}
                                    {gameState?.player && (gameState.location.enemies?.length || 0) > 0 && (
                                        <div className="mt-1">
                                            <SkillBar
                                                characterClass={gameState.player.stats.character_class || 'adventurer'}
                                                playerMp={gameState.player.stats.mp}
                                                maxMp={gameState.player.stats.max_mp}
                                                skillCooldowns={gameState.player.skill_cooldowns || {}}
                                                enemies={gameState.location.enemies}
                                                onUseSkill={(skillName, targetName) => {
                                                    if (onUseSkill) onUseSkill(skillName, targetName);
                                                }}
                                                onOpenClassSelect={() => setIsClassSelectOpen(true)}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Docked Controls: Navigation & System Shortcuts */}
                                <div className="flex-shrink-0 pt-2 border-t border-stitch-blue/20 flex flex-col gap-2 mt-1">
                                    <NavigationGrid
                                        exits={gameState.location.exits}
                                        onMove={onCommand}
                                    />

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => setIsWaypointsOpen(true)}
                                            className="glass-panel-interactive py-2 rounded-lg flex items-center justify-center gap-1.5 text-stitch-blue hover:text-white font-bold tracking-widest uppercase border-stitch-blue/30 hover:border-stitch-lightBlue shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-colors text-[11px]"
                                        >
                                            <Map size={14} /> Waypoints
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (onScout) onScout();
                                                setIsRadarOpen(true);
                                            }}
                                            className="glass-panel-interactive py-2 rounded-lg flex items-center justify-center gap-1.5 text-stitch-cyan hover:text-white font-bold tracking-widest uppercase border-stitch-cyan/30 hover:border-stitch-cyan shadow-[0_0_10px_rgba(6,182,212,0.2)] transition-colors text-[11px]"
                                        >
                                            <Radio size={14} /> Radar
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-stitch-cyan/50 italic font-mono text-xs">
                                Scanning sector telemetry...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar & Collapsed Dock */}
            {isMobileNavCollapsed ? (
                /* Collapsed Floating Menu Toggle */
                <div className="md:hidden fixed bottom-3 right-3 z-50">
                    <button
                        onClick={() => setIsMobileNavCollapsed(false)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/95 border border-stitch-cyan/60 text-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)] backdrop-blur-md font-mono text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                    >
                        <ChevronUp size={15} />
                        <span>Menú</span>
                        {pendingInvite && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                    </button>
                </div>
            ) : (
                /* Active Mobile Bottom Navigation Bar */
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-stitch-blue/30 px-2 py-1 flex items-center justify-around z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
                    <button
                        onClick={() => { setActiveTab('terminal'); setIsChatOpen(false); }}
                        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'terminal' && !isChatOpen ? 'text-stitch-cyan bg-stitch-cyan/15 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <TerminalSquare size={19} />
                        <span className="text-[9px] mt-0.5 tracking-wider uppercase font-bold">Terminal</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('stats'); setIsChatOpen(false); }}
                        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'stats' && !isChatOpen ? 'text-stitch-cyan bg-stitch-cyan/15 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <div className="relative">
                            <Activity size={19} />
                            {isPlayerLowHealth && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>}
                        </div>
                        <span className="text-[9px] mt-0.5 tracking-wider uppercase font-bold">Stats</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('nav'); setIsChatOpen(false); }}
                        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'nav' && !isChatOpen ? 'text-stitch-cyan bg-stitch-cyan/15 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <div className="relative">
                            <Map size={19} />
                            {hasEnemies && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-black"></div>}
                            {hasItems && !hasEnemies && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-stitch-cyan rounded-full border border-black"></div>}
                        </div>
                        <span className="text-[9px] mt-0.5 tracking-wider uppercase font-bold">Map</span>
                    </button>

                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors flex-1 relative ${isChatOpen ? 'text-stitch-cyan bg-stitch-cyan/15 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <div className="relative">
                            <MessageSquare size={19} />
                            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isMultiplayerConnected ? 'bg-emerald-400' : 'bg-rose-500'}`} />
                            {pendingInvite && (
                                <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                            )}
                        </div>
                        <span className="text-[9px] mt-0.5 tracking-wider uppercase font-bold">Chat</span>
                    </button>

                    {/* Collapse Button */}
                    <button
                        onClick={() => setIsMobileNavCollapsed(true)}
                        className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-md"
                        title="Ocultar menú"
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
            )}

            {/* Modals Suite */}
            
            {/* 1. Inventory Modal */}
            <InventoryModal
                inventory={gameState?.player?.inventory || []}
                currentWeight={gameState?.player?.current_weight || 0}
                maxWeight={gameState?.player?.stats?.max_weight || 0}
                isOpen={isInventoryOpen}
                onClose={() => setIsInventoryOpen(false)}
                onEquip={(item) => onEquip(item)}
                onDrop={(item) => onDrop(item)}
                onConsume={onConsume ? ((item) => onConsume(item)) : undefined}
                onFill={onFill ? ((item) => onFill(item)) : undefined}
                availableActions={gameState?.available_actions || []}
            />

            {/* 2. Fast Travel / Waypoints Modal */}
            <WaypointsModal
                waypoints={gameState?.player?.waypoints || {}}
                isOpen={isWaypointsOpen}
                isTraveling={isTraveling}
                onClose={() => setIsWaypointsOpen(false)}
                onTravel={handleTravel}
                onCreateCamp={(campName) => onCommand(`camp ${campName}`)}
            />

            {/* 3. Camp Storage Chest */}
            <CampChestModal
                isOpen={isCampChestOpen}
                onClose={() => setIsCampChestOpen(false)}
                inventory={gameState?.player?.inventory || []}
                chest={gameState?.location?.camp_storage || []}
                currentWeight={gameState?.player?.current_weight || 0}
                maxWeight={gameState?.player?.stats?.max_weight || 0}
                onStore={onStore || (() => { })}
                onRetrieve={onRetrieve || (() => { })}
            />

            {/* 4. Interactive Dialogue Modal */}
            <DialogueModal
                dialogue={activeDialogue || null}
                isOpen={!!activeDialogue && !isDialogueDismissed}
                onClose={handleCloseDialogue}
                onChoice={(choice) => {
                    if (onDialogueChoice) onDialogueChoice(choice);
                }}
                availableActions={gameState?.available_actions || []}
            />

            {/* 5. Merchant Trading Post Modal */}
            <ShopModal
                isOpen={isShopOpen}
                onClose={() => setIsShopOpen(false)}
                playerGold={gameState?.player?.stats?.gold || 0}
                playerInventory={gameState?.player?.inventory || []}
                onBuy={(itemName) => {
                    if (onBuy) onBuy(itemName);
                }}
                onSell={(itemName) => {
                    if (onSell) onSell(itemName);
                }}
            />

            {/* 6. Quest Journal Modal */}
            <QuestJournalModal
                isOpen={isQuestsOpen}
                onClose={() => setIsQuestsOpen(false)}
                activeQuests={gameState?.player?.active_quests || {}}
                completedQuests={gameState?.player?.completed_quests || []}
                onTurnIn={(questId) => {
                    if (onTurnInQuest) onTurnInQuest(questId);
                }}
            />

            {/* 7. Field Crafting Workshop Modal */}
            <CraftingModal
                isOpen={isCraftingOpen}
                onClose={() => setIsCraftingOpen(false)}
                playerInventory={gameState?.player?.inventory || []}
                availableActions={gameState?.available_actions || []}
                onCraft={(recipeName) => {
                    if (onCraft) onCraft(recipeName);
                }}
            />

            {/* 8. Archetype Specialization Modal */}
            <ClassSelectModal
                isOpen={isClassSelectOpen}
                onClose={() => setIsClassSelectOpen(false)}
                currentClass={gameState?.player?.stats?.character_class || 'adventurer'}
                onSelectClass={(className) => {
                    if (onSelectClass) onSelectClass(className);
                }}
            />

            {/* 9. Help & Command Glossary */}
            <CommandListModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />

            {/* 10. Long-range Radar Modal */}
            <RadarModal
                isOpen={isRadarOpen}
                onClose={() => setIsRadarOpen(false)}
                scoutedLocations={gameState?.scouted_locations}
            />

            {/* 11. Real-time Multiplayer Chat & Party Comms */}
            <MultiplayerChatPanel
                isOpen={isChatOpen}
                onToggleOpen={setIsChatOpen}
                isConnected={isMultiplayerConnected}
                messages={chatMessages}
                party={party}
                pendingInvite={pendingInvite}
                onlinePlayers={onlinePlayers}
                onSendParty={sendParty}
                onSendShout={sendShout}
                onSendWhisper={sendWhisper}
                onCreateParty={createParty}
                onInviteToParty={inviteToParty}
                onAcceptInvite={acceptPartyInvite}
                onDeclineInvite={declinePartyInvite}
                onLeaveParty={leaveParty}
                onKickPartyMember={kickFromParty}
                onRefreshOnline={refreshOnlinePlayers}
            />

            {/* 12. Operator Profile & Dossier Modal */}
            {gameState?.player && (
                <PlayerProfileModal
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    playerId={gameState.player.id}
                    playerName={gameState.player.name}
                    stats={gameState.player.stats}
                    equipment={gameState.player.equipment}
                    waypointsCount={Object.keys(gameState.player.waypoints || {}).length}
                    activeQuestsCount={Object.keys(gameState.player.active_quests || {}).length}
                    currentWeight={gameState.player.current_weight || 0}
                    onLogout={onLogout}
                />
            )}
        </div>
    );
};

export default MainGameHUD;
