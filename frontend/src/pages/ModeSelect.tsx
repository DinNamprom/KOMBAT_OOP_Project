import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';

import solitaireBanner from '../assets/Banner/solitaire.svg';
import duelBanner from '../assets/Banner/duel.svg';
import autoBanner from '../assets/Banner/auto.svg';
import BackButton from "../components/BackButton.tsx";

const ModeSelect = () => {
    const navigate = useNavigate();

    // ข้อมูลจำลองสำหรับวนลูปสร้าง Banner เพื่อให้โค้ดคลีนขึ้น
    const modes = [
        { id: 'solitaire', name: 'Solitaire', img: solitaireBanner, path: '/setup' },
        { id: 'duel', name: 'Duel', img: duelBanner, path: '/setup' },
        { id: 'auto', name: 'Auto', img: autoBanner, path: '/setup' },
    ];

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center relative"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* ปุ่ม Back มุมซ้ายบน */}
            <BackButton onClick={() => navigate("/")}/>

            {/* คอนเทนเนอร์ใส่ Banner ทั้ง 3 อัน */}
            <div className="flex flex-row gap-6 md:gap-12 items-center justify-center translate-y-8">
                {modes.map((mode) => (
                    <div
                        key={mode.id}
                        onClick={() => navigate(mode.path)}
                        className="group relative cursor-pointer hover:-translate-y-4 hover:scale-105 transition-all duration-300"
                    >
                        {/* กรอบ Banner และ รูปภาพ */}
                        <div className="h-[534px] w-[267px]">
                            <img
                                src={mode.img}
                                alt={mode.name}
                                className="w-full h-full object-cover transition-all"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModeSelect;