import Title from './Title'; // ตรวจสอบ Path ให้ตรงกับโปรเจกต์ของคุณ
import frameImage from '../assets/config-frame.svg';
import innerFrameImage from '../assets/inner-black-frame.svg';

// สร้าง Interface รับค่า Props จากหน้า CharacterSetup
interface StrategyTextBoxProps {
    value: string;
    onChange: (newValue: string) => void;
}

const StrategyTextBox = ({ value, onChange }: StrategyTextBoxProps) => {
    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <Title text="Minion Strategy" isUppercase={false} textSize="text-5xl md:text-6xl" />

            {/* กรอบสี่เหลี่ยมด้านนอก ปรับเป็น w-full เพื่อให้ยืดหยุ่น */}
            <div className="relative inline-block w-full max-w-[800px]">
                <img
                    src={frameImage}
                    alt="Outer Frame"
                    className="w-full h-auto"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 gap-4 -translate-y-4">
                    <div className="relative w-full h-[75%] flex justify-center items-center">
                        <img
                            src={innerFrameImage}
                            alt="Inner Black Frame"
                            className="absolute inset-0 w-full h-full object-fill"
                        />

                        {/* Textarea ที่รับค่า value และ onChange จาก Props */}
                        <textarea
                            className="cyber-scrollbar relative w-full h-full bg-transparent border-none text-white font-bold font-handjet tracking-wider text-xl md:text-2xl p-6 md:p-8 focus:outline-none resize-none"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategyTextBox;