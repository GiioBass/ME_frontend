import React, { useState } from 'react';
import { Package, Power } from 'lucide-react';
import GameTerminal from '../components/Terminal/GameTerminal';
import BioMetrics from '../components/StatusPanel/BioMetrics';
import LocationInfo from '../components/StatusPanel/LocationInfo';
import NavigationGrid from '../components/StatusPanel/NavigationGrid';
import EntityList from '../components/StatusPanel/EntityList';
import InventoryModal from '../components/StatusPanel/InventoryModal';
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
}

const MainGameHUD: React.FC<MainGameHUDProps> = ({ gameState, history, onCommand, onLogout, onEquip, onUnequip, onDrop, onScout }) => {
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

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
                            <button
                                onClick={() => setIsInventoryOpen(true)}
                                className="w-full glass-panel-interactive py-3 rounded-xl flex items-center justify-center gap-3 text-stitch-cyan hover:text-white font-bold tracking-widest uppercase border-stitch-blue/30 hover:border-stitch-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                title="Open Storage Unit"
                            >
                                <Package size={20} />
                                Access Inventory
                            </button>
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
                isOpen={isInventoryOpen}
                onClose={() => setIsInventoryOpen(false)}
                onEquip={(item) => {
                    onEquip(item);
                }}
                onDrop={(item) => {
                    onDrop(item);
                }}
            />
        </div>
    );
};

export default MainGameHUD;
