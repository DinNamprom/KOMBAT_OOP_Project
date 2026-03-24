import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import StrategyTextBox from '../components/StrategyTextBox';
import bgImage from '../assets/bg.svg';

import char1Img from '../assets/GM/GM.svg';
import char2Img from '../assets/Zaku/Zaku.svg';
import char3Img from '../assets/Gundam/Gundam.svg';
import char4Img from '../assets/RedComet/RedComet.svg';
import char5Img from '../assets/Zeong/Zeong.svg';

import CyberButton from "../components/CyberButton.tsx";

// 🌟 Import รูปกรอบกล่องสถานะ (เปลี่ยน Path และชื่อไฟล์ให้ตรงกับ SVG กรอบที่คุณเตรียมไว้)
import statusFrameImg from '../assets/statusFrameImg.svg';

// 1. สร้าง Database จำลองสำหรับเก็บข้อมูลตั้งต้นของแต่ละตัวละคร
const characterDB: Record<string, any> = {
    'char1': {
        id: 'char1',
        name: 'RGM-79 GM',
        img: char1Img,
        stats: {hp: 100, def: 10, spawnCost: 100 },
        defaultStrategy: `t = t + 1 # keeping track of the turn number\nm = 0 # number of random moves this turn`
    },
    'char2': {
        id: 'char2',
        name: 'ZAKU',
        img: char2Img,
        stats: {hp: 120, def: 15, spawnCost: 150 },
        defaultStrategy: `# Zaku II default strategy\nmove forward`
    },
    'char3': {
        id: 'char3',
        name: 'Gundam',
        img: char3Img,
        stats: {hp: 120, def: 15, spawnCost: 150 },
        defaultStrategy: `# Gundam default strategy\nmove forward`
    },
    'char4': {
        id: 'char4',
        name: 'Red Comet',
        img: char4Img,
        stats: {hp: 120, def: 15, spawnCost: 150 },
        defaultStrategy: `# Red Comet default strategy\nmove forward`
    },
    'char5': {
        id: 'char5',
        name: 'Zeong',
        img: char5Img,
        stats: {hp: 120, def: 15, spawnCost: 150 },
        defaultStrategy: `# Zeong default strategy \nmove forward`
    }
};

