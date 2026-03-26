import {useState, useEffect, useMemo} from 'react';

import hexGray from '../assets/HexGray.svg';
import hexRed from '../assets/HexRed.svg';
import hexBlue from '../assets/HexBlue.svg';
import gmSprite from '../assets/GMSprite.svg';
import zakuSprite from '../assets/ZakuSprite.svg';
import gundamSprite from '../assets/GundamSprite.svg';
import redCometSprite from '../assets/RedCometSprite.svg';
import zeongSprite from '../assets/ZeongSprite.svg';

// ==========================================
// Types & Interfaces
// ==========================================
interface CharacterData {
    imgSrc: string;
}

interface PlacedUnit {
    cellId: string;
    unitId: string;
    playerId: 1 | 2;
    no?: number;
}

interface HexPieceProps {
    owner: 'red' | 'blue' | 'none' | string;
    character?: CharacterData | null;
    unitPlayerId?: 1 | 2 | null;
    isValidPlacement?: boolean;
    isBuyableCell?: boolean;
    isGhostPreview?: boolean;
    ghostImgSrc?: string | null;
}

interface HexData {
    id: string;
    col: number;
    row: number;
    owner: 'red' | 'blue' | 'none' | string;
    character?: CharacterData | null;
}

interface HexBoardProps {
    gameID?: string;
    player1ID?: string;
    player2ID?: string;
    validPlacementCells?: string[];
    placedUnits?: PlacedUnit[];
    selectedUnit?: string | null;
    hoveredCell?: string | null;
    buyableCells?: string[];
    player1Grids?: string[];
    player2Grids?: string[];
    onCellClick?: (cellId: string) => void;
    onCellMouseEnter?: (cellId: string) => void;
    onCellMouseLeave?: () => void;
}

// ==========================================
// Mapping: Backend Kind Name -> unitId
// ==========================================
const KIND_NAME_TO_ID: Record<string, string> = {
    'RGM-79 GM': 'char1',
    'ZAKU': 'char2',
    'Gundam': 'char3',
    'Red Comet': 'char4',
    'Zeong': 'char5',
};

// ==========================================
// Mapping: unitId -> sprite image
// ==========================================
const UNIT_SPRITE_MAP: Record<string, string> = {
    char1: gmSprite,
    char2: zakuSprite,
    char3: gundamSprite,
    char4: redCometSprite,
    char5: zeongSprite,
    gm: gmSprite,
    zaku: zakuSprite,
    gundam: gundamSprite,
    redcomet: redCometSprite,
    zeong: zeongSprite,
};

// Aura glow สำหรับแต่ละ Player
const PLAYER_AURA_FILTER: Record<1 | 2, string> = {
    1: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.85)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
    2: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.85)) drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))',
};

// ==========================================
// Component: 1 ชิ้นส่วน (HexPiece)
// ==========================================
const HexPiece = ({owner, character, unitPlayerId, isBuyableCell, isGhostPreview, ghostImgSrc}: HexPieceProps) => {
    let hexBg = hexGray;
    if (owner === "red") hexBg = hexRed;
    if (owner === "blue") hexBg = hexBlue;

    return (
        <div className="relative w-[93px] h-[77px] flex items-center justify-center group">
            <img
                src={hexBg}
                alt={`Hex ${owner}`}
                className="absolute inset-0 w-full h-full z-0"
            />

            {isBuyableCell && (
                <div className="absolute inset-0 z-[1] bg-yellow-400/30 rounded-sm pointer-events-none animate-pulse"/>
            )}

            {character && character.imgSrc && (
                <img
                    src={character.imgSrc}
                    alt="Character"
                    className="absolute z-[10] w-[70px] h-[70px] object-contain pointer-events-none"
                    style={{
                        filter: unitPlayerId ? PLAYER_AURA_FILTER[unitPlayerId] : undefined,
                    }}
                />
            )}

            {isGhostPreview && ghostImgSrc && !character && (
                <img
                    src={ghostImgSrc}
                    alt="Preview"
                    className="absolute z-[10] w-[70px] h-[70px] object-contain pointer-events-none opacity-40 drop-shadow-xl"
                />
            )}
        </div>
    );
};

