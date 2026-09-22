import LoginScreen from './components/LoginScreen';
import MainGameHUD from './layouts/MainGameHUD';
import { useGameEngine } from './hooks/useGameEngine';

function App() {
  const {
    gameState,
    history,
    playerId,
    isCheckingSession,
    handleLogin,
    handleRegister,
    handleLogout,
    handleCommand,
    handleEquip,
    handleUnequip,
    handleDrop,
    handleScout,
    handleTravel,
    handleStore,
    handleRetrieve,
    handleConsume,
    handleFill,
    handleDrink,
    handleFetchInventory,
    handleTalk,
    handleDialogueChoice,
    handleEndDialogue,
    handleBuy,
    handleSell,
    handleQuestTurnIn,
    handleSelectClass,
    handleUseSkill,
    handleCraft
  } = useGameEngine();

  if (isCheckingSession) {
    return (
      <div className="h-[100dvh] w-full bg-space-gradient flex items-center justify-center p-4">
        <div className="text-stitch-cyan animate-pulse font-mono tracking-widest text-sm text-glow">
          Establishing neural link to Mystic Explorers...
        </div>
      </div>
    );
  }

  if (!playerId) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <MainGameHUD
      gameState={gameState}
      history={history}
      onCommand={handleCommand}
      onLogout={handleLogout}
      onEquip={handleEquip}
      onUnequip={handleUnequip}
      onDrop={handleDrop}
      onScout={handleScout}
      onTravel={handleTravel}
      onStore={handleStore}
      onRetrieve={handleRetrieve}
      onConsume={handleConsume}
      onFill={handleFill}
      onDrink={handleDrink}
      onFetchInventory={handleFetchInventory}
      onTalk={handleTalk}
      onDialogueChoice={handleDialogueChoice}
      onEndDialogue={handleEndDialogue}
      onBuy={handleBuy}
      onSell={handleSell}
      onTurnInQuest={handleQuestTurnIn}
      onSelectClass={handleSelectClass}
      onUseSkill={handleUseSkill}
      onCraft={handleCraft}
    />
  );
}

export default App;
