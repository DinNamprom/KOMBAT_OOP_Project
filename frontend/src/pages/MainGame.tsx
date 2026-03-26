import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';
import HexBoard from '../components/HexBoard';
import InitialCommandPanel from '../components/InitialCommandPanel';
import CommandPanel from '../components/CommandPanel';
import CommandPanelMinionShop from '../components/CommandPanelMinionShop';
import { api } from '../services/api';
import type { GridPosition, MinionAction } from '../services/api';
import { configService, type GameConfig } from '../services/configService';

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

// ==========================================
// Component
// ==========================================
const MainGame = () => {
    const navigate = useNavigate();
    
    // --- Config & Game IDs ---
    const [config] = useState<GameConfig>(() => configService.loadConfig());

    const [gameID] = useState(() => localStorage.getItem('gameID') || "");
    const [player1Data] = useState(() => {
        const data = localStorage.getItem('Player1');
        return data ? JSON.parse(data) : { id: "", type: "player" };
    });
    const [player2Data] = useState(() => {
        const data = localStorage.getItem('Player2');
        return data ? JSON.parse(data) : { id: "", type: "player" };
    });

    const player1ID = player1Data.id;
    const player2ID = player2Data.id;

    // --- Game Logic State ---
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [player1Gold, setPlayer1Gold] = useState(config.init_budget);
    const [player2Gold, setPlayer2Gold] = useState(config.init_budget);
    
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
    const [isProcessingActions, setIsProcessingActions] = useState(false);

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
    
    const updateGameStateFromStatus = useCallback(async () => {
        if (!gameID) return;
        try {
            const status = await api.getGameStatus(gameID);
            if (!status) return;

            // 1. Update Player Gold
            if (status.playerStatusList) {
                const p1Status = status.playerStatusList.find(p => p.playerID === player1ID);
                const p2Status = status.playerStatusList.find(p => p.playerID === player2ID);
                if (p1Status) setPlayer1Gold(p1Status.budget);
                if (p2Status) setPlayer2Gold(p2Status.budget);
            }

            // 2. Update Placed Units
            if (status.minionStatusList) {
                setPlacedUnits(prev => {
                    // Map backend minions to our PlacedUnit structure
                    return status.minionStatusList.map(ms => {
                    const cellId = `${ms.row - 1}-${ms.col - 1}`;
                    const pId: 1 | 2 = ms.ownerID === player1ID ? 1 : 2;
                    
                    // Try to find if we already have this unit (to preserve its visual unitId if possible)
                    const existing = prev.find(u => u.no === ms.no && u.playerId === pId);
                    
                    // Fallback unitId mapping if not found
                    let unitId = existing?.unitId || "";
                    if (!unitId) {
                        const nameToId: Record<string, string> = {
                            'RGM-79 GM': 'gm',
                            'ZAKU': 'zaku',
                            'Gundam': 'gundam',
                            'Red Comet': 'redcomet',
                            'Zeong': 'zeong'
                        };
                        unitId = nameToId[ms.kindName] || "gm";
                    }

                    return {
                        cellId,
                        unitId,
                        playerId: pId,
                        no: Number(ms.no)
                    };
                });
            });
            }

            // 3. Update Grids (Optional but good for consistency)
            if (status.gridStatusList) {
                const p1Grids = status.gridStatusList
                    .filter(g => g.ownerID === player1ID)
                    .map(g => `${g.row - 1}-${g.col - 1}`);
                const p2Grids = status.gridStatusList
                    .filter(g => g.ownerID === player2ID)
                    .map(g => `${g.row - 1}-${g.col - 1}`);
                
                setPlayer1Grids(p1Grids);
                setPlayer2Grids(p2Grids);
                setSpawnableCells(currentPlayer === 1 ? p1Grids : p2Grids);
            }

        } catch (error) {
            console.error("Failed to update game state from status:", error);
        }
    }, [gameID, player1ID, player2ID, currentPlayer]);

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

    // Polling effect: fetch game state every 2 seconds UNLESS actions are processing
    useEffect(() => {
        if (!gameID || isProcessingActions) return;

//         const interval = setInterval(() => {
//             updateGameStateFromStatus();
//         }, 2000);

//         return () => clearInterval(interval);
    }, [gameID, isProcessingActions, updateGameStateFromStatus]);

    const processMinionActions = useCallback(async (playerActions: MinionAction[]) => {
        if (!playerActions || !Array.isArray(playerActions)) return;
        
        setIsProcessingActions(true);
        console.log("[ACTION] Starting to process player actions...", playerActions);

        try {
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
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
                console.log(`[ACTION] Finished actions for Minion #${no}`);
                // Extra delay 0.5s between different minions
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } finally {
            setIsProcessingActions(false);
            console.log("[ACTION] All player actions processed.");
        }
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
                'char5': 'Zeong',
                // Also support IDs from CommandPanelMinionShop
                'gm': 'RGM-79 GM',
                'zaku': 'ZAKU',
                'gundam': 'Gundam',
                'redcomet': 'Red Comet',
                'zeong': 'Zeong'
            };

            const minionKindName = minionData?.customName || defaultNames[unitId] || unitId.toUpperCase();
            const spawnCost = currentTurn === 0 ? 0 : (minionData?.stats?.spawnCost || config.spawn_cost);

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
        [gameID, player1ID, player2ID, currentTurn, goldAmount, p1SpawnCount, p2SpawnCount, config.spawn_cost]
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
                if (currentPlayer === 1) setPlayer1Gold(prev => prev - config.hex_purchase_cost);
                else setPlayer2Gold(prev => prev - config.hex_purchase_cost);
                fetchAllGrids();
            }
        } catch (error) {
            console.error("Error buying grid:", error);
        }
    }, [gameID, currentPlayer, currentPlayerID, config.hex_purchase_cost, fetchAllGrids]);

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
        if (goldAmount < config.hex_purchase_cost) {
            alert("Not enough gold!");
            return;
        }
        setIsBuyingGrid(true);
        fetchBuyableGridsAPI();
    }, [goldAmount, config.hex_purchase_cost, fetchBuyableGridsAPI]);

    const handleSkipTurn = useCallback(async () => {
        await updateGameStateFromStatus();
        setIsBuyingGrid(false);
        setBuyableCells([]);
        
        if (turnSubPhase === 'BUY_GRID') {
            setTurnSubPhase('SPAWN_MINION');
            await updateGameStateFromStatus();
        } else {
            try {
                const isGameOver = await api.endTurn(gameID, currentPlayerID);
                
                // Fetch and process actions for the current player
                const actions = await api.getMinionActions(gameID, currentPlayerID);
                await processMinionActions(actions);
                await updateGameStateFromStatus();
                if (isGameOver) {
                    alert("Game Over!");
                    navigate('/');
                } else {
                    if (currentPlayer === 1) {
                        setCurrentPlayer(2);
                    } else {
                        setCurrentTurn(prev => prev + 1);
                        setCurrentPlayer(1);
                    }
                    setTurnSubPhase('BUY_GRID');
                }
            } catch (error) {
                console.error("Error ending turn:", error);
            }
        }
    }, [gameID, currentPlayer, currentPlayerID, turnSubPhase, config, navigate, processMinionActions, updateGameStateFromStatus]);

    // --- Automatic Bot Turn Handling ---
    useEffect(() => {
        if (isProcessingActions) return;

        const isBot = (currentPlayer === 1 ? player1Data.type : player2Data.type) === 'bot';
        if (isBot) {

            const timer = setTimeout(async () => {
                if (currentTurn === 0) {
                    if (currentPlayer === 1) {
                        const isGameOver = await api.endTurn(gameID, currentPlayerID);

                                        // Fetch and process actions for the current player
                                        const actions = await api.getMinionActions(gameID, currentPlayerID);
                                        await processMinionActions(actions);

                                        // Update authoritative state from Backend
                                        await updateGameStateFromStatus();
                        setCurrentPlayer(2);
                    } else {

                        const isGameOver = await api.endTurn(gameID, currentPlayerID);

                        // Fetch and process actions for the current player
                        const actions = await api.getMinionActions(gameID, currentPlayerID);
                        await processMinionActions(actions);

                        // Update authoritative state from Backend
                        await updateGameStateFromStatus();
                        setCurrentPlayer(1);
                        setCurrentTurn(1);
                        setTurnSubPhase('BUY_GRID');
                    }
                } else {
                    await handleSkipTurn();
//                     await handleSkipTurn();
                }
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [currentPlayer, currentTurn, turnSubPhase, isProcessingActions, player1Data.type, player2Data.type, handleSkipTurn]);

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
            {/* Action Processing Overlay: blocks all pointer events */}
            {isProcessingActions && (
                <div className="absolute inset-0 z-[9999] cursor-wait bg-black/10 flex items-center justify-center">
                    <div className="bg-black/60 text-white px-6 py-3 rounded-xl font-handjet text-2xl animate-pulse border border-white/20">
                        EXECUTING STRATEGIES...
                    </div>
                </div>
            )}

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
                            maxUnits={config.max_spawns}
                            onSelectUnit={handleSelectUnit}
                        />
                    )}

                    {currentTurn >= 1 && turnSubPhase === 'BUY_GRID' && (
                        <CommandPanel
                            currentTurn={currentTurn}
                            maxTurns={config.max_turns}
                            currentPlayer={currentPlayer}
                            goldAmount={goldAmount}
                            gridCost={config.hex_purchase_cost}
                            currentUnits={currentUnitsCount}
                            maxUnits={config.max_spawns}
                            onBuyGrid={handleBuyGrid}
                            onSkipTurn={handleSkipTurn}
                        />
                    )}

                    {currentTurn >= 1 && turnSubPhase === 'SPAWN_MINION' && (
                        <CommandPanelMinionShop
                            currentPlayer={currentPlayer}
                            currentTurn={currentTurn}
                            maxTurn={config.max_turns}
                            goldAmount={goldAmount}
                            currentUnits={currentUnitsCount}
                            maxUnits={config.max_spawns}
                            onSelectUnit={handleSelectUnit}
                            onExecute={handleSkipTurn}
                        />
                    )}

                
                </div>
            </div>
        </div>
    );
};

export default MainGame;
