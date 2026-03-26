import frameImage from '../assets/config-frame.svg';
import innerFrameImage from '../assets/inner-black-frame.svg';
import Title from "./Title.tsx";

// สร้าง Interface รับค่า Props จากหน้า CharacterSetup
interface StrategyTextBoxProps {
    value: string;
    onChange: (newValue: string) => void;
}

const StrategyTextBox = ({value, onChange}: StrategyTextBoxProps) => {
    return (
        <div className="flex flex-col items-center gap-2 w-full">
            {/* กรอบสี่เหลี่ยมด้านนอก */}
            <div className="relative inline-block w-full max-w-[750px]">
                <img
                    src={frameImage}
                    alt="Outer Frame"
                    className="w-full h-auto"
                />

                {/* Container มี Title, TextBox */}
                <div className="absolute inset-0 flex flex-col items-start justify-start p-8 -translate-y-4 gap-3">

                    {/* Header */}
                    <Title text="Minion Strategy" isUppercase={false} textSize="text-5xl"/>

                    {/* TextBox Container */}
                    <div className="relative w-full h-[80%] flex justify-center items-center">
                        <img
                            src={innerFrameImage}
                            alt="Inner Black Frame"
                            className="absolute inset-0 w-full h-full object-fill"
                        />

                        {/* Textarea */}
                        <textarea
                            className="cyber-scrollbar relative w-full h-full bg-transparent border-none text-white font-bold font-handjet tracking-wider text-xl p-5 focus:outline-none resize-none"
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