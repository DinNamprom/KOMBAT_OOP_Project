const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
    PlayerName: string;
    row: number;
    col: number;
}

export interface SpawnMinion {
    gameID: string;
    playerName: string;
    kind: string;
    row: number;
    col: number;
}

export interface GridPosition {
    row: number;
    col: number;
}

export interface Action {
    row: number;
    col: number;
    atk: boolean;
    target_owner: string | null;
    target_no: number;
    dmg: number;
}

export interface MinionAction {
    no: number;
    owner_uuid: string;
    actions: Action[];
}

export interface GridStatus {
    row: number;
    col: number;
    ownerID: string;
}

export interface MinionStatus {
    no: number;
    kindName: string;
    row: number;
    col: number;
    ownerID: string;
    hp: number;
}

export interface PlayerStatus {
    playerID: string;
    budget: number;
}

export interface GameStatus {
    gridStatusList: GridStatus[];
    minionStatusList: MinionStatus[];
    playerStatusList: PlayerStatus[];
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
        const response = await fetch(`${API_BASE_URL}/game/join/${gameID}?playerID=${encodeURIComponent(playerID)}`, {
            method: 'POST',
        });
        return response.json();
    },

    createMinionKind: async (gameID: string, minion: CreateMinion): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/game/minion-kind/${gameID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(minion),
        });
        return response.json();
    },

    checkStrategy: async (gameID: string, strategy: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/game/strategy/${gameID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ strategy }),
        });
        return response.json();
    },

    startGame: async (gameID: string): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/game/start/${gameID}`, {
            method: 'POST',
        });
        return response.json();
    },

    getGameStatus: async (gameID: string): Promise<GameStatus> => {
        const response = await fetch(`${API_BASE_URL}/game/status/${gameID}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch game status: ${response.statusText}`);
        }
        return response.json();
    },

    getBuyableGrids: async (gameID: string, playerID: string): Promise<GridPosition[]> => {
        const response = await fetch(`${API_BASE_URL}/game/buyable-grids/${gameID}/${playerID}`);
        return response.json();
    },

    getSpawnableGrids: async (gameID: string, playerID: string): Promise<GridPosition[]> => {
        const response = await fetch(`${API_BASE_URL}/game/spawnable-grids/${gameID}/${playerID}`);
        return response.json();
    },

    getMinionActions: async (gameID: string, playerID: string): Promise<MinionAction[]> => {
        const response = await fetch(`${API_BASE_URL}/game/actions/${gameID}/${playerID}`);
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
