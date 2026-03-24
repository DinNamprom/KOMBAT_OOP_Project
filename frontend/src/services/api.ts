const API_BASE_URL = 'http://localhost:8080';

export interface CreateModeConfig {
    mode: string;
    config: string;
}

export interface CreateMinion {
    name: string;
    hp: number;
    spawncost: number;
    def: number;
    strategy: string;
}

export interface BuyGrid {
    gameID: string;
    playerID: string;
    row: number;
    col: number;
}

export interface SpawnMinion {
    gameID: string;
    playerID: string;
    kind: string;
    row: number;
    col: number;
}

export interface GridPosition {
    row: number;
    col: number;
}

export const api = {
    // Game Management
    createGame: async (modeConfig: CreateModeConfig): Promise<string> => {
        const response = await fetch(`${API_BASE_URL}/game/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(modeConfig),
        });
        return response.text();
    },

    joinPlayer: async (gameID: string, playerID: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/game/${gameID}/player?playerID=${encodeURIComponent(playerID)}`, {
            method: 'POST',
        });
        return response.json();
    },

    createMinionKind: async (gameID: string, minion: CreateMinion): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/game/${gameID}/minion-kind`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(minion),
        });
        return response.json();
    },

    startGame: async (gameID: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/game/${gameID}/start`, {
            method: 'POST',
        });
        return response.json();
    },

    getGameStat: async (gameID: string): Promise<any> => {
        const response = await fetch(`${API_BASE_URL}/game/${gameID}/stat`);
        return response.json();
    },

    getBuyableGrids: async (gameID: string, playerID: string): Promise<GridPosition[]> => {
        const response = await fetch(`${API_BASE_URL}/game/${gameID}/${playerID}/buyable-grids`);
        return response.json();
    },

    getSpawnableGrids: async (gameID: string, playerID: string): Promise<GridPosition[]> => {
        const response = await fetch(`${API_BASE_URL}/game/${gameID}/${playerID}/spawnable-grids`);
        return response.json();
    },

    // Action Management
    buyGrid: async (buyGridData: BuyGrid): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/action/buy-grid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buyGridData),
        });
        return response.json();
    },

    spawnMinion: async (spawnMinionData: SpawnMinion): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/action/spawn-minion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spawnMinionData),
        });
        return response.json();
    },

    endTurn: async (gameID: string, playerID: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/action/endTurn/${gameID}/${playerID}`, {
            method: 'POST',
        });
        return response.json();
    },
};
