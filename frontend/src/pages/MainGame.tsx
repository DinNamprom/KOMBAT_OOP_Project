import bgImage from '../assets/bg.svg';
import uiPanelMockup from '../assets/MainGameMockUI.svg';
// นำเข้า HexBoard ที่เราสร้างไว้
import HexBoard from '../components/HexBoard.tsx';

const MainGame = () => {
    return (
        <div
            className="min-h-screen w-full relative flex items-center justify-center overflow-hidden p-4 lg:p-8"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* คอนเทนเนอร์หลัก จัดเรียงแบบ Flex ซ้าย-ขวา */}
            <div className="flex flex-col xl:flex-row w-full max-w-[1600px] h-full items-center justify-center gap-10 xl:gap-20">

                {/* ฝั่งซ้าย: ตาราง Hexagon Grid */}
                <div className="w-full xl:w-auto flex justify-center items-center relative">
                    {/* ใช้ scale เพื่อย่อกระดานในหน้าจอเล็กๆ ไม่ให้ล้นจอ และใส่ Effect แสง */}
                    <div className="transform scale-[0.5] sm:scale-[0.6] md:scale-[0.8] xl:scale-100 origin-center drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                        <HexBoard />
                    </div>
                </div>

                {/* ฝั่งขวา: แผง UI ควบคุมเกม */}
                <div className="w-full xl:w-auto flex justify-center items-center">
                    <img
                        src={uiPanelMockup}
                        alt="Game Control UI"
                        className="w-full max-w-[400px] xl:max-w-[500px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                    />
                </div>

            </div>
        </div>
    );
};

export default MainGame;