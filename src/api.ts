import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
}

export interface CommandHelp {
    command: string;
    alias?: string;
    description: string;
    usage: string;
    category: string;
}

// -------------------------------------------------------------
// Authentication & Core API Calls
// -------------------------------------------------------------

export const sendCommand = async (playerId: string, command: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/command`, {
        player_id: playerId,
        command: command
    });
    return response.data;
};

export const loginPlayer = async (name: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/login`, { name });
    return response.data;
};

export const registerPlayer = async (name: string, characterClass?: string): Promise<CommandResponse> => {
    const params = new URLSearchParams({ name });
    if (characterClass) {
        params.append('character_class', characterClass);
    }
    const response = await axios.post(`${API_URL}/start?${params.toString()}`);
    return response.data;
};

export const getPlayerInventory = async (playerId: string): Promise<GameItem[]> => {
    const response = await axios.post(`${API_URL}/player/inventory`, {
        player_id: playerId
    });
    return response.data;
};

export const getCommands = async (): Promise<CommandHelp[]> => {
    const response = await axios.get(`${API_URL}/commands`);
    return response.data;
};

// -------------------------------------------------------------
// Core Game Actions
// -------------------------------------------------------------

export const actionMove = async (playerId: string, direction: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/move`, {
        player_id: playerId,
        direction
    });
    return response.data;
};

export const actionTake = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/take`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionDrop = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/drop`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionEquip = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/equip`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionUnequip = async (playerId: string, slot: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/unequip`, {
        player_id: playerId,
        slot
    });
    return response.data;
};

export const actionAttack = async (playerId: string, targetName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/attack`, {
        player_id: playerId,
        target_name: targetName
    });
    return response.data;
};

export const actionScout = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/scout`, {
        player_id: playerId
    });
    return response.data;
};

export const actionCamp = async (playerId: string, campName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/camp`, {
        player_id: playerId,
        camp_name: campName
    });
    return response.data;
};

export const actionTravel = async (playerId: string, waypointName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/travel`, {
        player_id: playerId,
        waypoint_name: waypointName
    });
    return response.data;
};

export const actionStore = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/store`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionRetrieve = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/retrieve`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionConsume = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/consume`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionFill = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/fill`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionRest = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/command`, {
        player_id: playerId,
        command: "rest"
    });
    return response.data;
};

// -------------------------------------------------------------
// NPC Dialogue & Trading Endpoints
// -------------------------------------------------------------

export const actionTalk = async (playerId: string, npcName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/talk`, {
        player_id: playerId,
        npc_name: npcName
    });
    return response.data;
};

export const actionDialogue = async (playerId: string, choice: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/dialogue`, {
        player_id: playerId,
        choice
    });
    return response.data;
};

export const actionEndDialogue = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/dialogue/end`, {
        player_id: playerId
    });
    return response.data;
};

export const actionBuy = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/buy`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

export const actionSell = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/sell`, {
        player_id: playerId,
        item_name: itemName
    });
    return response.data;
};

// -------------------------------------------------------------
// Quests & Objectives
// -------------------------------------------------------------

export const actionQuests = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/quests`, {
        player_id: playerId
    });
    return response.data;
};

export const actionQuestTurnIn = async (playerId: string, questId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/quest/turnin`, {
        player_id: playerId,
        quest_id: questId
    });
    return response.data;
};

// -------------------------------------------------------------
// Classes & Skills
// -------------------------------------------------------------

export const actionSelectClass = async (playerId: string, characterClass: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/class`, {
        player_id: playerId,
        character_class: characterClass
    });
    return response.data;
};

export const actionUseSkill = async (playerId: string, skillName: string, targetName?: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/skill`, {
        player_id: playerId,
        skill_name: skillName,
        target_name: targetName
    });
    return response.data;
};

export const actionGetSkills = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/skills`, {
        player_id: playerId
    });
    return response.data;
};

// -------------------------------------------------------------
// Crafting & Recipes
// -------------------------------------------------------------

export const actionCraft = async (playerId: string, recipeName: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/craft`, {
        player_id: playerId,
        recipe_name: recipeName
    });
    return response.data;
};

export const actionGetRecipes = async (playerId: string): Promise<CommandResponse> => {
    const response = await axios.post(`${API_URL}/action/recipes`, {
        player_id: playerId
    });
    return response.data;
};
