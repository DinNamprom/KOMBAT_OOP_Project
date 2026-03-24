import CyberButton from '../components/CyberButton';
import commandPanelBg from '../assets/CommandPanel.svg';
import player1TurnImg from '../assets/Player1Turn.svg';
import player2TurnImg from '../assets/Player2Turn.svg';

// Unit Assets - แต่ละไฟล์ SVG มีรูปตัวละครพร้อมป้ายราคา "0" อยู่ด้านล่างแล้ว
import initialGM from '../assets/InitialGM.svg';
import initialZaku from '../assets/InitialZaku.svg';
import initialGundam from '../assets/InitialGundam.svg';
import initialRedComet from '../assets/InitialRedComet.svg';
import initialZeong from '../assets/InitialZeong.svg';

interface UnitOption {
    id: string;
    name: string;
    imageSrc: string;
}

interface InitialCommandPanelProps {
    currentPlayer: 1 | 2;
    goldAmount: number;
    currentUnits: number;
    maxUnits: number;
    onSelectUnit: (unitId: string) => void;
    onExecute?: () => void;
}

// รายการยูนิตเริ่มต้นที่สามารถเลือกได้ (ฟรี, ราคา 0)
const INITIAL_UNITS: UnitOption[] = [
    { id: 'gm',       name: 'GM',        imageSrc: initialGM },
    { id: 'zaku',     name: 'Zaku',      imageSrc: initialZaku },
    { id: 'gundam',   name: 'Gundam',    imageSrc: initialGundam },
    { id: 'redcomet', name: 'Red Comet', imageSrc: initialRedComet },
    { id: 'zeong',    name: 'Zeong',     imageSrc: initialZeong },
];

const InitialCommandPanel = ({
                                 currentPlayer,
                                 goldAmount,
                                 currentUnits,
                                 maxUnits,
                                 onSelectUnit,
                                 onExecute,
                             }: InitialCommandPanelProps) => {
    const playerTurnImg = currentPlayer === 1 ? player1TurnImg : player2TurnImg;

    return (
        <div className="relative w-full max-w-[500px] h-auto">
            {/* Background SVG - กำหนดขนาดของ panel ทั้งหมด */}
            <img
                src={commandPanelBg}
                alt="Initial Command Panel"
                className="w-full h-auto object-contain"
            />

            {/* Turn Tab - แสดง Turn 0 สำหรับ Setup Phase */}
            <div
                className="absolute flex items-center justify-center"
                style={{ left: '0.6%', top: '0.5%', width: '21.5%', height: '4.8%' }}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                    Turn 0
                </span>
            </div>

            {/* Player Turn Banner - แบนเนอร์แสดงชื่อผู้เล่น */}
            <div
                className="absolute"
                style={{ left: '2.7%', top: '7.8%', width: '40%', height: '4.5%' }}
            >
                <img
                    src={playerTurnImg}
                    alt={`Player${currentPlayer}'s turn`}
                    className="h-full w-auto object-contain"
                />
            </div>

            {/* Gold Amount - ตัวเลขจำนวนทอง */}
            <div
                className="absolute flex items-center justify-center"
                style={{ left: '51.6%', top: '7.9%', width: '17.7%', height: '4.5%' }}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                    {goldAmount}
                </span>
            </div>

            {/* Unit Count - ตัวเลขจำนวนยูนิต */}
            <div
                className="absolute flex items-center justify-center"
                style={{ left: '78%', top: '7.9%', width: '17.7%', height: '4.5%' }}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                    {currentUnits}/{maxUnits}
                </span>
            </div>

            {/* Content Area - ตารางเลือกยูนิตและปุ่ม Execute */}
            <div
                className="absolute flex flex-col items-center justify-between"
                style={{ left: '2.7%', top: '15.6%', width: '93%', height: '61.6%' }}
            >
                {/* Unit Selection Grid - แสดง 5 ตัวละครแบบ 3+2 */}
                <div className="w-full flex flex-col items-center gap-[4%] pt-[4%]">
                    {/* แถวบน: 3 ตัวละคร */}
                    <div className="flex items-center justify-center gap-[3%] w-full">
                        {INITIAL_UNITS.slice(0, 3).map((unit) => (
                            <button
                                key={unit.id}
                                onClick={() => onSelectUnit(unit.id)}
                                className="group relative w-[28%] cursor-pointer bg-transparent border-none p-0
                                           transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                            >
                                <img
                                    src={unit.imageSrc}
                                    alt={unit.name}
                                    className="w-full h-auto object-contain
                                               drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]
                                               group-hover:drop-shadow-[0_0_12px_rgba(43,141,240,0.6)]"
                                />
                            </button>
                        ))}
                    </div>

                    {/* แถวล่าง: 2 ตัวละคร */}
                    <div className="flex items-center justify-center gap-[3%] w-full">
                        {INITIAL_UNITS.slice(3, 5).map((unit) => (
                            <button
                                key={unit.id}
                                onClick={() => onSelectUnit(unit.id)}
                                className="group relative w-[28%] cursor-pointer bg-transparent border-none p-0
                                           transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none"
                            >
                                <img
                                    src={unit.imageSrc}
                                    alt={unit.name}
                                    className="w-full h-auto object-contain
                                               drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]
                                               group-hover:drop-shadow-[0_0_12px_rgba(43,141,240,0.6)]"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Execute Button - แสดงเฉพาะเมื่อมี onExecute */}
                {onExecute && (
                    <div className="pb-[4%]">
                        <CyberButton
                            onClick={onExecute}
                            altText="Execute"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InitialCommandPanel;
