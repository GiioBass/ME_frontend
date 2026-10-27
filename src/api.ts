import axios from 'axios';

export const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

export const getApiUrl = (): string => {
    const stored = localStorage.getItem('ME_API_URL');
    if (stored) return stored.trim().replace(/\/+$/, '');
    return DEFAULT_API_URL;
};

export const setApiUrl = (url: string): void => {
    const cleaned = url.trim().replace(/\/+$/, '');
    localStorage.setItem('ME_API_URL', cleaned);
};

export const resetApiUrl = (): void => {
    localStorage.removeItem('ME_API_URL');
};

export const testServerConnection = async (targetUrl?: string): Promise<{ success: boolean; message: string; latencyMs: number }> => {
    const url = (targetUrl || getApiUrl()).replace(/\/+$/, '');
    const startTime = Date.now();
    try {
        await axios.get(`${url}/commands`, { timeout: 3500 });
        const latency = Date.now() - startTime;
        return { success: true, message: `Conexión exitosa (${latency}ms)`, latencyMs: latency };
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            const latency = Date.now() - startTime;
            return { success: true, message: `Servidor respondió (${err.response.status}) en ${latency}ms`, latencyMs: latency };
        }
        return { success: false, message: 'No se pudo conectar al servidor. Revisa IP y puerto.', latencyMs: 0 };
    }
};

export const API_URL = getApiUrl();

export interface GameItem {
    id?: string;
    name: string;
    description?: string;
    item_type?: string;
    weight?: number;
    value?: number;
    qty?: number;
    bonus?: number;
    equip_slot?: string;
    is_light_source?: boolean;
    damage?: number;
    shield?: number;
    stat_bonuses?: Record<string, number>;
}

export interface GameEnemy {
    id: string;
    name: string;
    hp: number;
    max_hp: number;
    attack: number;
    defense?: number;
    xp_reward?: number;
    gold_reward?: number;
}

export interface Equipment {
    weapon?: GameItem | null;
    armor?: GameItem | null;
}

export interface PlayerStats {
    hp: number;
    max_hp: number;
    mp: number;
    max_mp: number;
    hunger: number;
    thirst: number;
    strength: number;
    base_strength?: number;
    defense?: number;
    base_defense?: number;
    agility?: number;
    intelligence?: number;
    level: number;
    xp: number;
    max_weight: number;
    gold: number;
    character_class: string;
}

export interface QuestReward {
    xp?: number;
    gold?: number;
    items?: Array<{ name: string; qty?: number } | string>;
}

export interface QuestObjective {
    id?: string;
    description?: string;
    objective_type?: 'kill' | 'gather' | 'talk' | 'explore' | 'craft' | 'discover' | string;
    type?: string;
    target: string;
    required_count: number;
    current_count: number;
}

export interface Quest {
    id: string;
    title: string;
    description: string;
    is_main_quest?: boolean;
    giver_npc_id?: string;
    turn_in_npc_id?: string;
    objectives: QuestObjective[];
    reward?: QuestReward;
    reward_xp?: number;
    reward_gold?: number;
    reward_items?: any[];
    status?: 'not_started' | 'active' | 'completed' | 'turned_in' | string;
}

export interface Skill {
    id: string;
    name: string;
    character_class: string;
    mp_cost: number;
    cooldown: number;
    damage?: number;
    heal_amount?: number;
    defense_buff?: number;
    description: string;
    target_type?: 'enemy' | 'self' | 'none';
}

export interface DialogueOption {
    id: string;
    text: string;
    next_node?: string;
    action?: string;
}

export interface ActiveDialogue {
    npc_id: string;
    npc_name: string;
    node_id: string;
    text?: string;
    options?: DialogueOption[];
}

export interface NPCInfo {
    id: string;
    name: string;
    role: string;
    description?: string;
    shop_items?: Array<{ name: string; price: number }>;
}

export interface Recipe {
    name: string;
    description?: string;
    workstation: string;
    required_items: Record<string, number>;
    result_item: string;
    result_qty: number;
}

export interface ScoutedLocation {
    name: string;
    distance: number;
    direction: string;
    dx?: number;
    dy?: number;
    x?: number;
    y?: number;
    z?: number;
    type?: 'cave' | 'water' | 'town' | 'poi' | 'landmark' | string;
}

export interface CommandResponse {
    message: string;
    player: {
        id: string;
        name: string;
        stats: PlayerStats;
        current_weight: number;
        waypoints: Record<string, string>;
        inventory?: GameItem[];
        equipment: Equipment;
        current_location_id: string;
        active_quests?: Record<string, Quest>;
        completed_quests?: string[];
        skills?: string[];
        skill_cooldowns?: Record<string, number>;
        active_dialogue?: ActiveDialogue | null;
    };
    location: {
        id: string;
        name: string;
        description: string;
        exits: Record<string, string>;
        items: GameItem[];
        camp_storage: GameItem[];
        enemies: GameEnemy[];
        interactables?: string[];
        npcs?: any[];
        coordinates?: {
            x: number;
            y: number;
            z: number;
        };
        is_dark?: boolean;
        present_players?: Array<{ id: string; name: string; character_class: string }>;
    };
    time: {
        total_ticks: number;
        day: number;
        hour: number;
        minute: number;
        is_night: boolean;
    };
    scouted_locations?: ScoutedLocation[];
    available_actions?: string[];
    token?: string;
}

export interface CommandHelp {
    command: string;
    alias?: string;
    description: string;
    usage: string;
    category: string;
}

