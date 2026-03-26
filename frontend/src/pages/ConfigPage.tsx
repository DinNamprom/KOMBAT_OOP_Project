import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Title from '../components/Title';
import CyberButton from '../components/CyberButton';
import bgImage from '../assets/bg.svg';
import configFrameImage from '../assets/config-frame.svg';
import BackButton from "../components/BackButton.tsx";
import { configService, type GameConfig } from '../services/configService';


const ConfigPage = () => {
    const navigate = useNavigate();

    const [configData, setConfigData] = useState<GameConfig>(configService.loadConfig());

    const handleChange = (key: string, value: string) => {
        setConfigData(prev => ({...prev, [key]: Number(value)}));
    };

    return (
        <div
            className="relative min-h-screen w-full flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >

            <div className="absolute top-0 w-full pt-10 pl-10 pr-10">
                <BackButton onClick={() => navigate("/")}/>
            </div>

            {/* ส่วนเนื้อหา */}
            <div className="flex flex-col items-center gap-2 mt-12">

                <Title text="Configuration Page" isUppercase={false} textSize="text-6xl"/>

                {/* กรอบสี่เหลี่ยมด้านนอก */}
                <div
                    className="relative w-[80vw] max-w-[800px] p-12 pt-16 font-bold font-handjet flex flex-col justify-center"
                >
                    {/* ใส่รูปภาพกรอบเป็น Background แบบ Absolute */}
                    <img
                        src={configFrameImage}
                        alt="Config Frame"
                        className="absolute inset-0 w-full h-full object-fill pointer-events-none text-transparent"
                    />


                    <div className="relative z-10 flex flex-col gap-3 w-full text-white text-2xl tracking-wider">
                        {Object.entries(configData).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between px-[10%]">
                                <span className="w-1/2 text-left">{key}</span>
                                <input
                                    type="number"
                                    className="w-1/2 max-w-[200px] bg-[#000510]/80 border-none text-white h-[40px] px-4 py-1 focus:outline-none"
                                    value={value}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* โซนปุ่ม Submit */}
                    <div className="relative z-10 mt-4 flex justify-center">
                        <CyberButton
                            altText="Submit"
                            width="w-50"
                            onClick={() => {
                                configService.saveConfig(configData);
                                navigate("/");
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConfigPage;