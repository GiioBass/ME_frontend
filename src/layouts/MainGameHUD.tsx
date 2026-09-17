import React, { useState } from 'react';
import {
    TerminalSquare,
    Activity,
    Map,
    Radio,
    Power,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    Scroll,
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
import { SkillBar } from '../components/Combat/SkillBar';
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
    const [isTraveling, setIsTraveling] = useState(false);
    const [activeTab, setActiveTab] = useState<'terminal' | 'stats' | 'nav'>('terminal');

    const hasEnemies = (gameState?.location?.enemies?.length || 0) > 0;
    const hasItems = (gameState?.location?.items?.length || 0) > 0;
    const isPlayerLowHealth = gameState?.player ? (gameState.player.stats.hp / gameState.player.stats.max_hp) < 0.3 : false;
    const activeDialogue = gameState?.player?.active_dialogue;
    const activeQuestsCount = Object.keys(gameState?.player?.active_quests || {}).length;

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
        <div className="h-[100dvh] w-full bg-space-gradient text-slate-200 font-sans overflow-hidden flex flex-col p-3 md:p-6 relative pb-[70px] md:pb-6">

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stitch-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Container */}
            <div className="w-full max-w-7xl flex-1 flex flex-col md:flex-row gap-3 md:gap-5 relative z-20 mx-auto min-h-0">

                {/* Mobile Top Header */}
                <div className="md:hidden glass-panel p-3 flex-shrink-0 rounded-2xl flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                    <h1 className="text-base font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-stitch-cyan to-stitch-lightBlue uppercase">
                        <span className="text-white">Mystic Explorers</span>
                    </h1>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsQuestsOpen(true)}
                            className="text-stitch-magenta p-1.5 rounded-lg hover:bg-white/5 relative"
                            title="Quests"
                        >
                            <Scroll size={18} />
                            {activeQuestsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-stitch-magenta text-black font-bold text-[9px] rounded-full flex items-center justify-center">
                                    {activeQuestsCount}
                                </span>
                            )}
                        </button>
                        <button onClick={onLogout} className="text-stitch-cyan/50 hover:text-stitch-orange p-1.5">
                            <Power size={18} />
                        </button>
                    </div>
                </div>

                {/* Center Column: Terminal & Hotbar (Hidden on mobile if not active tab) */}
                <div className={`w-full flex-1 flex flex-col gap-3 min-h-0 ${activeTab === 'terminal' ? 'flex' : 'hidden md:flex'}`}>
                    
                    {/* Game Terminal Output & Prompt */}
                    <GameTerminal
                        history={history}
                        onCommand={onCommand}
                        onShowHelp={() => setIsHelpOpen(true)}
                    />

                    {/* Combat Skill Hotbar */}
                    {gameState?.player && (
                        <SkillBar
                            characterClass={gameState.player.stats.character_class || 'adventurer'}
                            playerMp={gameState.player.stats.mp}
                            maxMp={gameState.player.stats.max_mp}
                            enemies={gameState.location?.enemies || []}
                            onUseSkill={(skillName, targetName) => {
                                if (onUseSkill) onUseSkill(skillName, targetName);
                            }}
                            onOpenClassSelect={() => setIsClassSelectOpen(true)}
                        />
                    )}

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
                <div className="w-full md:w-80 lg:w-96 flex flex-col gap-3 min-h-0 flex-shrink-0">
                    
                    {/* BioMetrics & Action Hub (Desktop + Stats Tab) */}
                    <div className={`flex-col gap-3 ${activeTab === 'stats' ? 'flex' : 'hidden md:flex'}`}>
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
                                />

                                {/* Quick System Actions Matrix */}
                                <div className="grid grid-cols-3 gap-2">
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
                                        className="glass-panel-interactive py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 text-stitch-magenta hover:text-white border-stitch-magenta/30 hover:border-stitch-magenta shadow-[0_0_10px_rgba(217,70,239,0.15)] text-[10px] font-bold uppercase tracking-wider transition-all relative"
                                    >
                                        <Scroll size={16} /> Quests
                                        {activeQuestsCount > 0 && (
                                            <span className="absolute 1 top-1 right-2 w-3.5 h-3.5 bg-stitch-magenta text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                                                {activeQuestsCount}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setIsShopOpen(true)}
                                        className="glass-panel-interactive py-2.5 px-2 rounded-xl flex flex-col items-center justify-center gap-1 text-amber-400 hover:text-white border-amber-500/30 hover:border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)] text-[10px] font-bold uppercase tracking-wider transition-all"
                                    >
                                        <ShoppingBag size={16} /> Market
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="glass-panel rounded-2xl p-6 text-center text-slate-500 italic text-xs font-mono">
                                No Link Established
                            </div>
                        )}
                    </div>

                    {/* Location Info, Detected Entities & Exits */}
                    <div className={`glass-panel rounded-2xl p-4 sm:p-5 flex-1 flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-stitch-blue/50 scrollbar-track-transparent ${activeTab === 'nav' ? 'flex' : 'hidden md:flex'}`}>
                        {gameState?.location ? (
                            <>
                                <LocationInfo
                                    name={gameState.location.name}
                                    coordinates={gameState.location.coordinates}
                                    description={gameState.location.description}
                                    isDark={gameState.location.is_dark}
                                    availableActions={gameState.available_actions || []}
                                    onDrink={onDrink}
                                    onOpenCrafting={() => setIsCraftingOpen(true)}
                                />

                                <div className="mt-2 overflow-y-auto pr-1">
                                    <EntityList
                                        items={gameState.location.items}
                                        enemies={gameState.location.enemies}
                                        availableActions={gameState.available_actions || []}
                                        onTake={(item) => onCommand(`take ${item}`)}
                                        onAttack={(enemy) => onCommand(`attack ${enemy}`)}
                                        onTalk={handleTalkToNpc}
                                        onOpenShop={() => setIsShopOpen(true)}
                                        onOpenCrafting={() => setIsCraftingOpen(true)}
                                    />
                                </div>

                                <div className="flex-1 min-h-[10px]"></div>

                                <NavigationGrid
                                    exits={gameState.location.exits}
                                    onMove={onCommand}
                                />

                                <div className="grid grid-cols-2 gap-2 mt-3">
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
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-stitch-cyan/50 italic font-mono text-xs">
                                Scanning sector telemetry...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-stitch-blue/30 p-2 flex justify-around z-50">
                <button
                    onClick={() => setActiveTab('terminal')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'terminal' ? 'text-stitch-cyan bg-stitch-cyan/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <TerminalSquare size={20} />
                    <span className="text-[9px] mt-1 tracking-wider uppercase font-bold">Terminal</span>
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'stats' ? 'text-stitch-cyan bg-stitch-cyan/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="relative">
                        <Activity size={20} />
                        {isPlayerLowHealth && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>}
                    </div>
                    <span className="text-[9px] mt-1 tracking-wider uppercase font-bold">Stats</span>
                </button>
                <button
                    onClick={() => setActiveTab('nav')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'nav' ? 'text-stitch-cyan bg-stitch-cyan/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="relative">
                        <Map size={20} />
                        {hasEnemies && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black"></div>}
                        {hasItems && !hasEnemies && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-stitch-cyan rounded-full border border-black"></div>}
                    </div>
                    <span className="text-[9px] mt-1 tracking-wider uppercase font-bold">Map</span>
                </button>
            </div>

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
                isOpen={!!activeDialogue}
                onClose={() => onCommand('look')}
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
        </div>
    );
};

export default MainGameHUD;
