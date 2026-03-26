export interface GameConfig {
    spawn_cost: number;
    hex_purchase_cost: number;
    init_budget: number;
    init_hp: number;
    turn_budget: number;
    max_budget: number;
    interest_pct: number;
    max_turns: number;
    max_spawns: number;
}

const DEFAULT_CONFIG: GameConfig = {
    spawn_cost: 100,
    hex_purchase_cost: 1000,
    init_budget: 10000,
    init_hp: 100,
    turn_budget: 100,
    max_budget: 50000,
    interest_pct: 5,
    max_turns: 50,
    max_spawns: 20
};

const STORAGE_KEY = 'gameConfig';

export const configService = {
    getDefaultConfig: (): GameConfig => ({ ...DEFAULT_CONFIG }),

    loadConfig: (): GameConfig => {
        const configText = localStorage.getItem(STORAGE_KEY);
        if (!configText) return DEFAULT_CONFIG;

        const config: Partial<GameConfig> = {};
        configText.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                config[key.trim() as keyof GameConfig] = Number(value.trim());
            }
        });

        // Ensure all required fields are present by merging with defaults
        return { ...DEFAULT_CONFIG, ...config };
    },

    saveConfig: (config: GameConfig): void => {
        const configText = Object.entries(config)
            .map(([k, v]) => `${k}=${v}`)
            .join('\n');
        localStorage.setItem(STORAGE_KEY, configText);
    },

    getConfigString: (config: GameConfig): string => {
        return Object.entries(config)
            .map(([k, v]) => `${k}=${v}`)
            .join('\n');
    }
};
