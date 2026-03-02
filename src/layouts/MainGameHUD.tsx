import React, { useState } from 'react';
import { Package, Power } from 'lucide-react';
import GameTerminal from '../components/Terminal/GameTerminal';
import BioMetrics from '../components/StatusPanel/BioMetrics';
import LocationInfo from '../components/StatusPanel/LocationInfo';
import NavigationGrid from '../components/StatusPanel/NavigationGrid';
import EntityList from '../components/StatusPanel/EntityList';
import InventoryModal from '../components/StatusPanel/InventoryModal';
import WaypointsModal from '../components/StatusPanel/WaypointsModal';
import CampChestModal from '../components/StatusPanel/CampChestModal';
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
}

const MainGameHUD: React.FC<MainGameHUDProps> = ({ gameState, history, onCommand, onLogout, onEquip, onUnequip, onDrop, onScout, onTravel, onStore, onRetrieve, onConsume, onFill }) => {
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [isWaypointsOpen, setIsWaypointsOpen] = useState(false);
    const [isCampChestOpen, setIsCampChestOpen] = useState(false);
    const [isTraveling, setIsTraveling] = useState(false);

    const isAtCamp = gameState?.location?.id && Object.values(gameState?.player?.waypoints || {}).includes(gameState.location.id);

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
        <div className="h-[100dvh] w-full bg-space-gradient text-slate-200 font-sans overflow-x-hidden overflow-y-auto flex justify-center p-4 md:p-8 relative">

            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-stitch-blue/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-stitch-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Main Container */}
            <div className="w-full max-w-7xl h-auto min-h-full md:h-full md:max-h-[95vh] flex flex-col md:flex-row gap-6 relative z-20 mx-auto">

                {/* Main Terminal Output */}
                <GameTerminal history={history} />

                {/* Side Panel (HUD) */}
                <div className="w-full md:w-[450px] flex flex-col gap-6 h-full overflow-hidden">

                    {/* Main Title Hub */}
                    <div className="glass-panel p-4 rounded-2xl flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                        <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-stitch-cyan to-stitch-lightBlue uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                            <span className="text-white"> Mystic Explorers</span>
                        </h1>
                        <button
                            onClick={onLogout}
                            className="text-stitch-cyan/50 hover:text-stitch-orange transition-colors p-2"
                            title="Disconnect from Link"
                        >
                            <Power size={20} />
                        </button>
                    </div>

                    {/* Stats & Actions */}
                    {gameState?.player ? (
                        <div className="flex flex-col gap-4">
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
                        <div className="glass-panel rounded-2xl p-6 flex-shrink-0 flex items-center justify-center h-24 text-stitch-orange/70 animate-pulse text-sm uppercase tracking-widest border-stitch-orange/30">
                            No Connection
                        </div>
                    )}

                    {/* Location Info & Actions */}
                    <div className="glass-panel rounded-2xl p-6 flex-1 flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)] min-h-0 overflow-y-auto scrollbar-thin scrollbar-thumb-stitch-blue/50 scrollbar-track-transparent">
                        {gameState?.location ? (
                            <>
                                <LocationInfo
                                    name={gameState.location.name}
                                    coordinates={gameState.location.coordinates}
                                    description={gameState.location.description}
                                    scoutedLocations={gameState.scouted_locations}
                                    onScout={onScout}
                                    isDark={gameState.location.is_dark}
                                />

                                <div className="flex-1 my-4"></div>

                                <NavigationGrid
                                    exits={gameState.location.exits}
                                    onMove={onCommand}
                                />

                                <EntityList
                                    items={gameState.location.items}
                                    enemies={gameState.location.enemies}
                                    onTake={(item) => onCommand(`take ${item}`)}
                                    onAttack={(enemy) => onCommand(`attack ${enemy}`)}
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
        </div>
    );
};

export default MainGameHUD;