const MinionSetupByID = () => {
    const { charId } = useParams<{ charId: string }>();
    const navigate = useNavigate();

    const currentChar = charId ? characterDB[charId] : null;

    // State เก็บข้อความ Strategy
    const [strategyText, setStrategyText] = useState("");

    // State เก็บค่าสถานะที่แก้ไขได้ (ชื่อ, HP, DEF, Spawn Cost)
    const [charName, setCharName] = useState("");
    const [stats, setStats] = useState({hp: 0, def: 0, spawnCost: 0 });

    useEffect(() => {
        if (!currentChar) {
            navigate('/setup');
            return;
        }

        // โหลดข้อมูลจาก LocalStorage ก่อน (เผื่อเคยเซฟไว้แล้วกลับมาแก้)
        const savedData = JSON.parse(localStorage.getItem('configuredMinions') || '{}');
        const savedChar = savedData[currentChar.id];

        if (savedChar) {
            setStrategyText(savedChar.strategyCode);
            // โหลดชื่อและค่าสเตตัสที่เคยแก้ไว้ (ถ้าไม่มีให้ใช้ค่าเริ่มต้น)
            setCharName(savedChar.customName || currentChar.name);
            setStats(savedChar.stats || currentChar.stats);
        } else {
            setStrategyText(currentChar.defaultStrategy);
            setCharName(currentChar.name);
            setStats(currentChar.stats);
        }
    }, [charId, currentChar, navigate]);

    const handleSaveAndApply = () => {
        // 🌟 อัปเดต Payload ให้รวมชื่อและ Status ที่แก้ไขแล้วส่งไปด้วย
        const payload = {
            characterId: currentChar.id,
            customName: charName,
            stats: stats,
            strategyCode: strategyText,
        };

        //ดึงข้อมูลที่เคยเซฟไว้ทั้งหมดออกมาจาก LocalStorage
        const existingData = JSON.parse(localStorage.getItem('configuredMinions') || '{}');

        //อัปเดต/เพิ่ม ข้อมูลของตัวละครปัจจุบันเข้าไป
        existingData[currentChar.id] = payload;

        //เซฟกลับลงไปใน LocalStorage
        localStorage.setItem('configuredMinions', JSON.stringify(existingData));

        console.log("[API POST] Data ready for backend:", payload);

        //กลับไปหน้าเลือกตัวละคร
        navigate('/setup');
    };

    if (!currentChar) return null;

    // ฟังก์ชันช่วยอัปเดต Stats ย่อยๆ
    const handleStatChange = (field: keyof typeof stats, value: string) => {
        setStats(prev => ({ ...prev, [field]: Number(value) }));
    };

    return (
        <div
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden px-8"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <BackButton onClick={() => navigate(-1)} />

            <div className="flex flex-row w-full max-w-[1400px] h-full items-center justify-center gap-10 mt-0">

                <div className="flex flex-col items-center justify-center gap-8 w-full lg:w-[40%]">
                    <img
                        src={currentChar.img}
                        alt={charName}
                        className="w-[250px] md:w-[350px] h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />

                    {/* กล่อง Status แบบใหม่ ใช้ SVG กรอบและ Input เพื่อให้แก้ไขได้ */}
                    <div className="relative w-[320px] h-[140px] flex flex-col justify-center items-center">
                        {/* รูปกรอบพื้นหลัง (SVG) */}
                        <img
                            src={statusFrameImg}
                            alt="Status Frame"
                            className="absolute inset-0 w-full h-full object-fill drop-shadow-lg pointer-events-none"
                        />

                        {/* เนื้อหาด้านในกรอบ (ซ้อนทับด้วย z-index) */}
                        <div className="relative z-10 w-full h-full flex flex-col justify-between py-2 px-6 font-handjet tracking-wider">

                            {/* ส่วนชื่อ (พิมพ์แก้ได้) */}
                            <div className="w-full flex justify-center">
                                <input
                                    type="text"
                                    value={charName}
                                    onChange={(e) => setCharName(e.target.value)}
                                    className="bg-transparent text-white text-center text-2xl font-bold outline-none border-transparent hover:border-gray-500 transition-colors w-[56%]"
                                />
                            </div>

                            {/* ส่วน Stats: HP, DEF (พิมพ์แก้ตัวเลขได้) */}
                            <div className="flex justify-center items-center text-white font-bold text-lg pl-5 mt-2">
                                <span className="flex items-center gap-1">
                                    HP =
                                    <input type="number" value={stats.hp} onChange={(e) => handleStatChange('hp', e.target.value)} className="bg-transparent text-white text-center w-12 outline-noneborder-transparent" />
                                </span>
                                <span className="flex items-center gap-1 pr-1">
                                    DEF =
                                    <input type="number" value={stats.def} onChange={(e) => handleStatChange('def', e.target.value)} className="bg-transparent text-white text-center w-12 outline-noneborder-transparent" />
                                </span>
                            </div>

                            {/* ส่วน Spawn Cost (พิมพ์แก้ตัวเลขได้) */}
                            <div className="flex justify-center items-center text-white font-bold font-handjet text-lg pr-1 mb-2">
                                Spawn cost =
                                <input
                                    type="number"
                                    value={stats.spawnCost}
                                    onChange={(e) => handleStatChange('spawnCost', e.target.value)}
                                    className="bg-transparent text-white text-center w-12 outline-none border-b border-transparent ml-2"
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {/* ฝั่งขวา (StrategyTextBox และปุ่ม) */}
                <div className="flex flex-col items-end justify-center w-full lg:w-[60%] gap-4">
                    <div className="w-full flex justify-center lg:justify-end">
                        <StrategyTextBox
                            value={strategyText}
                            onChange={setStrategyText}
                        />
                    </div>
                    <div className={"pr-7"}>
                        <CyberButton onClick={handleSaveAndApply} altText="Apply & Save" />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MinionSetupByID;