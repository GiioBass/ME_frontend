import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export interface GameItem {
    id?: string;
    name: string;
    description?: string;
    item_type?: string;
    qty?: number;
    bonus?: number;
}

export interface GameEnemy {
    id: string;
    name: string;
    hp: number;
    max_hp: number;
    attack: number;
}

export interface CommandResponse {
    message: string;
    player: {
        id: string;
        name: string;
        stats: {
            hp: number;
            max_hp: number;
            strength: number;
            xp: number;
        };
        inventory: (GameItem | string)[];
        weapon?: GameItem;
        armor?: GameItem;
        current_location_id: string;
    };
    location: {
        id: string;
        name: string;
        description: string;
        exits: Record<string, string>;
        items: GameItem[];
        enemies: GameEnemy[];
        coordinates?: {
            x: number;
            y: number;
            z: number;
        };
    };
    time: {
        total_ticks: number;
        day: number;
        hour: number;
        minute: number;
        is_night: boolean;
    };
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
