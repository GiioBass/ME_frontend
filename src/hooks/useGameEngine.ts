import { useState, useEffect, useCallback } from 'react';
import {
    sendCommand,
    getPlayerInventory,
    loginPlayer,
    registerPlayer,
    actionDrop,
    actionEquip,
    actionUnequip,
    actionScout,
    actionTravel,
    actionStore,
    actionRetrieve,
    actionConsume,
    actionFill,
    actionTalk,
    actionDialogue,
    actionEndDialogue,
    actionBuy,
    actionSell,
    actionQuests,
    actionQuestTurnIn,
    actionSelectClass,
    actionUseSkill,
    actionGetSkills,
    actionCraft,
    actionGetRecipes,
    type CommandResponse
} from '../api';

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
                    const inventory = await getPlayerInventory(storedId);
                    res.player.inventory = inventory;

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
                    localStorage.removeItem('me_game_history');
                    setPlayerId('');
                    setHistory(["Welcome to Mystic Explorers. Type 'start' or 'help' to connect."]);
                }
            }
            setIsCheckingSession(false);
        };
        initGame();
    }, []);

    const handleLogin = async (name: string) => {
        const res = await loginPlayer(name);
        const newId = res.player.id;
        const inventory = await getPlayerInventory(newId);
        res.player.inventory = inventory;

        setPlayerId(newId);
        localStorage.setItem('me_player_id', newId);
        setGameState(res);
        setHistory(prev => [...prev, `[SYSTEM] Operator ${name} authenticated.`, res.message]);
    };

    const handleRegister = async (name: string, characterClass?: string) => {
        const res = await registerPlayer(name, characterClass);
        const newId = res.player.id;
        const inventory = await getPlayerInventory(newId);
        res.player.inventory = inventory;

        setPlayerId(newId);
        localStorage.setItem('me_player_id', newId);
        setGameState(res);
        setHistory(prev => [
            ...prev,
            `[SYSTEM] New Identity Registered: ${name} [${characterClass || 'Adventurer'}].`,
            res.message
        ]);
    };

    const handleLogout = () => {
        localStorage.removeItem('me_player_id');
        setPlayerId('');
        setGameState(null);
        setHistory(["Session terminated. Awaiting new connection..."]);
    };

    const handleFetchInventory = useCallback(async () => {
        if (!playerId) return;
        try {
            const inventory = await getPlayerInventory(playerId);
            setGameState(prev => prev ? {
                ...prev,
                player: { ...prev.player, inventory }
            } : null);
        } catch (e) {
            console.error("Failed to fetch inventory", e);
        }
    }, [playerId]);

    const executeAction = useCallback(async (
        actionName: string,
        actionFn: () => Promise<CommandResponse>,
        refreshInventory = false
    ) => {
        if (!playerId) return null;
        try {
            if (actionName) {
                setHistory(prev => [...prev, `> ${actionName}`]);
            }
            const res = await actionFn();

            if (refreshInventory) {
                try {
                    const inventory = await getPlayerInventory(playerId);
                    res.player.inventory = inventory;
                } catch {
                    // ignore inventory fetch error
                }
            } else {
                setGameState(prev => {
                    if (prev?.player?.inventory) {
                        res.player.inventory = prev.player.inventory;
                    }
                    return res;
                });
            }

            setGameState(res);

            const logEntries = [res.message];
            if (res.location && res.location.description && !res.message.includes(res.location.description)) {
                logEntries.push(res.location.description);
            }
            setHistory(prev => [...prev, ...logEntries]);
            return res;
        } catch {
            setHistory(prev => [...prev, `Error: Failed to execute ${actionName}.`]);
            return null;
        }
    }, [playerId]);

    const handleCommand = useCallback(async (cmd: string) => {
        if (!cmd.trim()) return;
        if (cmd.toLowerCase() === 'clear') {
            setHistory(["Welcome to Mystic Explorers. Type 'start' or 'help' to connect."]);
            return;
        }
        await executeAction(cmd, () => sendCommand(playerId, cmd), true);
    }, [playerId, executeAction]);

    const handleEquip = useCallback((itemName: string) => {
        executeAction(`equip ${itemName}`, () => actionEquip(playerId, itemName), true);
    }, [playerId, executeAction]);

    const handleUnequip = useCallback((slot: string) => {
        executeAction(`unequip ${slot}`, () => actionUnequip(playerId, slot), true);
    }, [playerId, executeAction]);

    const handleDrop = useCallback((itemName: string) => {
        executeAction(`drop ${itemName}`, () => actionDrop(playerId, itemName), true);
    }, [playerId, executeAction]);

    const handleScout = useCallback(() => {
        executeAction(`scout`, () => actionScout(playerId));
    }, [playerId, executeAction]);

    const handleTravel = useCallback((waypointName: string) => {
        executeAction(`travel ${waypointName}`, () => actionTravel(playerId, waypointName), true);
    }, [playerId, executeAction]);

    const handleStore = useCallback((itemName: string) => {
        executeAction(`store ${itemName}`, () => actionStore(playerId, itemName), true);
    }, [playerId, executeAction]);

    const handleRetrieve = useCallback((itemName: string) => {
        executeAction(`retrieve ${itemName}`, () => actionRetrieve(playerId, itemName), true);
    }, [playerId, executeAction]);

    const handleConsume = useCallback((itemName: string) => {
        executeAction(`consume ${itemName}`, () => actionConsume(playerId, itemName), true);
    }, [playerId, executeAction]);

    const handleFill = useCallback((itemName: string) => {
        executeAction(`fill ${itemName}`, () => actionFill(playerId, itemName), true);
    }, [playerId, executeAction]);

    const handleDrink = useCallback(() => {
        handleCommand("drink");
    }, [handleCommand]);

    // NPC & Dialogue
    const handleTalk = useCallback((npcName: string) => {
        return executeAction(`talk ${npcName}`, () => actionTalk(playerId, npcName));
    }, [playerId, executeAction]);

    const handleDialogueChoice = useCallback((choice: string) => {
        return executeAction(`dialogue ${choice}`, () => actionDialogue(playerId, choice), true);
    }, [playerId, executeAction]);

    const handleEndDialogue = useCallback(() => {
        return executeAction(`end dialogue`, () => actionEndDialogue(playerId), true);
    }, [playerId, executeAction]);

    // Trade & Shop
    const handleBuy = useCallback((itemName: string) => {
        return executeAction(`buy ${itemName}`, () => actionBuy(playerId, itemName), true);
    }, [playerId, executeAction]);

    const handleSell = useCallback((itemName: string) => {
        return executeAction(`sell ${itemName}`, () => actionSell(playerId, itemName), true);
    }, [playerId, executeAction]);

    // Quests
    const handleQuests = useCallback(() => {
        return executeAction(`quests`, () => actionQuests(playerId));
    }, [playerId, executeAction]);

    const handleQuestTurnIn = useCallback((questId: string) => {
        return executeAction(`turnin ${questId}`, () => actionQuestTurnIn(playerId, questId), true);
    }, [playerId, executeAction]);

    // Class & Skills
    const handleSelectClass = useCallback((characterClass: string) => {
        return executeAction(`class ${characterClass}`, () => actionSelectClass(playerId, characterClass));
    }, [playerId, executeAction]);

    const handleUseSkill = useCallback((skillName: string, targetName?: string) => {
        const cmdText = targetName ? `skill ${skillName} ${targetName}` : `skill ${skillName}`;
        return executeAction(cmdText, () => actionUseSkill(playerId, skillName, targetName), true);
    }, [playerId, executeAction]);

    const handleGetSkills = useCallback(() => {
        return executeAction(`skills`, () => actionGetSkills(playerId));
    }, [playerId, executeAction]);

    // Crafting
    const handleCraft = useCallback((recipeName: string) => {
        return executeAction(`craft ${recipeName}`, () => actionCraft(playerId, recipeName), true);
    }, [playerId, executeAction]);

    const handleGetRecipes = useCallback(() => {
        return executeAction(`recipes`, () => actionGetRecipes(playerId));
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
        handleQuests,
        handleQuestTurnIn,
        handleSelectClass,
        handleUseSkill,
        handleGetSkills,
        handleCraft,
        handleGetRecipes
    };
};
