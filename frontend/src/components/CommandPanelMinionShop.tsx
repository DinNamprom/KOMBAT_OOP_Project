import CyberButton from '../components/CyberButton';
import shopGM from '../assets/GM/shopGM.svg';
import shopZaku from '../assets/Zaku/shopZaku.svg';
import shopGundam from '../assets/Gundam/shopGundam.svg';
import shopRedComet from '../assets/RedComet/shopRedComet.svg';
import shopZeong from '../assets/Zeong/shopZeong.svg';
import { useState, useEffect } from 'react';
import ShopUnitButton from './ShopUnitButton';
import BaseCommandPanel from './BaseCommandPanel';
import { configService } from '../services/configService';

interface UnitOption {
    id: string;
    name: string;
    imageSrc: string;
}

interface CommandPanelMinionShopProps {
    currentPlayer: 1 | 2;
    currentTurn: number;
    maxTurn: number;
    goldAmount: number;
    currentUnits: number;
    maxUnits: number;
    onSelectUnit: (unitId: string) => void;
    onExecute?: () => void;
}

// รายการยูนิตเริ่มต้นที่สามารถเลือกได้
const INITIAL_UNITS: UnitOption[] = [
    { id: 'gm',       name: 'GM',        imageSrc: shopGM },
    { id: 'zaku',     name: 'Zaku',      imageSrc: shopZaku },
    { id: 'gundam',   name: 'Gundam',    imageSrc: shopGundam },
    { id: 'redcomet', name: 'Red Comet', imageSrc: shopRedComet },
    { id: 'zeong',    name: 'Zeong',     imageSrc: shopZeong },
];

const CommandPanelMinionShop = ({
    currentPlayer,
    currentTurn,
    maxTurn,
    goldAmount,
    currentUnits,
    maxUnits,
    onSelectUnit,
    onExecute,
}: CommandPanelMinionShopProps) => {
    // ดึงค่า spawn_cost จากเกม Config
    const [spawnCost, setSpawnCost] = useState<number>(configService.loadConfig().spawn_cost);

    useEffect(() => {
        setSpawnCost(configService.loadConfig().spawn_cost);
    }, []);

    return (
        <BaseCommandPanel
            currentPlayer={currentPlayer}
            currentTurn={currentTurn}
            maxTurn={maxTurn}
            goldAmount={goldAmount}
            currentUnits={currentUnits}
            maxUnits={maxUnits}
        >
            {/* Unit Selection Grid - แสดง 5 ตัวละครแบบ 3+2 */}
            <div className="w-[90%] flex flex-col items-center gap-[6%] pt-[4%]">
                {/* แถวบน: 3 ตัวละคร */}
                <div className="flex items-center justify-center gap-[3%] w-full">
                    {INITIAL_UNITS.slice(0, 3).map((unit) => (
                        <ShopUnitButton
                            key={unit.id}
                            unitId={unit.id}
                            unitName={unit.name}
                            imageSrc={unit.imageSrc}
                            cost={spawnCost}
                            widthClass="w-[28%]"
                            onClick={onSelectUnit}
                        />
                    ))}
                </div>

                {/* แถวล่าง: 2 ตัวละคร */}
                <div className="flex items-center justify-center gap-[3%] w-[68%]">
                    {INITIAL_UNITS.slice(3, 5).map((unit) => (
                        <ShopUnitButton
                            key={unit.id}
                            unitId={unit.id}
                            unitName={unit.name}
                            imageSrc={unit.imageSrc}
                            cost={spawnCost}
                            widthClass="w-[44%]"
                            onClick={onSelectUnit}
                        />
                    ))}
                </div>
            </div>

            {/* Execute Button - ด้านขวาล่าง */}
            {onExecute && (
                <div
                    className="absolute"
                    style={{ right: '1%', top: '110%'}}
                >
                    <CyberButton
                        onClick={onExecute}
                        altText="Execute"
                        width="w-60"
                    />
                </div>
            )}
        </BaseCommandPanel>
    );
};

export default CommandPanelMinionShop;
