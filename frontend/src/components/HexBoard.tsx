import { useState, useEffect } from 'react';

// ==========================================
// 1. นำเข้าไฟล์ SVG ของคุณ (สมมติ Path)
// ==========================================

import hexGray from '../assets/HexGray.svg';
import hexRed from '../assets/HexRed.svg';
import hexBlue from '../assets/HexBlue.svg';
import charMockup from '../assets/RedComet/RedComet_Sprite.svg'; // ตัวละครที่มีออร่าแดง

// ==========================================
// 2. Types & Interfaces
// ==========================================
interface CharacterData {
    imgSrc: string;
}

interface HexPieceProps {
    owner: 'red' | 'blue' | 'none' | string;
    character?: CharacterData | null;
}

interface HexData {
    id: string;
    col: number;
    row: number;
    owner: 'red' | 'blue' | 'none' | string;
    character?: CharacterData | null;
}

// ==========================================
// 3. Component: 1 ชิ้นส่วน (HexPiece)
// ==========================================
const HexPiece = ({ owner, character }: HexPieceProps) => {
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

            {/* เลเยอร์ 2: ตัวละคร (z-10 ลอยอยู่ด้านบน) */}
            {character && (
                <img
                    src={character.imgSrc}
                    alt="Character"
                    className="absolute z-1 w-[100px] h-[100px] object-contain pointer-events-none drop-shadow-xl"
                />
            )}
        </div>
    );
};

// ==========================================
// 4. Component: กระดานใหญ่ (HexBoard)
// ==========================================
const HexBoard = () => {
    const [boardData, setBoardData] = useState<HexData[]>([]);

    // ขนาดและระยะห่างของกระดาน
    const hexWidth = 93;
    const hexHeight = 77;
    const xOffset = hexWidth * 0.7;
    const yOffset = hexHeight;

    // จำลองการสร้างข้อมูลกระดานตอนโหลดหน้าเว็บ
    useEffect(() => {
        const mockData: HexData[] = [];
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                let owner = "none";
                let character: CharacterData | null = null;

                // --- 4.1 กำหนดอาณาเขต (ตามรูปที่ 4) ---
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

                // --- 4.2 วางตัวละคร (สมมติตำแหน่ง) ---
                if (col === 1 && row === 1) character = { imgSrc: charMockup };
                if (col === 3 && row === 4) character = { imgSrc: charMockup };

                // เก็บข้อมูลลง Array
                mockData.push({ id: `${col}-${row}`, col, row, owner, character });
            }
        }
        setBoardData(mockData);
    }, []);

    // ฟังก์ชันเมื่อคลิกที่ช่องใดช่องหนึ่งบนกระดาน
    const handleHexClick = (col: number, row: number) => {
        console.log(`คุณคลิกที่คอลัมน์: ${col}, แถว: ${row}`);
        // อนาคต: ใส่ Logic สำหรับย้ายตัวละครที่นี่
    };

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

                return (
                    // ใช้กล่องครอบ (Wrapper) กำหนดตำแหน่ง Absolute
                    <div
                        key={hex.id}
                        className="absolute"
                        style={{ left: `${leftPos}px`, top: `${topPos}px` }}
                        onClick={() => handleHexClick(hex.col, hex.row)}
                    >
                        {/* เรียกใช้ Component 1 ชิ้นส่วน */}
                        <HexPiece owner={hex.owner} character={hex.character} />
                    </div>
                );
            })}
        </div>
    );
};
export default HexBoard;