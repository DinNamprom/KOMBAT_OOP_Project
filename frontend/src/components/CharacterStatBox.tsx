import React, {useState, useEffect} from 'react';
import frameImage from '../assets/config-frame.svg';
import innerFrameImage from '../assets/inner-black-frame.svg';

interface CharacterStatsBoxProps {
    name: string;
    hp: number;
    def: number;
    spawnCost: number;
    atk?: number;
    onStatsChange?: (stats: { hp: number; def: number; spawnCost: number; atk?: number }) => void;
}

const CharacterStatsBox: React.FC<CharacterStatsBoxProps> = ({
                                                                 name,
                                                                 hp: initialHp,
                                                                 def: initialDef,
                                                                 spawnCost: initialSpawnCost,
                                                                 atk: initialAtk,
                                                                 onStatsChange,
                                                             }) => {
    const [hp, setHp] = useState(initialHp);
    const [def, setDef] = useState(initialDef);
    const [spawnCost, setSpawnCost] = useState(initialSpawnCost);
    const [atk, setAtk] = useState(initialAtk || 0);

    useEffect(() => {
        setHp(initialHp);
        setDef(initialDef);
        setSpawnCost(initialSpawnCost);
        setAtk(initialAtk || 0);
    }, [initialHp, initialDef, initialSpawnCost, initialAtk]);

    const handleStatChange = (field: 'hp' | 'def' | 'spawnCost' | 'atk', value: string) => {
        const numValue = parseInt(value) || 0;

        switch (field) {
            case 'hp':
                setHp(numValue);
                onStatsChange?.({hp: numValue, def, spawnCost, atk});
                break;
            case 'def':
                setDef(numValue);
                onStatsChange?.({hp, def: numValue, spawnCost, atk});
                break;
            case 'spawnCost':
                setSpawnCost(numValue);
                onStatsChange?.({hp, def, spawnCost: numValue, atk});
                break;
            case 'atk':
                setAtk(numValue);
                onStatsChange?.({hp, def, spawnCost, atk: numValue});
                break;
        }
    };

    return (
        <div className="relative w-full max-w-md">
            {/* พื้นหลัง SVG หลัก */}
            <div className="relative">
                <div
                    className="relative w-full bg-no-repeat bg-center bg-contain"
                    style={{
                        backgroundImage: `url(${frameImage})`,
                        paddingTop: '60%',
                    }}
                >
                    {/* Header - ชื่อตัวละคร */}
                    <div
                        className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center bg-gradient-to-r from-[#3d4452] to-[#4a5260] border-b-2 border-[#7a8fa0]">
                        <h3
                            className="font-handjet text-3xl font-bold text-[#a0d9ff] tracking-widest"
                            style={{
                                textShadow: '2px 2px 4px rgba(0,0,0,0.7), 0 0 10px rgba(160,217,255,0.3)'
                            }}
                        >
                            {name}
                        </h3>
                    </div>

                    {/* Stats Container */}
                    <div
                        className="absolute top-16 left-0 right-0 bottom-0 flex flex-col justify-center px-6 py-4 gap-4">

                        {/* แถวที่ 1: ATK = ... HP = ... DEF = ... */}
                        <div className="flex items-center justify-center gap-6">

                            {/* ATK */}
                            <div className="flex items-center gap-2">
                <span className="font-handjet text-lg font-bold text-white tracking-wider">
                  ATK =
                </span>
                                <div
                                    className="relative bg-[#1a1f2e] px-2 py-1 rounded border-2 border-[#555a68] min-w-[70px] h-10 flex items-center justify-center overflow-hidden">
                                    {/* ใช้ innerFrameImage เป็นพื้นหลัง */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: `url(${innerFrameImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <textarea
                                        className="relative w-full h-full bg-transparent border-none text-white font-handjet font-bold text-center text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#a0d9ff] tracking-wider z-10"
                                        value={atk}
                                        onChange={(e) => handleStatChange('atk', e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>

                            {/* HP */}
                            <div className="flex items-center gap-2">
                <span className="font-handjet text-lg font-bold text-white tracking-wider">
                  HP =
                </span>
                                <div
                                    className="relative bg-[#1a1f2e] px-2 py-1 rounded border-2 border-[#555a68] min-w-[70px] h-10 flex items-center justify-center overflow-hidden">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: `url(${innerFrameImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <textarea
                                        className="relative w-full h-full bg-transparent border-none text-white font-handjet font-bold text-center text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#a0d9ff] tracking-wider z-10"
                                        value={hp}
                                        onChange={(e) => handleStatChange('hp', e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>

                            {/* DEF */}
                            <div className="flex items-center gap-2">
                <span className="font-handjet text-lg font-bold text-white tracking-wider">
                  DEF =
                </span>
                                <div
                                    className="relative bg-[#1a1f2e] px-2 py-1 rounded border-2 border-[#555a68] min-w-[70px] h-10 flex items-center justify-center overflow-hidden">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: `url(${innerFrameImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    />
                                    <textarea
                                        className="relative w-full h-full bg-transparent border-none text-white font-handjet font-bold text-center text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#a0d9ff] tracking-wider z-10"
                                        value={def}
                                        onChange={(e) => handleStatChange('def', e.target.value)}
                                        spellCheck={false}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* แถวที่ 2: Spawn cost = ... */}
                        <div className="flex items-center justify-center gap-2">
              <span className="font-handjet text-lg font-bold text-white tracking-wider">
                Spawn cost =
              </span>
                            <div
                                className="relative bg-[#1a1f2e] px-2 py-1 rounded border-2 border-[#555a68] min-w-[70px] h-10 flex items-center justify-center overflow-hidden">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: `url(${innerFrameImage})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <textarea
                                    className="relative w-full h-full bg-transparent border-none text-white font-handjet font-bold text-center text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#a0d9ff] tracking-wider z-10"
                                    value={spawnCost}
                                    onChange={(e) => handleStatChange('spawnCost', e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CharacterStatsBox;