import React, { useState } from 'react';
import { Package, Power, TerminalSquare, Activity, Map, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, AlertTriangle, Box, Droplets, ChevronsUp, ChevronsDown } from 'lucide-react';
import GameTerminal from '../components/Terminal/GameTerminal';
import BioMetrics from '../components/StatusPanel/BioMetrics';
import LocationInfo from '../components/StatusPanel/LocationInfo';
import NavigationGrid from '../components/StatusPanel/NavigationGrid';
import EntityList from '../components/StatusPanel/EntityList';
import InventoryModal from '../components/StatusPanel/InventoryModal';
import WaypointsModal from '../components/StatusPanel/WaypointsModal';
import CampChestModal from '../components/StatusPanel/CampChestModal';
import { CommandListModal } from '../components/Modals/CommandListModal';
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
}

const MainGameHUD: React.FC<MainGameHUDProps> = ({ gameState, history, onCommand, onLogout, onEquip, onUnequip, onDrop, onScout, onTravel, onStore, onRetrieve, onConsume, onFill, onDrink }) => {
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isWaypointsOpen, setIsWaypointsOpen] = useState(false);
    const [isCampChestOpen, setIsCampChestOpen] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isTraveling, setIsTraveling] = useState(false);
    const [activeTab, setActiveTab] = useState<'terminal' | 'stats' | 'nav'>('terminal');

    const isAtCamp = gameState?.location?.id && Object.values(gameState?.player?.waypoints || {}).includes(gameState.location.id);
    const hasEnemies = (gameState?.location?.enemies?.length || 0) > 0;
    const hasItems = (gameState?.location?.items?.length || 0) > 0;
    const isPlayerLowHealth = gameState?.player ? (gameState.player.stats.hp / gameState.player.stats.max_hp) < 0.3 : false;
    const hasWater = gameState?.available_actions?.includes('drink') || gameState?.available_actions?.includes('fill') || false;
    const canAscend = !!gameState?.location?.exits?.['up'];
    const canDescend = !!gameState?.location?.exits?.['down'];

    const handleTravel = (waypointName: string) => {
        if (!onTravel) return;
        setIsTraveling(true);
        // Simulate travel delay
        setTimeout(() => {
            onTravel(waypointName);
            setIsTraveling(false);
            setIsWaypointsOpen(false);
        }, 1200);
    }

    return (
        <div className="h-[100dvh] w-full bg-space-gradient text-slate-200 font-sans overflow-hidden flex flex-col p-4 md:p-8 relative pb-[80px] md:pb-8">

            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stitch-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Container */}
            <div className="w-full max-w-7xl flex-1 flex flex-col md:flex-row gap-4 md:gap-6 relative z-20 mx-auto min-h-0">

                {/* Mobile Title (Only visible on small screens) */}
                <div className="md:hidden glass-panel p-3 flex-shrink-0 rounded-2xl flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                    <h1 className="text-xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-stitch-cyan to-stitch-lightBlue uppercase">
                        <span className="text-white"> Mystic Explorers</span>
                    </h1>
                    <button onClick={onLogout} className="text-stitch-cyan/50 hover:text-stitch-orange p-2">
                        <Power size={18} />
                    </button>
                </div>

                {/* Main Terminal Output (Hidden on mobile if not active tab) */}
                <div className={`w-full flex-1 flex flex-col gap-4 min-h-0 ${activeTab === 'terminal' ? 'flex' : 'hidden md:flex'}`}>
                    <GameTerminal history={history} onCommand={onCommand} onShowHelp={() => setIsHelpOpen(true)} />

                    {/* Quick Actions & Alerts (Mobile Only) */}
                    <div className="md:hidden flex flex-col gap-3 flex-shrink-0 mb-2">
                        {/* Directional Pad */}
                        <div className="bg-black/20 p-4 rounded-xl border border-stitch-blue/20 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                            <h3 className="text-center text-[10px] tracking-[0.3em] text-stitch-cyan/50 uppercase mb-4">Nav-Comm Panel</h3>
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['west']
                                        ? 'bg-gradient-to-l from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                                    onClick={() => onCommand('west')}
                                    disabled={!gameState?.location?.exits?.['west']}
                                ><ArrowLeft size={24} /></button>
                                <button
                                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['north']
                                        ? 'bg-gradient-to-t from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                                    onClick={() => onCommand('north')}
                                    disabled={!gameState?.location?.exits?.['north']}
                                ><ArrowUp size={24} /></button>
                                <button
                                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['south']
                                        ? 'bg-gradient-to-b from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                                    onClick={() => onCommand('south')}
                                    disabled={!gameState?.location?.exits?.['south']}
                                ><ArrowDown size={24} /></button>
                                <button
                                    className={`p-3 relative z-10 flex items-center justify-center rounded-lg transition-all active:scale-95 ${gameState?.location?.exits?.['east']
                                        ? 'bg-gradient-to-r from-stitch-blue/20 to-stitch-cyan/40 hover:from-stitch-cyan/40 hover:to-stitch-cyan/60 text-white border border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                        : 'bg-gray-900/50 text-gray-700 border border-gray-800'}`}
                                    onClick={() => onCommand('east')}
                                    disabled={!gameState?.location?.exits?.['east']}
                                ><ArrowRight size={24} /></button>
                            </div>
                        </div>

                        {(canAscend || canDescend) && (
                            <div className="grid grid-cols-2 gap-2">
                                {canAscend && <button onClick={() => onCommand('up')} className="glass-panel-interactive p-2 rounded flex justify-center items-center gap-2 text-stitch-cyan hover:text-white text-xs font-bold uppercase col-span-1"><ChevronsUp size={16} /> Ascend</button>}
                                {canDescend && <button onClick={() => onCommand('down')} className="glass-panel-interactive p-2 rounded flex justify-center items-center gap-2 text-stitch-cyan hover:text-white text-xs font-bold uppercase col-span-1"><ChevronsDown size={16} /> Descend</button>}
                            </div>
                        )}

                        {/* Contextual Alerts */}
                        {hasEnemies && (
                            <button onClick={() => setActiveTab('nav')} className="glass-panel-interactive p-3 rounded-lg flex items-center justify-center gap-2 text-red-400 border-red-500/30 hover:bg-red-900/20 hover:text-red-300 w-full animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                <AlertTriangle size={20} /> Hostiles present in area
                            </button>
                        )}
                        {hasItems && !hasEnemies && (
                            <button onClick={() => setActiveTab('nav')} className="glass-panel-interactive p-3 rounded-lg flex items-center justify-center gap-2 text-stitch-cyan border-stitch-blue/30 hover:bg-stitch-blue/20 hover:text-white w-full">
                                <Box size={20} /> Items detected nearby
                            </button>
                        )}
                        {hasWater && !hasEnemies && (
                            <button onClick={() => setActiveTab('nav')} className="glass-panel-interactive p-3 rounded-lg flex items-center justify-center gap-2 text-blue-400 border-blue-500/30 hover:bg-blue-900/20 hover:text-blue-300 w-full">
                                <Droplets size={20} /> Water source nearby
                            </button>
                        )}
                    </div>
                </div>

                {/* Side Panel (HUD) - Hidden on mobile if terminal is active tab */}
                <div className={`w-full md:w-[450px] flex-col gap-6 flex-1 min-h-0 overflow-hidden ${activeTab === 'terminal' ? 'hidden md:flex' : 'flex'}`}>

                    {/* Desktop Title Hub (Hidden on mobile) */}
                    <div className="hidden md:flex glass-panel p-4 rounded-2xl items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-stitch-cyan to-stitch-lightBlue uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                            <span className="text-white"> Mystic Explorers</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onLogout}
                                className="text-stitch-cyan/50 hover:text-stitch-orange transition-colors p-2"
                                title="Disconnect from Link"
                            >
                                <Power size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Stats & Actions */}
                    {gameState?.player ? (
                        <div className={`flex flex-col gap-4 ${activeTab === 'stats' ? 'flex' : 'hidden md:flex'}`}>
                            <BioMetrics
                                name={gameState.player.name}
                                stats={gameState.player.stats}
                                time={gameState.time}
                                weapon={gameState.player.equipment?.weapon}
                                armor={gameState.player.equipment?.armor}
                                onUnequip={onUnequip}
                            />
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setIsInventoryOpen(true)}
                                    className="w-full glass-panel-interactive py-3 rounded-xl flex items-center justify-center gap-3 text-stitch-cyan hover:text-white font-bold tracking-widest uppercase border-stitch-blue/30 hover:border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                    title="Open Storage Unit"
                                >
                                    <Package size={20} />
                                    Access Inventory
                                </button>

                                {isAtCamp && (
                                    <button
                                        onClick={() => setIsCampChestOpen(true)}
                                        className="w-full glass-panel-interactive py-2 rounded-xl flex items-center justify-center gap-2 text-green-400 hover:text-white font-bold tracking-widest uppercase border-green-500/30 hover:border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-colors text-sm"
                                        title="Open Camp Chest"
                                    >
                                        <Package size={16} />
                                        Camp Chest
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={`glass-panel rounded-2xl p-6 flex-shrink-0 flex items-center justify-center h-24 text-stitch-orange/70 animate-pulse text-sm uppercase tracking-widest border-stitch-orange/30 ${activeTab === 'stats' ? 'flex' : 'hidden md:flex'}`}>
                            No Connection
                        </div>
                    )}

                    {/* Location Info & Actions */}
                    <div className={`glass-panel rounded-2xl p-6 flex-1 flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-stitch-blue/50 scrollbar-track-transparent ${activeTab === 'nav' ? 'flex' : 'hidden md:flex'}`}>
                        {gameState?.location ? (
                            <>
                                <LocationInfo
                                    name={gameState.location.name}
                                    coordinates={gameState.location.coordinates}
                                    description={gameState.location.description}
                                    scoutedLocations={gameState.scouted_locations}
                                    onScout={onScout}
                                    isDark={gameState.location.is_dark}
                                    availableActions={gameState.available_actions || []}
                                    onDrink={onDrink}
                                />

                                <div className="mt-4 overflow-y-auto pr-1">
                                    <EntityList
                                        items={gameState.location.items}
                                        enemies={gameState.location.enemies}
                                        onTake={(item) => onCommand(`take ${item}`)}
                                        onAttack={(enemy) => onCommand(`attack ${enemy}`)}
                                    />
                                </div>

                                <div className="flex-1"></div>

                                <NavigationGrid
                                    exits={gameState.location.exits}
                                    onMove={onCommand}
                                />

                                <button
                                    onClick={() => setIsWaypointsOpen(true)}
                                    className="w-full mt-4 glass-panel-interactive py-2 rounded-lg flex items-center justify-center gap-2 text-stitch-blue hover:text-white font-bold tracking-widest uppercase border-stitch-blue/30 hover:border-stitch-lightBlue shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-colors"
                                >
                                    Fast Travel Network
                                </button>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-stitch-cyan/50 italic font-mono text-sm">
                                Scanning coordinates...
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
                    <TerminalSquare size={24} />
                    <span className="text-[10px] mt-1 tracking-wider uppercase font-bold">Terminal</span>
                </button>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'stats' ? 'text-stitch-cyan bg-stitch-cyan/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="relative">
                        <Activity size={24} />
                        {isPlayerLowHealth && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>}
                        {isPlayerLowHealth && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black"></div>}
                    </div>
                    <span className="text-[10px] mt-1 tracking-wider uppercase font-bold">Stats</span>
                </button>
                <button
                    onClick={() => setActiveTab('nav')}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors flex-1 relative ${activeTab === 'nav' ? 'text-stitch-cyan bg-stitch-cyan/10' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <div className="relative">
                        <Map size={24} />
                        {hasEnemies && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-black"></div>}
                        {hasItems && !hasEnemies && <div className="absolute -top-1 -right-1 w-3 h-3 bg-stitch-cyan rounded-full border border-black"></div>}
                    </div>
                    <span className="text-[10px] mt-1 tracking-wider uppercase font-bold">Map</span>
                </button>
            </div>

            {/* Inventory Modal */}
            <InventoryModal
                inventory={gameState?.player?.inventory || []}
                currentWeight={gameState?.player?.current_weight || 0}
                maxWeight={gameState?.player?.stats?.max_weight || 0}
                isOpen={isInventoryOpen}
                onClose={() => setIsInventoryOpen(false)}
                onEquip={(item) => {
                    onEquip(item);
                }}
                onDrop={(item) => {
                    onDrop(item);
                }}
                onConsume={onConsume ? ((item) => onConsume(item)) : undefined}
                onFill={onFill ? ((item) => onFill(item)) : undefined}
                availableActions={gameState?.available_actions || []}
            />

            <WaypointsModal
                waypoints={gameState?.player?.waypoints || {}}
                isOpen={isWaypointsOpen}
                isTraveling={isTraveling}
                onClose={() => setIsWaypointsOpen(false)}
                onTravel={handleTravel}
                onCreateCamp={(campName) => onCommand(`camp ${campName}`)}
            />

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

            <CommandListModal
                isOpen={isHelpOpen}
                onClose={() => setIsHelpOpen(false)}
            />
        </div>
    );
};

export default MainGameHUD;
