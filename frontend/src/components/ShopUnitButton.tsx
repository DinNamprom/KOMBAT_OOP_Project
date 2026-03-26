import React from 'react';

interface ShopUnitButtonProps {
    unitId: string;
    unitName: string;
    imageSrc: string;
    cost: number;
    widthClass?: string;
    onClick: (unitId: string) => void;
}

const ShopUnitButton: React.FC<ShopUnitButtonProps> = ({
                                                           unitId,
                                                           unitName,
                                                           imageSrc,
                                                           cost,
                                                           widthClass = "w-[28%]", // ค่าเริ่มต้นสำหรับการแสดงผล 3 ชิ้นต่อแถว
                                                           onClick
                                                       }) => {
    return (
        <button
            onClick={() => onClick(unitId)}
            className={`group relative cursor-pointer bg-transparent border-none p-0 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none ${widthClass}`}
        >
            <img
                src={imageSrc}
                alt={unitName}
                className="w-full h-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_12px_rgba(43,141,240,0.6)]"
            />
            {/* Overlay ราคาเพื่อทับตัวเลขเดิมในรูปภาพ */}
            <div
                className="absolute flex justify-center items-center pointer-events-none"
                style={{
                    bottom: '4%',
                    left: '50%',
                    transform: 'translateX(-30%)',
                    width: '30%',
                    height: '14%',
                }}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-xl text-shadow-lg"
                >
                    {cost}
                </span>
            </div>
        </button>
    );
};

export default ShopUnitButton;
