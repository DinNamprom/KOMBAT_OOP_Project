import bgImage from '../assets/bg.svg';

import gridMockup from '../assets/GridMockUi.svg';
import uiPanelMockup from '../assets/MainGameMockUi.svg';

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
                    <img
                        src={gridMockup}
                        alt="Hexagon Grid"
                        // ปรับขนาดความกว้างตามความเหมาะสมของไฟล์ SVG
                        className="w-full max-w-[600px] xl:max-w-[600px] h-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    />
                </div>

                {/* แผง UI ควบคุมเกม (Status, ซื้อตัวละคร, ซื้อ Grid, ปุ่ม Execute) */}
                <div className="w-full xl:w-auto flex justify-center items-center">
                    <img
                        src={uiPanelMockup}
                        alt="Game Control UI"
                        className="w-full max-w-[500px] xl:max-w-[600px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                    />
                </div>

            </div>
        </div>
    );
};

export default MainGame;