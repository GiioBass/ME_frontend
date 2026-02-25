import { useState, useEffect, useCallback } from 'react';
import { sendCommand, loginPlayer, actionDrop, actionEquip, actionUnequip, actionScout, type CommandResponse } from '../api';
import axios from 'axios';

export const useGameEngine = () => {
    const [history, setHistory] = useState<string[]>(() => {
        const saved = localStorage.getItem('me_game_history');
        return saved ? JSON.parse(saved) : ["Welcome to Mystic Explorers. Type 'start' or 'help' to connect."];
    });
    const [gameState, setGameState] = useState<CommandResponse | null>(null);
    const [playerId, setPlayerId] = useState<string>('');
    const [isCheckingSession, setIsCheckingSession] = useState(true);

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
                } catch {
                    localStorage.removeItem('me_player_id');
                    setPlayerId('');
                }
            }
            setIsCheckingSession(false);
        };
        initGame();
    }, []);

    const handleLogin = async (name: string) => {
        const res = await loginPlayer(name);
        const newId = res.player.id;
        setPlayerId(newId);
        localStorage.setItem('me_player_id', newId);
        setGameState(res);
        setHistory(prev => [...prev, `[SYSTEM] Operator ${name} authenticated.`, res.message]);
    };

    const handleRegister = async (name: string) => {
        const res = await axios.post(`http://localhost:8000/api/v1/start?name=${name}`);
        const newId = res.data.player.id;
        setPlayerId(newId);
        localStorage.setItem('me_player_id', newId);
        setGameState(res.data);
        setHistory(prev => [...prev, `[SYSTEM] New Identity Registered: ${name}.`, res.data.message]);
    };

    const handleLogout = () => {
        localStorage.removeItem('me_player_id');
        setPlayerId('');
        setGameState(null);
        setHistory(["Session terminated. Awaiting new connection..."]);
    };

    const handleCommand = useCallback(async (cmd: string) => {
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
        } catch {
            setHistory(prev => [...prev, "Error: Failed to send command."]);
        }
    }, [playerId]);

    const executeAction = useCallback(async (actionName: string, actionFn: () => Promise<CommandResponse>) => {
        if (!playerId) return;
        try {
            setHistory(prev => [...prev, `> ${actionName}`]);
            const res = await actionFn();
            setGameState(res);
            const logEntries = [res.message];
            if (res.location && res.location.description) {
                logEntries.push(res.location.description);
            }
            setHistory(prev => [...prev, ...logEntries]);
        } catch {
            setHistory(prev => [...prev, `Error: Failed to execute ${actionName}.`]);
        }
    }, [playerId]);

    const handleEquip = useCallback((itemName: string) => {
        executeAction(`equip ${itemName}`, () => actionEquip(playerId, itemName));
    }, [playerId, executeAction]);

    const handleUnequip = useCallback((slot: string) => {
        executeAction(`unequip ${slot}`, () => actionUnequip(playerId, slot));
    }, [playerId, executeAction]);

    const handleDrop = useCallback((itemName: string) => {
        executeAction(`drop ${itemName}`, () => actionDrop(playerId, itemName));
    }, [playerId, executeAction]);

    const handleScout = useCallback(() => {
        executeAction(`scout`, () => actionScout(playerId));
    }, [playerId, executeAction]);

    return {
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
        handleScout
    };
};
