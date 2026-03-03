import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';

// สมมติว่าไฟล์ SVG ของ Banner เก็บไว้ในโฟลเดอร์ assets (เปลี่ยน path ตามจริงได้เลยครับ)
import solitaireBanner from '../assets/solitaire.svg';
import duelBanner from '../assets/duel.svg';
import autoBanner from '../assets/auto.svg';
import backBtnImage from "../assets/back-button.svg";

const ModeSelect = () => {
    const navigate = useNavigate();

    // ข้อมูลจำลองสำหรับวนลูปสร้าง Banner เพื่อให้โค้ดคลีนขึ้น
    const modes = [
        { id: 'solitaire', name: 'Solitaire', img: solitaireBanner, path: '/play/solitaire' },
        { id: 'duel', name: 'Duel', img: duelBanner, path: '/play/duel' },
        { id: 'auto', name: 'Auto', img: autoBanner, path: '/play/auto' },
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
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 bg-transparent border-none p-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
                <img
                    src={backBtnImage}
                    alt="Back"
                    className="w-30 md:w-40 h-auto"
                />
            </button>

            {/* คอนเทนเนอร์ใส่ Banner ทั้ง 3 อัน */}
            <div className="flex flex-row gap-6 md:gap-12 items-center justify-center">
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