// -------------------------------------------------------------
// Authentication & Session Management
// -------------------------------------------------------------

export const getSessionToken = (): string | null => 
    sessionStorage.getItem('me_session_token') || localStorage.getItem('me_session_token');

export const setSessionToken = (token: string): void => {
    sessionStorage.setItem('me_session_token', token);
    localStorage.setItem('me_session_token', token);
};

export const clearSessionToken = (): void => {
    sessionStorage.removeItem('me_session_token');
    localStorage.removeItem('me_session_token');
};

export const getWebSocketUrl = (playerId: string, token?: string): string => {
    let wsBase: string;
    if (import.meta.env.VITE_WS_URL) {
        wsBase = import.meta.env.VITE_WS_URL;
    } else {
        const currentApiUrl = getApiUrl();
        try {
            const parsed = new URL(currentApiUrl.startsWith('http') ? currentApiUrl : `http://${currentApiUrl}`);
            const isSecure = parsed.protocol === 'https:';
            const proto = isSecure ? 'wss:' : 'ws:';
            const host = parsed.host; // includes IP and port e.g. 192.168.1.15:8001
            wsBase = `${proto}//${host}/ws/game`;
        } catch {
            wsBase = 'ws://localhost:8001/ws/game';
        }
    }
    const params = new URLSearchParams();
    if (token) params.append('token', token);
    if (playerId) params.append('player_id', playerId);
    return `${wsBase}?${params.toString()}`;
};

export const sendCommand = async (playerId: string, command: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/command`, {
        player_id: playerId,
        command: command
    });
    return response.data;
};

export const loginPlayer = async (name: string, password?: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/auth/login`, { name, password });
    if (response.data.token) {
        setSessionToken(response.data.token);
    }
    return response.data;
};

export const registerPlayer = async (name: string, characterClass?: string, password?: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/auth/register`, {
        name,
        password,
        character_class: characterClass || 'adventurer'
    });
    if (response.data.token) {
        setSessionToken(response.data.token);
    }
    return response.data;
};

export const getPlayerInventory = async (playerId: string): Promise<GameItem[]> => {
    const response = await axios.post(`${getApiUrl()}/player/inventory`, {
        player_id: playerId
    });
    return response.data;
};

export const getCommands = async (): Promise<CommandHelp[]> => {
    const response = await axios.get(`${getApiUrl()}/commands`);
    return response.data;
};

// -------------------------------------------------------------
// Core Game Actions
// -------------------------------------------------------------

export const actionMove = async (playerId: string, direction: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/move`, {
        player_id: playerId,
        direction
    });
    return response.data;
};

export const actionTake = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/take`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionDrop = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/drop`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionEquip = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/equip`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionUnequip = async (playerId: string, slot: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/unequip`, {
        player_id: playerId,
        slot
    });
    return response.data;
};

export const actionAttack = async (playerId: string, targetName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/attack`, {
        player_id: playerId,
        target_name: targetName
    });
    return response.data;
};

export const actionScout = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/scout`, {
        player_id: playerId
    });
    return response.data;
};

export const actionCamp = async (playerId: string, campName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/camp`, {
        player_id: playerId,
        camp_name: campName
    });
    return response.data;
};

export const actionTravel = async (playerId: string, waypointName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/travel`, {
        player_id: playerId,
        waypoint_name: waypointName
    });
    return response.data;
};

export const actionStore = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/store`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionRetrieve = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/retrieve`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionConsume = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/consume`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionFill = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/fill`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionRest = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/command`, {
        player_id: playerId,
        command: "rest"
    });
    return response.data;
};

// -------------------------------------------------------------
// NPC Dialogue & Trading Endpoints
// -------------------------------------------------------------

export const actionTalk = async (playerId: string, npcName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/talk`, {
        player_id: playerId,
        npc_name: npcName
    });
    return response.data;
};

export const actionDialogue = async (playerId: string, choice: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/dialogue`, {
        player_id: playerId,
        choice
    });
    return response.data;
};

export const actionEndDialogue = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/dialogue/end`, {
        player_id: playerId
    });
    return response.data;
};

export const actionBuy = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/buy`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionSell = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/sell`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

// -------------------------------------------------------------
// Quests & Objectives
// -------------------------------------------------------------

export const actionQuests = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/quests`, {
        player_id: playerId
    });
    return response.data;
};

export const actionQuestTurnIn = async (playerId: string, questId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/quest/turnin`, {
        player_id: playerId,
        quest_id: questId
    });
    return response.data;
};

// -------------------------------------------------------------
// Classes & Skills
// -------------------------------------------------------------

export const actionSelectClass = async (playerId: string, characterClass: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/class`, {
        player_id: playerId,
        character_class: characterClass
    });
    return response.data;
};

export const actionUseSkill = async (playerId: string, skillName: string, targetName?: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/skill`, {
        player_id: playerId,
        skill_name: skillName,
        target_name: targetName
    });
    return response.data;
};

export const actionGetSkills = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/skills`, {
        player_id: playerId
    });
    return response.data;
};

// -------------------------------------------------------------
// Crafting & Recipes
// -------------------------------------------------------------

export const actionCraft = async (playerId: string, recipeName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/craft`, {
        player_id: playerId,
        recipe_name: recipeName
    });
    return response.data;
};

export const actionGetRecipes = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${getApiUrl()}/action/recipes`, {
        player_id: playerId
    });
    return response.data;
};
