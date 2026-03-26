import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import bgImage from '../assets/bg.svg';
import BackButton from '../components/BackButton';

import gmWhiteAura from '../assets/GM/GMWhiteAura.svg';
import gmYellowAura from '../assets/GM/GMYellowAura.svg';
import zakuWhiteAura from '../assets/Zaku/ZakuWhiteAura.svg';
import zakuYellowAura from '../assets/Zaku/ZakuYellowAura.svg';
import gundamWhiteAura from '../assets/Gundam/GundamWhiteAura.svg';
import gundamYellowAura from '../assets/Gundam/GundamYellowAura.svg';
import redcometWhiteAura from '../assets/RedComet/RedCometWhiteAura.svg';
import redcometYellowAura from '../assets/RedComet/RedCometYellowAura.svg';
import zeongWhiteAura from '../assets/Zeong/ZeongWhiteAura.svg';
import zeongYellowAura from '../assets/Zeong/ZeongYellowAura.svg';

import gmColor from '../assets/GM/GM_FinishedStrategy.svg';
import zakuColor from '../assets/Zaku/Zaku_FinishedStrategy.svg';
import gundamColor from '../assets/Gundam/Gundam_FinishedStrategy.svg';
import redcometColor from '../assets/RedComet/RedComet_FinishedStrategy.svg';
import zeongColor from '../assets/Zeong/Zeong_FinishedStrategy.svg';


import closeIcon from '../assets/Cancel.svg';
import CyberButton from "../components/CyberButton.tsx";
import Title from "../components/Title.tsx";

const MinionSetup = () => {
    const navigate = useNavigate();

    // State เก็บข้อมูลว่าตัวละครไหนตั้งค่าไปแล้วบ้าง
    const [configuredMinions, setConfiguredMinions] = useState<Record<string, any>>({});

    // ดึงข้อมูลจาก LocalStorage ตอนเปิดหน้า
    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('configuredMinions') || '{}');
        setConfiguredMinions(savedData);
    }, []);

    // ฟังก์ชันลบการตั้งค่า
    const handleRemoveConfig = (charId: string) => {
        const newData = {...configuredMinions};
        delete newData[charId];
        setConfiguredMinions(newData);
        localStorage.setItem('configuredMinions', JSON.stringify(newData));
    };

    // อัปเดต Array เพิ่ม property 'name' และ 'colorImg'
    const characters = [
        {
            id: 'char1',
            name: 'RGM-79 GM',
            normalImg: gmWhiteAura,
            hoverImg: gmYellowAura,
            colorImg: gmColor,
            nextPath: '/setup/char1'
        },
        {
            id: 'char2',
            name: 'Zaku',
            normalImg: zakuWhiteAura,
            hoverImg: zakuYellowAura,
            colorImg: zakuColor,
            nextPath: '/setup/char2'
        },
        {
            id: 'char3',
            name: 'Gundam',
            normalImg: gundamWhiteAura,
            hoverImg: gundamYellowAura,
            colorImg: gundamColor,
            nextPath: '/setup/char3'
        },
        {
            id: 'char4',
            name: 'Red Comet',
            normalImg: redcometWhiteAura,
            hoverImg: redcometYellowAura,
            colorImg: redcometColor,
            nextPath: '/setup/char4'
        },
        {
            id: 'char5',
            name: 'Zeong',
            normalImg: zeongWhiteAura,
            hoverImg: zeongYellowAura,
            colorImg: zeongColor,
            nextPath: '/setup/char5'
        },
    ];

    // เช็คว่ามีการตั้งค่า Minion อย่างน้อย 1 ตัวหรือไม่
    const hasConfiguredMinions = Object.keys(configuredMinions).length > 0;

    return (
        <div
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <BackButton onClick={() => navigate("/loadingMode")}/>

            <div className="flex flex-row items-center justify-center gap-3 px-4 z-10">

                {characters.map((char) => {
                    // ตรวจสอบว่าตัวนี้อยู่ใน LocalStorage หรือยัง
                    const isConfigured = !!configuredMinions[char.id];
                    const displayName = isConfigured && configuredMinions[char.id].customName
                        ? configuredMinions[char.id].customName
                        : char.name;

                    return (
                        <div
                            key={char.id}
                            className="relative w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
                        >
                            {/* ✅ Card div - เด็กของ Parent */}
                            <div
                                onClick={() => navigate(char.nextPath)}
                                className="group relative cursor-pointer transition-transform duration-300 w-full h-full flex flex-col items-center justify-center"
                            >
                                {isConfigured ? (
                                    <>
                                        {/* รูปตัวละครแบบมีสี */}
                                        <img
                                            src={char.colorImg}
                                            alt={displayName}
                                            className="w-full h-full object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                                        />


                                        {/* ชื่อตัวละครด้านล่าง */}
                                        <div className="absolute -bottom-3 w-full flex justify-center translate-x-4">
                                            <Title text={displayName} textSize="text-3xl" isUppercase={false}/>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={char.normalImg}
                                            alt={`${char.id} normal`}
                                            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                                        />
                                        <img
                                            src={char.hoverImg}
                                            alt={`${char.id} hover`}
                                            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
                                        />
                                    </>
                                )}
                            </div>

                            {/* X Button - Sibling ของ Card div */}
                            {isConfigured && (
                                <img
                                    src={closeIcon}
                                    alt="Remove"
                                    onClick={() => handleRemoveConfig(char.id)}
                                    className="absolute top-2 right-4 w-8 h-8 z-20 drop-shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                />
                            )}
                        </div>
                    );
                })}

            </div>

            {/* ปุ่มที่จะโผล่มาเมื่อมีการตั้งค่า Minion อย่างน้อย 1 ตัว */}
            {hasConfiguredMinions && (
                <div className="absolute bottom-8 right-8 z-50">
                    <CyberButton
                        altText="Apply & Saving"
                        onClick={() => navigate('/loadingGame')}
                    />
                </div>
            )}

        </div>
    );
};

export default MinionSetup;