import { useState } from 'react'; // เพิ่ม useState เพื่อเก็บข้อมูลที่พิมพ์
import { useNavigate } from 'react-router-dom';
import Title from '../components/Title';
import CyberButton from '../components/CyberButton'; // Import ปุ่มของคุณเข้ามา
import bgImage from '../assets/bg.svg';
import frameImage from '../assets/config-frame.svg';
import innerFrameImage from '../assets/inner-black-frame.svg';
import BackButton from "../components/BackButton.tsx";

const ConfigPage = () => {
    const navigate = useNavigate();

    // สร้าง State ไว้เก็บข้อความเริ่มต้น (ใส่ข้อมูลจำลองไว้ให้เหมือนในรูป)
    const [configText, setConfigText] = useState(
        `spawn_cost=100
hex_purchase_cost=1000
init_budget=100
init_hp=100
turn_budget=90
max_budget=23456
interest_pct=5
max_turns=69
max_spawns=47`
    );

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
            {/* ปุ่มย้อนกลับ */}
            <BackButton onClick={() => navigate("/")}/>

            {/* ส่วนเนื้อหา */}
            <div className="flex flex-col items-center gap-2 mt-12">

                <Title text="Configuration Page" isUppercase={false} textSize="text-6xl" />

                {/* กรอบสี่เหลี่ยมด้านนอก */}
                <div className="relative inline-block w-[50vw] max-w-[800px]">
                    <img
                        src={frameImage}
                        alt="Frame"
                        className="w-full h-auto"
                    />

                    {/* กล่องสำหรับใส่เนื้อหา 'ข้างใน' กรอบนอก */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 gap-6 -translate-y-4">


                        <div className="relative w-[100%] h-[80%] flex justify-center items-center">
                            {/* รูปกรอบดำ */}
                            <img
                                src={innerFrameImage}
                                alt="Inner Black Frame"
                                className="absolute inset-0 w-full h-full object-fill"
                            />

                            {/* Textarea สำหรับพิมพ์ข้อความ (ซ้อนอยู่บนกรอบดำ) */}
                            <textarea
                                className="cyber-scrollbar relative w-full h-full bg-transparent border-none text-white font-bold font-handjet tracking-wider text-xl md:text-2xl p-6 md:p-8 focus:outline-none resize-none"
                                value={configText}
                                onChange={(e) => setConfigText(e.target.value)}
                                spellCheck={false} // ปิดเส้นใต้สีแดงเวลาพิมพ์คำศัพท์ที่เบราว์เซอร์ไม่รู้จัก
                            />
                        </div>

                        {/* โซนปุ่ม Submit */}
                        <CyberButton
                            altText="Submit"
                            width="w-50"
                            onClick={() => {
                                // เมื่อกด Submit ให้ลองปริ้นท์ค่าที่พิมพ์ออกมาดูครับ
                                console.log("Saved Config:", configText);
                                localStorage.setItem('gameConfig', configText);
                                alert("Configuration Saved!");
                            }}
                        />

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConfigPage;