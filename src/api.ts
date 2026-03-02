import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export interface GameItem {
    id?: string;
    name: string;
    description?: string;
    item_type?: string;
    qty?: number;
    bonus?: number;
    equip_slot?: string;
    is_light_source?: boolean;
}

export interface GameEnemy {
    id: string;
    name: string;
    hp: number;
    max_hp: number;
    attack: number;
}

export interface Equipment {
    weapon?: GameItem | null;
    armor?: GameItem | null;
}

export interface CommandResponse {
    message: string;
    player: {
        id: string;
        name: string;
        stats: {
            hp: number;
            max_hp: number;
            hunger: number;
            thirst: number;
            strength: number;
            xp: number;
            max_weight: number;
        };
        current_weight: number;
        waypoints: Record<string, string>;
        inventory: GameItem[];
        equipment: Equipment;
        current_location_id: string;
    };
    location: {
        id: string;
        name: string;
        description: string;
        exits: Record<string, string>;
        items: GameItem[];
        camp_storage: GameItem[];
        enemies: GameEnemy[];
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
    scouted_locations?: {
        name: string;
        distance: number;
        direction: string;
    }[];
    available_actions?: string[];
}

export const sendCommand = async (playerId: string, command: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/command`, {
            player_id: playerId,
            command: command
        });
        return response.data;
    } catch (error) {
        console.error("API Error", error);
        throw error;
    }
};

export const loginPlayer = async (name: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/login`, { name });
        return response.data;
    } catch (error) {
        console.error("API Login Error", error);
        throw error;
    }
};

export const actionDrop = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/drop`, {
            player_id: playerId,
            item_name: itemName
        });
        return response.data;
    } catch (error) {
        console.error("API Drop Error", error);
        throw error;
    }
};

export const actionEquip = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/equip`, {
            player_id: playerId,
            item_name: itemName
        });
        return response.data;
    } catch (error) {
        console.error("API Equip Error", error);
        throw error;
    }
};

export const actionUnequip = async (playerId: string, slot: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/unequip`, {
            player_id: playerId,
            slot: slot
        });
        return response.data;
    } catch (error) {
        console.error("API Unequip Error", error);
        throw error;
    }
};

export const actionScout = async (playerId: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/scout`, {
            player_id: playerId
        });
        return response.data;
    } catch (error) {
        console.error("API Scout Error", error);
        throw error;
    }
};

export const actionCamp = async (playerId: string, campName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/camp`, {
            player_id: playerId,
            camp_name: campName
        });
        return response.data;
    } catch (error) {
        console.error("API Camp Error", error);
        throw error;
    }
};

export const actionTravel = async (playerId: string, waypointName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/travel`, {
            player_id: playerId,
            waypoint_name: waypointName
        });
        return response.data;
    } catch (error) {
        console.error("API Travel Error", error);
        throw error;
    }
};

export const actionStore = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/store`, {
            player_id: playerId,
            item_name: itemName
        });
        return response.data;
    } catch (error) {
        console.error("API Store Error", error);
        throw error;
    }
};

export const actionRetrieve = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/retrieve`, {
            player_id: playerId,
            item_name: itemName
        });
        return response.data;
    } catch (error) {
        console.error("API Retrieve Error", error);
        throw error;
    }
};

export const actionConsume = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/consume`, {
            player_id: playerId,
            item_name: itemName
        });
        return response.data;
    } catch (error) {
        console.error("API Consume Error", error);
        throw error;
    }
};

export const actionFill = async (playerId: string, itemName: string): Promise<CommandResponse> => {
    try {
        const response = await axios.post(`${API_URL}/action/fill`, {
            player_id: playerId,
            item_name: itemName
        });
        return response.data;
    } catch (error) {
        console.error("API Fill Error", error);
        throw error;
    }
};
