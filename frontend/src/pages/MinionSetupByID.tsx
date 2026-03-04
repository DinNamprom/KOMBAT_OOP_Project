import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import StrategyTextBox from '../components/StrategyTextBox';
import bgImage from '../assets/bg.svg';

import char1Img from '../assets/GM.svg';

import CyberButton from "../components/CyberButton.tsx";

// 1. สร้าง Database จำลองสำหรับเก็บข้อมูลตั้งต้นของแต่ละตัวละคร
const characterDB: Record<string, any> = {
    'char1': {
        id: 'char1',
        name: 'RGM-79 GM',
        img: char1Img,
        stats: { atk: 30, hp: 100, def: 10, spawnCost: 100 },
        defaultStrategy: `t = t + 1 # keeping track of the turn number\nm = 0 # number of random moves this turn`
    },
    'char2': {
        id: 'char2',
        name: 'ZAKU II',
        img: char1Img, // เปลี่ยนเป็นรูป Zaku เมื่อมีไฟล์
        stats: { atk: 45, hp: 120, def: 15, spawnCost: 150 },
        defaultStrategy: `# Zaku II default strategy\nmove forward`
    },
};

const MinionSetupByID = () => {
    const { charId } = useParams<{ charId: string }>();
    const navigate = useNavigate();

    const currentChar = charId ? characterDB[charId] : null;

    const [strategyText, setStrategyText] = useState("");

    useEffect(() => {
        if (!currentChar) {
            navigate('/setup');
            return;
        }

        // โหลดข้อมูลจาก LocalStorage ก่อน (เผื่อเคยเซฟไว้แล้วกลับมาแก้)
        const savedData = JSON.parse(localStorage.getItem('configuredMinions') || '{}');
        if (savedData[currentChar.id]) {
            setStrategyText(savedData[currentChar.id].strategyCode);
        } else {
            setStrategyText(currentChar.defaultStrategy);
        }
    }, [charId, currentChar, navigate]);

    const handleSaveAndApply = () => {
        const payload = {
            characterId: currentChar.id,
            strategyCode: strategyText,
            timestamp: new Date().toISOString()
        };

        //ดึงข้อมูลที่เคยเซฟไว้ทั้งหมดออกมาจาก LocalStorage
        const existingData = JSON.parse(localStorage.getItem('configuredMinions') || '{}');

        //อัปเดต/เพิ่ม ข้อมูลของตัวละครปัจจุบันเข้าไป
        existingData[currentChar.id] = payload;

        //เซฟกลับลงไปใน LocalStorage
        localStorage.setItem('configuredMinions', JSON.stringify(existingData));

        console.log("🚀 [API POST] Data ready for backend:", payload);

        //กลับไปหน้าเลือกตัวละคร
        navigate('/setup');
    };

    if (!currentChar) return null;

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

            <div className="flex flex-col lg:flex-row w-full max-w-[1400px] h-full items-center justify-center gap-10 mt-12 lg:mt-0">

                <div className="flex flex-col items-center justify-center gap-8 w-full lg:w-[40%]">
                    <img
                        src={currentChar.img}
                        alt={currentChar.name}
                        className="w-[250px] md:w-[350px] h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                    />

                    <div className="w-[80%] md:w-[350px] p-4 bg-black/40 border-2 border-[#4B5563] rounded-md flex flex-col justify-center gap-2 backdrop-blur-sm shadow-lg font-handjet tracking-wider">
                        <h3 className="text-white text-2xl text-center border-b border-gray-600 pb-2 mb-2">
                            {currentChar.name}
                        </h3>
                        <div className="flex justify-between text-gray-300 text-xl px-4">
                            <span>ATK = {currentChar.stats.atk}</span>
                            <span>HP = {currentChar.stats.hp}</span>
                            <span>DEF = {currentChar.stats.def}</span>
                        </div>
                        <div className="text-gray-400 text-lg text-center mt-2">
                            Spawn cost = {currentChar.stats.spawnCost}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-center w-full lg:w-[60%] gap-4">
                    <div className="w-full flex justify-center lg:justify-end">
                        <StrategyTextBox
                            value={strategyText}
                            onChange={setStrategyText}
                        />
                    </div>
                    <CyberButton onClick={handleSaveAndApply} altText="Apply & Save" />
                </div>

            </div>
        </div>
    );
};

export default MinionSetupByID;