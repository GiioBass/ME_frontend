import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

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
        inventory: any[];
        current_location_id: string;
    };
    location: {
        id: string;
        name: string;
        description: string;
        exits: Record<string, string>;
        items: any[];
        enemies: any[];
        coordinates?: {
            x: number;
            y: number;
            z: number;
        };
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
