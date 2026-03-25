import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';
import HexBoard from '../components/HexBoard';
import InitialCommandPanel from '../components/InitialCommandPanel';
import CommandPanel from '../components/CommandPanel';
import { api } from '../services/api';
import type { GridPosition, MinionAction } from '../services/api';

// ==========================================
// Types
// ==========================================
interface PlacedUnit {
    cellId: string;
    unitId: string;
    playerId: 1 | 2;
    no: number;
}

type TurnSubPhase = 'BUY_GRID' | 'SPAWN_MINION' | null;

interface GameConfigValues {
    initSpawnCost: number;
    hexCost: number;
    initBudget: number;
    initHp: number;
    turnBudget: number;
    maxBudget: number;
    turnInterest: number;
    maxTurns: number;
    maxSpawns: number;
}

// ==========================================
// Helpers
// ==========================================

const parseConfig = (configData: string): GameConfigValues => {
    const lines = configData.split('\n');
    const props: Record<string, string> = {};
    lines.forEach(line => {
        if (!line.includes('=')) return;
        const [key, val] = line.split('=').map(s => s.trim());
        if (key && val) props[key] = val;
    });

    return {
        initSpawnCost: Number(props['spawn_cost']) || 100,
        hexCost: Number(props['hex_purchase_cost']) || 1000,
        initBudget: Number(props['init_budget']) || 10000,
        initHp: Number(props['init_hp']) || 100,
        turnBudget: Number(props['turn_budget']) || 100,
        maxBudget: Number(props['max_budget']) || 50000,
        turnInterest: Number(props['interest_pct']) || 5,
        maxTurns: Number(props['max_turns']) || 50,
        maxSpawns: Number(props['max_spawns']) || 20,
    };
};

