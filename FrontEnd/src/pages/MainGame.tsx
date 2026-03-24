import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';
import HexBoard from '../components/HexBoard';
import InitialCommandPanel from '../components/InitialCommandPanel';
import CommandPanel from '../components/CommandPanel';
import { api } from '../services/api';
import type { GridPosition } from '../services/api';

// ==========================================
// Types
// ==========================================
interface PlacedUnit {
    cellId: string;
    unitId: string;
    playerId: 1 | 2;
}

type TurnSubPhase = 'BUY_GRID' | 'SPAWN_MINION' | null;

// ==========================================
// Constants
// ==========================================

// Player 2 = Red = ฝั่งซ้าย (left side of the grid)
const PLAYER2_PLACEMENT_CELLS: string[] = [
    '0-0', '0-1', '1-0', '1-1', '2-0',
];

// Player 1 = Blue = ฝั่งขวา (right side of the grid)
const PLAYER1_PLACEMENT_CELLS: string[] = [
    '5-7', '6-6', '6-7', '7-6', '7-7',
];

const MAX_UNITS = 20;
const INITIAL_GOLD = 1000;
const GRID_COST = 1000;
const MAX_TURNS = 50;

// ==========================================
// Component
// ==========================================
const MainGame = () => {
    const navigate = useNavigate();
    // --- Game State ---
    const [gameID] = useState(() => localStorage.getItem('gameID') || "");
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [goldAmount, setGoldAmount] = useState(INITIAL_GOLD);
    const [gameStat, setGameStat] = useState<any>(null);

    // --- Sub-Phase State (Turn 1+) ---
    const [turnSubPhase, setTurnSubPhase] = useState<TurnSubPhase>(null);
    const [isBuyingGrid, setIsBuyingGrid] = useState(false);
    const [buyableCells, setBuyableCells] = useState<string[]>([]);

    // --- Placement State ---
    const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
    const [placedUnits, setPlacedUnits] = useState<PlacedUnit[]>([]);
    const [hoveredCell, setHoveredCell] = useState<string | null>(null);

    // --- Derived State ---
    const currentUnits = placedUnits.filter((u) => u.playerId === currentPlayer).length;
    const currentPlayerName = currentPlayer === 1 ? "Player 1" : "Player 2";

    // โซนวางยูนิตของผู้เล่นปัจจุบัน
    const validPlacementCells = currentPlayer === 1
        ? PLAYER1_PLACEMENT_CELLS
        : PLAYER2_PLACEMENT_CELLS;

    // ==========================================
    // API Calls
    // ==========================================
    const fetchGameStat = useCallback(async () => {
        if (!gameID) return;
        try {
            const stat = await api.getGameStat(gameID);
            setGameStat(stat);
            
            // Sync gold amount and turn if needed
            const player = stat.playerList[currentPlayerName];
            if (player) {
                setGoldAmount(player.budget);
            }
            // Backend current_turn starts at 1. Our Turn 0 is placement.
            // If backend is at 1, but we are still in placement, we stay at 0 until all placed.
        } catch (error) {
            console.error("Failed to fetch game stat:", error);
        }
    }, [gameID, currentPlayerName]);

//     useEffect(() => {
//         fetchGameStat();
//         // Periodically refresh stat
//         const interval = setInterval(fetchGameStat, 3000);
//         return () => clearInterval(interval);
//     }, [fetchGameStat]);

    const handleUnitPlacementToAPI = useCallback(
        async (cellId: string, unitId: string, playerId: 1 | 2) => {
            const [row, col] = cellId.split('-').map(Number);
            const playerName = playerId === 1 ? "Player 1" : "Player 2";
            
            // We need to map unitId (like 'char1') to the actual minion kind name
            const configuredMinions = JSON.parse(localStorage.getItem('configuredMinions') || '{}');
            const minionKindName = configuredMinions[unitId]?.customName || unitId;

            try {
                const success = await api.spawnMinion({
                    gameID,
                    playerName,
                    kind: minionKindName,
                    row,
                    col
                });
                if (success) {
                    console.log(`[API] Player ${playerName} spawned "${minionKindName}" at [${row}, ${col}]`);
                    fetchGameStat();
                } else {
                    console.error("Failed to spawn minion via API");
                }
            } catch (error) {
                console.error("Error spawning minion:", error);
            }
        },
        [gameID, fetchGameStat]
    );

    const fetchBuyableGridsAPI = useCallback(async () => {
        try {
            const grids = await api.getBuyableGrids(gameID, currentPlayerName);
            const cellIds = grids.map((g: GridPosition) => `${g.row}-${g.col}`);
            setBuyableCells(cellIds);
        } catch (error) {
            console.error("Failed to fetch buyable grids:", error);
        }
    }, [gameID, currentPlayerName]);

    const buyGridAPI = useCallback(async (cellId: string) => {
        const [row, col] = cellId.split('-').map(Number);
        try {
            const success = await api.buyGrid({
                gameID,
                playerName: currentPlayerName,
                row,
                col
            });
            if (success) {
                console.log(`[API] Player ${currentPlayerName} bought grid at [${row}, ${col}]`);
                fetchGameStat();
            }
        } catch (error) {
            console.error("Error buying grid:", error);
        }
    }, [gameID, currentPlayerName, fetchGameStat]);

    // ==========================================
    // Handlers
    // ==========================================

    // เลือกยูนิตจาก InitialCommandPanel
    const handleSelectUnit = useCallback((unitId: string) => {
        // อนุญาตเฉพาะ Turn 0
        if (currentTurn !== 0) return;
        setSelectedUnit((prev) => (prev === unitId ? null : unitId));
    }, [currentTurn]);

    // คลิกที่ช่อง Hex
    const handleCellClick = useCallback((cellId: string) => {
        // ===== Turn 0: วาง Initial Minion =====
        if (currentTurn === 0) {
            if (!selectedUnit) return;

            const allowedCells = currentPlayer === 1
                ? PLAYER1_PLACEMENT_CELLS
                : PLAYER2_PLACEMENT_CELLS;
            if (!allowedCells.includes(cellId)) return;

            const isOccupied = placedUnits.some((u) => u.cellId === cellId);
            if (isOccupied) return;

            const newUnit: PlacedUnit = { cellId, unitId: selectedUnit, playerId: currentPlayer };
            setPlacedUnits((prev) => [...prev, newUnit]);
            handleUnitPlacementToAPI(cellId, selectedUnit, currentPlayer);
            setSelectedUnit(null);

            if (currentPlayer === 1) {
                setCurrentPlayer(2);
            } else {
                // จบ Turn 0 -> เข้า Turn 1, BUY_GRID phase
                setCurrentTurn(1);
                setCurrentPlayer(1);
                setTurnSubPhase('BUY_GRID');
            }
            return;
        }

        // ===== Turn 1+: BUY_GRID phase =====
        if (turnSubPhase === 'BUY_GRID' && isBuyingGrid) {
            if (!buyableCells.includes(cellId)) return;

            buyGridAPI(cellId);
            setIsBuyingGrid(false);
            setBuyableCells([]);
            setTurnSubPhase('SPAWN_MINION');
            return;
        }
    }, [currentTurn, currentPlayer, selectedUnit, placedUnits, handleUnitPlacementToAPI, turnSubPhase, isBuyingGrid, buyableCells, buyGridAPI]);

    // --- Buy Grid & Skip Handlers ---
    const handleBuyGrid = useCallback(() => {
        setIsBuyingGrid(true);
        fetchBuyableGridsAPI();
    }, [fetchBuyableGridsAPI]);

    const handleSkipTurn = useCallback(async () => {
        setIsBuyingGrid(false);
        setBuyableCells([]);
        
        if (turnSubPhase === 'BUY_GRID') {
            setTurnSubPhase('SPAWN_MINION');
        } else {
            // End turn phase
            try {
                const isGameOver = await api.endTurn(gameID, currentPlayerName);
                if (isGameOver) {
                    alert("Game Over!");
                    navigate('/');
                } else {
                    // Switch player
                    setCurrentPlayer(prev => prev === 1 ? 2 : 1);
                    setTurnSubPhase('BUY_GRID');
                    fetchGameStat();
                }
            } catch (error) {
                console.error("Error ending turn:", error);
            }
        }
    }, [gameID, currentPlayerName, turnSubPhase, fetchGameStat]);

    // --- Hover Handlers ---
    const handleCellMouseEnter = useCallback((cellId: string) => {
        setHoveredCell(cellId);
    }, []);

    const handleCellMouseLeave = useCallback(() => {
        setHoveredCell(null);
    }, []);

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
            {/* คอนเทนเนอร์หลัก จัดเรียงแบบ Flex ซ้าย-ขวา */}
            <div className="flex flex-col xl:flex-row w-full max-w-[1600px] h-full items-center justify-center gap-10 xl:gap-20">

                {/* ฝั่งซ้าย: ตาราง Hexagon Grid */}
                <div className="w-full xl:w-auto flex justify-center items-center relative">
                    <HexBoard
                        validPlacementCells={validPlacementCells}
                        placedUnits={placedUnits}
                        selectedUnit={selectedUnit}
                        hoveredCell={hoveredCell}
                        buyableCells={isBuyingGrid ? buyableCells : []}
                        onCellClick={handleCellClick}
                        onCellMouseEnter={handleCellMouseEnter}
                        onCellMouseLeave={handleCellMouseLeave}
                    />
                </div>

                {/* ฝั่งขวา: แผงควบคุมเกม (เปลี่ยนตาม Turn & SubPhase) */}
                <div className="w-full xl:w-auto flex justify-center items-center">
                    {currentTurn === 0 && (
                        <InitialCommandPanel
                            currentPlayer={currentPlayer}
                            goldAmount={goldAmount}
                            currentUnits={currentUnits}
                            maxUnits={MAX_UNITS}
                            onSelectUnit={handleSelectUnit}
                        />
                    )}

                    {currentTurn >= 1 && turnSubPhase === 'BUY_GRID' && (
                        <CommandPanel
                            currentTurn={currentTurn}
                            maxTurns={MAX_TURNS}
                            currentPlayer={currentPlayer}
                            goldAmount={goldAmount}
                            gridCost={GRID_COST}
                            currentUnits={currentUnits}
                            maxUnits={MAX_UNITS}
                            onBuyGrid={handleBuyGrid}
                            onSkipTurn={handleSkipTurn}
                        />
                    )}

                    {currentTurn >= 1 && turnSubPhase === 'SPAWN_MINION' && (
                        <div className="w-full max-w-[500px] rounded-lg border border-white/30 bg-[#1A212F]/75 p-8 text-center flex flex-col gap-4">
                            <span className="text-white font-handjet font-bold text-2xl tracking-wider">
                                Spawn Minion Phase
                            </span>
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