import imageSrc from '../assets/Button.svg';

interface CyberButtonProps {
    onClick?: () => void;
    altText: string;
    width?: string;
}

const CyberButton = ({ onClick, altText, width = "w-70" }: CyberButtonProps) => {
    return (
        <button
            onClick={onClick}
            // ใช้ relative เพื่อเป็นจุดอ้างอิงให้ข้อความด้านใน
            // ใช้ inline-block เพื่อให้ขนาดปุ่มพอดีกับรูปภาพ
            className="relative inline-block bg-transparent border-none p-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
        >
            {/* 1. รูปภาพเป็นฐาน (Background Layer) */}
            <img
                src={imageSrc}
                alt={altText}
                className={`${width} h-auto object-contain block`}
            />

            {/* 2. ข้อความซ้อนทับ (Overlay Layer) */}
            {/* absolute inset-0 ทำให้ span มีขนาดเท่าปุ่ม และใช้ flex จัดกึ่งกลาง */}
            <span className="absolute inset-0 flex items-center justify-center text-[#FFFFFF] font-bold text-3xl font-handjet pointer-events-none tracking-wider"
                  style={{ textShadow: '1px 1px 1px #2B8DF0' }}>
                {altText}
            </span>
        </button>
    );
};

export default CyberButton;