// ==========================================
// Component
// ==========================================
const MainGame = () => {
    const navigate = useNavigate();
    
    // --- Config & Game IDs ---
    const [config] = useState<GameConfigValues>(() => {
        const savedConfig = localStorage.getItem('gameConfig') || "";
        return parseConfig(savedConfig);
    });

    const [gameID] = useState(() => localStorage.getItem('gameID') || "");
    const [player1ID] = useState(() => localStorage.getItem('Player1') || "");
    const [player2ID] = useState(() => localStorage.getItem('Player2') || "");

    // --- Game Logic State ---
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [player1Gold, setPlayer1Gold] = useState(config.initBudget);
    const [player2Gold, setPlayer2Gold] = useState(config.initBudget);
    
    // --- Phase State ---
    const [turnSubPhase, setTurnSubPhase] = useState<TurnSubPhase>(null);
    const [isBuyingGrid, setIsBuyingGrid] = useState(false);
    const [buyableCells, setBuyableCells] = useState<string[]>([]);

    // --- UI/Placement State ---
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [placedUnits, setPlacedUnits] = useState<PlacedUnit[]>([]);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);
    const [player1Grids, setPlayer1Grids] = useState<string[]>([]);
    const [player2Grids, setPlayer2Grids] = useState<string[]>([]);
    const [spawnableCells, setSpawnableCells] = useState<string[]>([]);

    // --- Spawn Counts (for assigning 'no') ---
    const [p1SpawnCount, setP1SpawnCount] = useState(0);
    const [p2SpawnCount, setP2SpawnCount] = useState(0);

    // --- Derived State ---
    const currentUnitsCount = placedUnits.filter((u) => u.playerId === currentPlayer).length;
    const goldAmount = currentPlayer === 1 ? player1Gold : player2Gold;
    const currentPlayerID = currentPlayer === 1 ? player1ID : player2ID;

    // ==========================================
    // API Calls
    // ==========================================
    
    const fetchAllGrids = useCallback(async () => {
        if (!gameID || !player1ID || !player2ID) return;
        try {
            const [p1Grids, p2Grids] = await Promise.all([
                api.getSpawnableGrids(gameID, player1ID),
                api.getSpawnableGrids(gameID, player2ID)
            ]);
            
            const mapToVisual = (g: GridPosition) => {
                return `${g.row - 1}-${g.col - 1}`;
            };

            const p1Ids = p1Grids.map(mapToVisual);
            const p2Ids = p2Grids.map(mapToVisual);
            
            setPlayer1Grids(p1Ids);
            setPlayer2Grids(p2Ids);
            
            // spawnableCells for the current player to highlight valid placement
            setSpawnableCells(currentPlayer === 1 ? p1Ids : p2Ids);
        } catch (error) {
            console.error("Failed to fetch grids:", error);
        }
    }, [gameID, player1ID, player2ID, currentPlayer]);

    useEffect(() => {
        fetchAllGrids();
    }, [fetchAllGrids, currentPlayer, currentTurn]);

    const processMinionActions = useCallback(async (playerActions: MinionAction[]) => {
        if (!playerActions || !Array.isArray(playerActions)) return;
        
        console.log("[ACTION] Starting to process player actions...", playerActions);

        // playerActions is List<MinionAction> from backend
        for (const minionActionResult of playerActions) {
            const { no, actions, owner_uuid } = minionActionResult;
            if (!actions || actions.length === 0) continue;

            console.log(`[ACTION] Processing Minion #${no} (Owner: ${owner_uuid})`);

            for (const action of actions) {
                // Backend: { row, col, isAtk, target_owner, target_no }
                const isAttack = action.atk !== undefined ? action.atk : (action as any).isAtk;
                if (!isAttack) {
                    const newCellId = `${action.row - 1}-${action.col - 1}`;
                    
                    setPlacedUnits(prev => {
                        const unit = prev.find(u => {
                            const unitOwnerID = u.playerId === 1 ? player1ID : player2ID;
                            return unitOwnerID === owner_uuid && u.no === no;
                        });

                        if (unit) {
                            console.log(`   -> MOVE Minion #${no}: from ${unit.cellId} to ${newCellId} (Board Pos: [${action.row}, ${action.col}])`);
                        } else {
                            console.log(`   -> MOVE Minion #${no}: Unit not found in placedUnits, setting to ${newCellId}`);
                        }

                        return prev.map(u => {
                            const unitOwnerID = u.playerId === 1 ? player1ID : player2ID;
                            if (unitOwnerID === owner_uuid && u.no === no) {
                                return { ...u, cellId: newCellId };
                            }
                            return u;
                        });
                    });
                } else {
                    console.log(`   -> ATK Minion #${no}: attacked at [${action.row}, ${action.col}] dmg ${action.dmg} target`);
                    console.log(action.target_owner != null ? `#${action.target_no}`:"miss");
                    alert(`-> ATK Minion #${no}: ATTACK ${action.dmg} Damage ${action.target_owner != null ? `hit #${action.target_no} owner ${action.target_owner}` : "miss"}`);
                }
                // Delay 1 second between actions
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            console.log(`[ACTION] Finished actions for Minion #${no}`);
            // Extra delay 0.5s between different minions
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log("[ACTION] All player actions processed.");
    }, [player1ID, player2ID]);

    const handleUnitPlacementToAPI = useCallback(
        async (cellId: string, unitId: string, playerId: 1 | 2) => {
            const [vRow, vCol] = cellId.split('-').map(Number);
            const col = vCol + 1;
            const row = vRow + 1;
            
            const pID = playerId === 1 ? player1ID : player2ID;
            
            const configuredMinions = JSON.parse(localStorage.getItem('configuredMinions') || '{}');
            const minionData = configuredMinions[unitId];
            
            // Map default names to match LoadingToMainGame fallback
            const defaultNames: Record<string, string> = {
                'char1': 'RGM-79 GM',
                'char2': 'ZAKU',
                'char3': 'Gundam',
                'char4': 'Red Comet',
                'char5': 'Zeong'
            };

            const minionKindName = minionData?.customName || defaultNames[unitId] || unitId.toUpperCase();
            const spawnCost = currentTurn === 0 ? 0 : (minionData?.stats?.spawnCost || 100);

            if (goldAmount < spawnCost) {
                alert("Not enough gold to spawn this minion!");
                return;
            }

            try {
                const success = await api.spawnMinion({
                    gameID,
                    playerName: pID,
                    kind: minionKindName,
                    row,
                    col
                });
                if (success) {
                    console.log(`[API] Player ${playerId} spawned "${minionKindName}" at [${row}, ${col}] (Visual: ${cellId})`);
                    if (playerId === 1) {
                        setPlayer1Gold(prev => prev - spawnCost);
                        const nextNo = p1SpawnCount + 1;
                        setP1SpawnCount(nextNo);
                        const newUnit: PlacedUnit = { cellId, unitId, playerId, no: nextNo };
                        setPlacedUnits((prev) => [...prev, newUnit]);
                    } else {
                        setPlayer2Gold(prev => prev - spawnCost);
                        const nextNo = p2SpawnCount + 1;
                        setP2SpawnCount(nextNo);
                        const newUnit: PlacedUnit = { cellId, unitId, playerId, no: nextNo };
                        setPlacedUnits((prev) => [...prev, newUnit]);
                    }
                } else {
                    alert("Spawn failed at Backend. Make sure the kind name exists and position is valid.");
                }
            } catch (error) {
                console.error("Error spawning minion:", error);
            }
        },
        [gameID, player1ID, player2ID, currentTurn, goldAmount, p1SpawnCount, p2SpawnCount]
    );

    const fetchBuyableGridsAPI = useCallback(async () => {
        try {
            const grids = await api.getBuyableGrids(gameID, currentPlayerID);
            const cellIds = grids.map((g: GridPosition) => {
                return `${g.row - 1}-${g.col - 1}`;
            });
            setBuyableCells(cellIds);
        } catch (error) {
            console.error("Failed to fetch buyable grids:", error);
        }
    }, [gameID, currentPlayerID]);

    const buyGridAPI = useCallback(async (cellId: string) => {
        const [vRow, vCol] = cellId.split('-').map(Number);
        const col = vCol + 1;
        const row = vRow + 1;

        try {
            const success = await api.buyGrid({
                gameID,
                PlayerName: currentPlayerID,
                row,
                col
            });
            if (success) {
                console.log(`[API] Player ${currentPlayer} bought grid at [${row}, ${col}] (Visual: ${cellId})`);
                if (currentPlayer === 1) setPlayer1Gold(prev => prev - config.hexCost);
                else setPlayer2Gold(prev => prev - config.hexCost);
                fetchAllGrids();
            }
        } catch (error) {
            console.error("Error buying grid:", error);
        }
    }, [gameID, currentPlayer, currentPlayerID, config.hexCost, fetchAllGrids]);

    // ==========================================
    // Handlers
    // ==========================================

    const handleSelectUnit = useCallback((unitId: string) => {
        if (currentTurn === 0 || turnSubPhase === 'SPAWN_MINION') {
            setSelectedUnit((prev) => (prev === unitId ? null : unitId));
        }
    }, [currentTurn, turnSubPhase]);

    const handleCellClick = useCallback((cellId: string) => {
        if (currentTurn === 0 || turnSubPhase === 'SPAWN_MINION') {
            if (!selectedUnit) return;
            
            if (!spawnableCells.includes(cellId)) {
                alert("You can only spawn minions on your own grids!");
                return;
            }

            if (placedUnits.some((u) => u.cellId === cellId)) {
                alert("This cell is already occupied!");
                return;
            }

            handleUnitPlacementToAPI(cellId, selectedUnit, currentPlayer);
            setSelectedUnit(null);

            if (currentTurn === 0) {
                if (currentPlayer === 1) {
                    setCurrentPlayer(2);
                } else {
                    setCurrentTurn(1);
                    setCurrentPlayer(1);
                    setTurnSubPhase('BUY_GRID');
                }
            }
            return;
        }

        if (turnSubPhase === 'BUY_GRID' && isBuyingGrid) {
            if (!buyableCells.includes(cellId)) return;
            buyGridAPI(cellId);
            setIsBuyingGrid(false);
            setBuyableCells([]);
            setTurnSubPhase('SPAWN_MINION');
            return;
        }
    }, [currentTurn, currentPlayer, selectedUnit, placedUnits, handleUnitPlacementToAPI, turnSubPhase, isBuyingGrid, buyableCells, buyGridAPI, spawnableCells]);

    const handleBuyGrid = useCallback(() => {
        if (goldAmount < config.hexCost) {
            alert("Not enough gold!");
            return;
        }
        setIsBuyingGrid(true);
        fetchBuyableGridsAPI();
    }, [goldAmount, config.hexCost, fetchBuyableGridsAPI]);

    const handleSkipTurn = useCallback(async () => {
        setIsBuyingGrid(false);
        setBuyableCells([]);
        
        if (turnSubPhase === 'BUY_GRID') {
            setTurnSubPhase('SPAWN_MINION');
        } else {
            try {
                const isGameOver = await api.endTurn(gameID, currentPlayerID);
                
                // Fetch and process actions for the current player
                const actions = await api.getMinionActions(gameID, currentPlayerID);
                await processMinionActions(actions);

                if (isGameOver) {
                    alert("Game Over!");
                    navigate('/');
                } else {
                    if (currentPlayer === 1) {
                        setPlayer1Gold(prev => {
                            const interest = Math.floor(prev * config.turnInterest / 100);
                            return Math.min(prev + interest + config.turnBudget, config.maxBudget);
                        });
                        setCurrentPlayer(2);
                    } else {
                        setPlayer2Gold(prev => {
                            const interest = Math.floor(prev * config.turnInterest / 100);
                            return Math.min(prev + interest + config.turnBudget, config.maxBudget);
                        });
                        setCurrentTurn(prev => prev + 1);
                        setCurrentPlayer(1);
                    }
                    setTurnSubPhase('BUY_GRID');
                }
            } catch (error) {
                console.error("Error ending turn:", error);
            }
        }
    }, [gameID, currentPlayer, currentPlayerID, turnSubPhase, config, navigate, processMinionActions]);

    const handleCellMouseEnter = useCallback((cellId: string) => setHoveredCell(cellId), []);
    const handleCellMouseLeave = useCallback(() => setHoveredCell(null), []);

    // ==========================================
    // Render
    // ==========================================
    return (
        <div
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden p-4 lg:p-8"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="flex flex-col xl:flex-row w-full max-w-[1600px] h-full items-center justify-center gap-10 xl:gap-20">
                <div className="w-full xl:w-auto flex justify-center items-center relative">
                    <HexBoard
                        gameID={gameID}
                        player1ID={player1ID}
                        player2ID={player2ID}
                        validPlacementCells={spawnableCells} 
                        placedUnits={placedUnits}
                        selectedUnit={selectedUnit}
                        hoveredCell={hoveredCell}
                        buyableCells={isBuyingGrid ? buyableCells : []}
                        player1Grids={player1Grids}
                        player2Grids={player2Grids}
                        onCellClick={handleCellClick}
                        onCellMouseEnter={handleCellMouseEnter}
                        onCellMouseLeave={handleCellMouseLeave}
                    />
                </div>

                <div className="w-full xl:w-auto flex justify-center items-center">
                    {currentTurn === 0 && (
                        <InitialCommandPanel
                            currentPlayer={currentPlayer}
                            goldAmount={goldAmount}
                            currentUnits={currentUnitsCount}
                            maxUnits={config.maxSpawns}
                            onSelectUnit={handleSelectUnit}
                        />
                    )}

                    {currentTurn >= 1 && turnSubPhase === 'BUY_GRID' && (
                        <CommandPanel
                            currentTurn={currentTurn}
                            maxTurns={config.maxTurns}
                            currentPlayer={currentPlayer}
                            goldAmount={goldAmount}
                            gridCost={config.hexCost}
                            currentUnits={currentUnitsCount}
                            maxUnits={config.maxSpawns}
                            onBuyGrid={handleBuyGrid}
                            onSkipTurn={handleSkipTurn}
                        />
                    )}

                    {currentTurn >= 1 && turnSubPhase === 'SPAWN_MINION' && (
                        <div className="w-full max-w-[500px] rounded-lg border border-white/30 bg-[#1A212F]/75 p-8 text-center flex flex-col gap-4">
                            <span className="text-white font-handjet font-bold text-2xl tracking-wider">
                                Player {currentPlayer} - Spawn Phase
                            </span>
                            <div className="flex flex-col gap-2">
                                <p className="text-gray-300">Select a unit from above (if any) and click your hex</p>
                                <div className="flex justify-center gap-4">
                                    <InitialCommandPanel
                                        currentPlayer={currentPlayer}
                                        goldAmount={goldAmount}
                                        currentUnits={currentUnitsCount}
                                        maxUnits={config.maxSpawns}
                                        onSelectUnit={handleSelectUnit}
                                    />
                                </div>
                            </div>
                            <button 
                                onClick={handleSkipTurn}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                End My Turn
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainGame;
