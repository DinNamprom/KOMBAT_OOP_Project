import CyberButton from '../components/CyberButton';
import initialGM from '../assets/InitialGM.svg';
import initialZaku from '../assets/InitialZaku.svg';
import initialGundam from '../assets/InitialGundam.svg';
import initialRedComet from '../assets/InitialRedComet.svg';
import initialZeong from '../assets/InitialZeong.svg';
import BaseCommandPanel from './BaseCommandPanel';

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
    { id: 'char1', name: 'GM',        imageSrc: initialGM },
    { id: 'char2', name: 'Zaku',      imageSrc: initialZaku },
    { id: 'char3', name: 'Gundam',    imageSrc: initialGundam },
    { id: 'char4', name: 'Red Comet', imageSrc: initialRedComet },
    { id: 'char5', name: 'Zeong',     imageSrc: initialZeong },
];

const InitialCommandPanel = ({
                                 currentPlayer,
                                 goldAmount,
                                 currentUnits,
                                 maxUnits,
                                 onSelectUnit,
                                 onExecute,
                             }: InitialCommandPanelProps) => {

    return (
        <BaseCommandPanel
            currentPlayer={currentPlayer}
            currentTurn={0}
            goldAmount={goldAmount}
            currentUnits={currentUnits}
            maxUnits={maxUnits}
        >
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
                <div className="pb-[4%] mt-auto">
                    <CyberButton
                        onClick={onExecute}
                        altText="Execute"
                    />
                </div>
            )}
        </BaseCommandPanel>
    );
};

export default InitialCommandPanel;
