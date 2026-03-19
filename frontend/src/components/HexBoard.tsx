import { useState, useEffect, useMemo } from 'react';

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
    validPlacementCells?: string[];
    placedUnits?: PlacedUnit[];
    selectedUnit?: string | null;
    hoveredCell?: string | null;
    buyableCells?: string[];
    onCellClick?: (cellId: string) => void;
    onCellMouseEnter?: (cellId: string) => void;
    onCellMouseLeave?: () => void;
}

// ==========================================
// Mapping: unitId -> sprite image
// ==========================================
const UNIT_SPRITE_MAP: Record<string, string> = {
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
const HexPiece = ({ owner, character, unitPlayerId, isBuyableCell, isGhostPreview, ghostImgSrc }: HexPieceProps) => {
    let hexBg = hexGray;
    if (owner === "red") hexBg = hexRed;
    if (owner === "blue") hexBg = hexBlue;

    return (
        <div className="relative w-[93px] h-[77px] flex items-center justify-center group">
            {/* เลเยอร์ 1: พื้นหลังกระดาน (z-0) */}
            <img
                src={hexBg}
                alt={`Hex ${owner}`}
                className="absolute inset-0 w-full h-full z-0"
            />

            {/* เลเยอร์ 1.5:  ช่องที่ซื้อได้ */}
            {isBuyableCell && (
                <div className="absolute inset-0 z-[1] bg-yellow-400/30 rounded-sm pointer-events-none animate-pulse" />
            )}

            {/* เลเยอร์ 2: ตัวละคร + Aura (z-10 ลอยอยู่ด้านบน) */}
            {character && (
                <img
                    src={character.imgSrc}
                    alt="Character"
                    className="absolute z-[10] w-[70px] h-[70px] object-contain pointer-events-none"
                    style={{
                        filter: unitPlayerId ? PLAYER_AURA_FILTER[unitPlayerId] : undefined,
                    }}
                />
            )}

            {/* เลเยอร์ 3: Ghost Preview ตอน Hover */}
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
                      validPlacementCells = [],
                      placedUnits = [],
                      selectedUnit = null,
                      hoveredCell = null,
                      buyableCells = [],
                      onCellClick,
                      onCellMouseEnter,
                      onCellMouseLeave,
                  }: HexBoardProps) => {
    const [boardData, setBoardData] = useState<HexData[]>([]);

    // ขนาดและระยะห่างของกระดาน
    const hexWidth = 93;
    const hexHeight = 77;
    const xOffset = hexWidth * 0.7;
    const yOffset = hexHeight;

    // สร้าง lookup สำหรับ placedUnits เพื่อค้นหาเร็วขึ้น (เก็บทั้ง unitId และ playerId)
    const placedUnitMap = useMemo(() => {
        const map: Record<string, { unitId: string; playerId: 1 | 2 }> = {};
        placedUnits.forEach((u) => { map[u.cellId] = { unitId: u.unitId, playerId: u.playerId }; });
        return map;
    }, [placedUnits]);

    // สร้าง Set สำหรับ validPlacementCells
    const validCellSet = useMemo(() => new Set(validPlacementCells), [validPlacementCells]);

    // สร้าง Set สำหรับ buyableCells
    const buyableCellSet = useMemo(() => new Set(buyableCells), [buyableCells]);

    // จำลองการสร้างข้อมูลกระดานตอนโหลดหน้าเว็บ
    useEffect(() => {
        const mockData: HexData[] = [];
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                let owner = "none";

                // --- กำหนดอาณาเขต: Player 1 = Blue (ซ้าย), Player 2 = Red (ขวา) ---
                if (
                    (col === 0 && (row === 0 || row === 1)) ||
                    (col === 1 && (row === 0 || row === 1)) ||
                    (col === 2 && row === 0)
                ) { owner = "red"; }

                if (
                    (col === 7 && (row === 6 || row === 7)) ||
                    (col === 6 && (row === 6 || row === 7)) ||
                    (col === 5 && row === 7)
                ) { owner = "blue"; }

                mockData.push({ id: `${col}-${row}`, col, row, owner, character: null });
            }
        }
        setBoardData(mockData);
    }, []);

    return (
        // กรอบหลักของกระดาน คำนวณขนาดกว้าง-ยาวให้พอดีกับ 8x8
        <div
            className="relative mx-auto"
            style={{
                width: `${(8 * xOffset) + (hexWidth * 0.25)}px`,
                height: `${(8 * yOffset) + (hexHeight / 2)}px`
            }}
        >
            {/* 4.3 วนลูปวาด HexPiece 64 ชิ้น ตามตำแหน่ง */}
            {boardData.map((hex) => {
                // เงื่อนไขเยื้อง: ให้คอลัมน์คู่ (0, 2, 4...) ดรอปลงมา
                const isEvenCol = hex.col % 2 === 0;

                // คำนวณพิกัดแกน X (แนวนอน)
                const leftPos = hex.col * xOffset;

                // คำนวณพิกัดแกน Y (แนวตั้ง)
                const topPos = hex.row * yOffset + (isEvenCol ? hexHeight / 2 : 0);

                // ตรวจสอบว่าช่องนี้มียูนิตวางอยู่หรือไม่
                const placedInfo = placedUnitMap[hex.id];
                const character: CharacterData | null = placedInfo
                    ? { imgSrc: UNIT_SPRITE_MAP[placedInfo.unitId] || '' }
                    : null;
                const unitPlayerId: 1 | 2 | null = placedInfo?.playerId ?? null;

                // ตรวจสอบว่าช่องนี้เป็น valid placement
                const isValidPlacement = !!selectedUnit && validCellSet.has(hex.id) && !placedInfo;

                // ตรวจสอบว่าช่องนี้ซื้อได้หรือไม่
                const isBuyableCell = buyableCellSet.has(hex.id);

                // Ghost preview เมื่อ hover บนช่องที่วางได้
                const isGhostPreview = isValidPlacement && hoveredCell === hex.id;
                const ghostImgSrc = selectedUnit ? (UNIT_SPRITE_MAP[selectedUnit] || null) : null;

                // Cursor style
                const cursorClass = (isValidPlacement || isBuyableCell) ? 'cursor-pointer' : 'cursor-default';

                return (
                    <div
                        key={hex.id}
                        className={`absolute ${cursorClass}`}
                        style={{ left: `${leftPos}px`, top: `${topPos}px` }}
                        onClick={() => onCellClick?.(hex.id)}
                        onMouseEnter={() => onCellMouseEnter?.(hex.id)}
                        onMouseLeave={() => onCellMouseLeave?.()}
                    >
                        <HexPiece
                            owner={hex.owner}
                            character={character}
                            unitPlayerId={unitPlayerId}
                            isValidPlacement={isValidPlacement}
                            isBuyableCell={isBuyableCell}
                            isGhostPreview={isGhostPreview}
                            ghostImgSrc={ghostImgSrc}
                        />
                    </div>
                );
            })}
        </div>
    );
};
export default HexBoard;