// ==========================================
// Component: กระดานใหญ่ (HexBoard)
// ==========================================
const HexBoard = ({
                      gameID,
                      player1ID,
                      player2ID,
                      validPlacementCells = [],
                      placedUnits = [],
                      selectedUnit = null,
                      hoveredCell = null,
                      buyableCells = [],
                      player1Grids = [],
                      player2Grids = [],
                      onCellClick,
                      onCellMouseEnter,
                      onCellMouseLeave,
                  }: HexBoardProps) => {
    const [boardData, setBoardData] = useState<HexData[][]>([]);
    const [apiGrids, setApiGrids] = useState<{ p1: string[], p2: string[] }>({p1: [], p2: []});
    const [apiMinions, setApiMinions] = useState<PlacedUnit[]>([]);

    const hexWidth = 93;
    const hexHeight = 77;
    const xOffset = hexWidth * 0.7;
    const yOffset = hexHeight;

    // Fetch dynamic data from backend - removed interval as MainGame handles polling
    useEffect(() => {
        if (!gameID) return;

        const fetchData = async () => {
            try {
                // NOTE: Expecting a new endpoint /game/status/{gameID}
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/game/status/${gameID}`);
                if (!response.ok) return;

                const data = await response.json();
                if (!data || !data.gridStatusList) return;

                // Map Grids
                const p1Grids: string[] = [];
                const p2Grids: string[] = [];
                data.gridStatusList.forEach((g: any) => {
                    const id = `${g.row - 1}-${g.col - 1}`;
                    if (g.ownerID === player1ID) p1Grids.push(id);
                    else if (g.ownerID === player2ID) p2Grids.push(id);
                });
                setApiGrids({p1: p1Grids, p2: p2Grids});
            } catch (err) {
                console.error("HexBoard fetch error:", err);
            }
        };

        fetchData();
    }, [gameID, player1ID, player2ID]);

    const finalPlacedUnits = useMemo(() => {
        // Use API minions if available, otherwise fallback to props
        return apiMinions.length > 0 ? apiMinions : placedUnits;
    }, [apiMinions, placedUnits]);

    const placedUnitMap = useMemo(() => {
        const map: Record<string, { unitId: string; playerId: 1 | 2 }> = {};
        finalPlacedUnits.forEach((u) => {
            map[u.cellId] = {unitId: u.unitId, playerId: u.playerId};
        });
        return map;
    }, [finalPlacedUnits]);

    const validCellSet = useMemo(() => new Set(validPlacementCells), [validPlacementCells]);
    const buyableCellSet = useMemo(() => new Set(buyableCells), [buyableCells]);

    // Combine props grids and API grids
    const p1Set = useMemo(() => new Set([...player1Grids, ...apiGrids.p1]), [player1Grids, apiGrids.p1]);
    const p2Set = useMemo(() => new Set([...player2Grids, ...apiGrids.p2]), [player2Grids, apiGrids.p2]);

    useEffect(() => {
        const rows = 8;
        const cols = 8;
        const newBoard: HexData[][] = [];

        for (let r = 0; r < rows; r++) {
            const rowData: HexData[] = [];
            for (let c = 0; c < cols; c++) {
                let owner = "none";

//                 // Player 2 (Top-Left cluster) - Backend (1,1) area
//                 // Based on Stage.java Assign_Start_Gird: (1,1), (2,1), (2,2), (2,3), (1,2)
//                 // 0-indexed: (0,0), (1,0), (1,1), (1,2), (0,1)
//                 if ((r === 0 && (c === 0 || c === 1)) ||
//                     (r === 1 && (c === 0 || c === 1 || c === 2))) {
//                     owner = "red";
//                 }
//
//                 // Player 1 (Bottom-Right cluster) - Backend (8,8) area
//                 // Based on Stage.java Assign_Start_Gird: (8,8), (7,8), (7,7), (7,6), (8,7)
//                 // 0-indexed: (7,7), (6,7), (6,6), (6,5), (7,6)
//                 if ((r === 7 && (c === 7 || c === 6)) ||
//                     (r === 6 && (c === 7 || c === 6 || c === 5))) {
//                     owner = "blue";
//                 }

                rowData.push({id: `${r}-${c}`, col: c, row: r, owner, character: null});
            }
            newBoard.push(rowData);
        }
        setBoardData(newBoard);
    }, []);

    return (
        <div
            className="relative mx-auto"
            style={{
                width: `${(8 * xOffset) + (hexWidth * 0.25)}px`,
                height: `${(8 * yOffset) + (hexHeight / 2)}px`
            }}
        >
            {boardData.map((row) =>
                row.map((hex) => {
                    // คืนค่าการเยื้องคอลัมน์คู่ (0, 2, 4...) ดรอปลงมา ตามเดิม
                    const isEvenCol = hex.col % 2 === 0;
                    const leftPos = hex.col * xOffset;
                    const topPos = hex.row * yOffset + (isEvenCol ? hexHeight / 2 : 0);

                    const placedInfo = placedUnitMap[hex.id];
                    const character: CharacterData | null = placedInfo
                        ? {imgSrc: UNIT_SPRITE_MAP[placedInfo.unitId] || ''}
                        : null;
                    const unitPlayerId: 1 | 2 | null = placedInfo?.playerId ?? null;

                    const isValidPlacement = !!selectedUnit && validCellSet.has(hex.id) && !placedInfo;
                    const isBuyableCell = buyableCellSet.has(hex.id);
                    const isGhostPreview = isValidPlacement && hoveredCell === hex.id;
                    const ghostImgSrc = selectedUnit ? (UNIT_SPRITE_MAP[selectedUnit] || null) : null;

                    // Determine actual owner color: API data takes precedence over mockData
                    let displayOwner = hex.owner;
                    if (p1Set.has(hex.id)) displayOwner = 'blue';
                    else if (p2Set.has(hex.id)) displayOwner = 'red';

                    const cursorClass = (isValidPlacement || isBuyableCell) ? 'cursor-pointer' : 'cursor-default';

                    // Backend coordinates calculation (1-indexed)
                    const backendCol = hex.col + 1;
                    const backendRow = hex.row + 1;
                    const debugTooltip = `Backend: (R: ${backendRow}, C: ${backendCol})\nFrontend: (R: ${hex.row}, C: ${hex.col})`;

                    return (
                        <div
                            key={hex.id}
                            className={`absolute ${cursorClass}`}
                            style={{left: `${leftPos}px`, top: `${topPos}px`}}
                            onClick={() => onCellClick?.(hex.id)}
                            onMouseEnter={() => onCellMouseEnter?.(hex.id)}
                            onMouseLeave={() => onCellMouseLeave?.()}
                            title={debugTooltip}
                        >
                            <HexPiece
                                owner={displayOwner}
                                character={character}
                                unitPlayerId={unitPlayerId}
                                isValidPlacement={isValidPlacement}
                                isBuyableCell={isBuyableCell}
                                isGhostPreview={isGhostPreview}
                                ghostImgSrc={ghostImgSrc}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
};
export default HexBoard;

