import { useState, useCallback } from 'react';
import bgImage from '../assets/bg.svg';
import HexBoard from '../components/HexBoard';
import InitialCommandPanel from '../components/InitialCommandPanel';
import CommandPanel from '../components/CommandPanel';

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
    // --- Game State ---
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [goldAmount] = useState(INITIAL_GOLD);

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

    // โซนวางยูนิตของผู้เล่นปัจจุบัน
    const validPlacementCells = currentPlayer === 1
        ? PLAYER1_PLACEMENT_CELLS
        : PLAYER2_PLACEMENT_CELLS;

    // ==========================================
    // API Calls (Stubs)
    // ==========================================
    const handleUnitPlacementToAPI = useCallback(
        (cellId: string, unitId: string, playerId: 1 | 2) => {
            console.log(`[API] Player ${playerId} placed "${unitId}" at cell "${cellId}"`);
            // TODO: เรียก API
        },
        []
    );

    const fetchBuyableGridsAPI = useCallback(() => {
        // TODO: GET Buyable Grid from Spring Boot
        // Mock: คืนช่องที่สามารถซื้อได้
        const mockBuyable = ['2-1', '3-0', '3-1'];
        console.log('[API] Fetched buyable grids:', mockBuyable);
        setBuyableCells(mockBuyable);
    }, []);

    const buyGridAPI = useCallback((cellId: string) => {
        // TODO: PUT row/col to buy grid, then GET updated owned grids from Spring Boot
        console.log(`[API] Player ${currentPlayer} bought grid at cell "${cellId}"`);
    }, [currentPlayer]);

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

    const handleSkipTurn = useCallback(() => {
        setIsBuyingGrid(false);
        setBuyableCells([]);
        setTurnSubPhase('SPAWN_MINION');
    }, []);

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
                        <div className="w-full max-w-[500px] rounded-lg border border-white/30 bg-[#1A212F]/75 p-8 text-center">
                            <span className="text-white font-handjet font-bold text-2xl tracking-wider">
                                Spawn Minion Phase (CommandPanel 2)
                            </span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MainGame;