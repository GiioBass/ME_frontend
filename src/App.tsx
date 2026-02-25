// React is not needed directly in scope for React 17+ JSX
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
    handleCommand
  } = useGameEngine();

  if (isCheckingSession) {
    return (
      <div className="h-[100dvh] w-full bg-space-gradient flex items-center justify-center p-4">
        <div className="text-stitch-cyan animate-pulse font-mono tracking-widest text-sm text-glow">Establishing secure link...</div>
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
    />
  );
}

export default App;
