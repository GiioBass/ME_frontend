import React, { useState, useEffect } from 'react';
import { sendCommand, type CommandResponse } from './api';
import axios from 'axios';
import GameTerminal from './components/Terminal/GameTerminal';
import BioMetrics from './components/StatusPanel/BioMetrics';
import LocationInfo from './components/StatusPanel/LocationInfo';
import NavigationGrid from './components/StatusPanel/NavigationGrid';
import EntityList from './components/StatusPanel/EntityList';
import InventoryModal from './components/StatusPanel/InventoryModal';
import { Package } from 'lucide-react';

function App() {
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('me_game_history');
    return saved ? JSON.parse(saved) : ["Welcome to Mystic Explorers. Type 'start' or 'help' to connect."];
  });
  const [gameState, setGameState] = useState<CommandResponse | null>(null);
  const [playerId, setPlayerId] = useState<string>('');
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('me_game_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const initGame = async () => {
      const storedId = localStorage.getItem('me_player_id');
      if (storedId) {
        setPlayerId(storedId);
        try {
          const res = await sendCommand(storedId, 'look');
          setGameState(res);
          setHistory(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg !== res.message) {
              return [...prev, res.message];
            }
            return prev;
          });
          return;
        } catch (e) {
          localStorage.removeItem('me_player_id');
        }
      }

      try {
        const res = await axios.post('http://localhost:8000/api/v1/start?name=Traveler');
        const newId = res.data.player.id;
        setPlayerId(newId);
        localStorage.setItem('me_player_id', newId);

        setGameState(res.data);
        setHistory(prev => [...prev, res.data.message]);
      } catch (err) {
        setHistory(prev => [...prev, "Critical Error: Could not connect to server."]);
      }
    };
    initGame();
  }, []);

  const handleCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    if (!playerId) {
      setHistory(prev => [...prev, "Error: Not connected to server."]);
      return;
    }

    try {
      setHistory(prev => [...prev, `> ${cmd}`]);
      const res = await sendCommand(playerId, cmd);
      setGameState(res);

      const logEntries = [res.message];
      if (res.location && res.location.description) {
        logEntries.push(res.location.description);
      }
      setHistory(prev => [...prev, ...logEntries]);
    } catch (err) {
      setHistory(prev => [...prev, "Error: Failed to send command."]);
    }
  };

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
          </div>

          {/* Stats & Actions */}
          {gameState?.player ? (
            <div className="flex flex-col gap-4">
              <BioMetrics
                name={gameState.player.name}
                stats={gameState.player.stats}
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
                />

                <div className="flex-1 my-4"></div>

                <NavigationGrid
                  exits={gameState.location.exits}
                  onMove={handleCommand}
                />

                <EntityList
                  items={gameState.location.items}
                  enemies={gameState.location.enemies}
                  onTake={(item) => handleCommand(`take ${item}`)}
                  onAttack={(enemy) => handleCommand(`attack ${enemy}`)}
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
      />
    </div>
  );
}

export default App;
