interface TitleProps {
    text: string;
    textSize?: string;
    // 1. เพิ่ม Prop ใหม่เป็น boolean เพื่อกำหนดว่าจะให้เป็นตัวพิมพ์ใหญ่หรือไม่
    isUppercase?: boolean;
}

// 2. กำหนดค่าเริ่มต้นให้ isUppercase = true (หน้าเก่าๆ จะได้ไม่ต้องตามไปแก้)
const Title = ({text, textSize = 'text-8xl', isUppercase = true}: TitleProps) => {
    return (
        <h1
            // 3. ใช้เงื่อนไข Ternary ( ? : ) เช็คว่าถ้าเป็น true ให้ใส่ 'uppercase' ถ้า false ให้ปล่อยว่าง ('')
            className={`justify-center text-[#FFFFFF] font-bold ${textSize} font-handjet pointer-events-none tracking-wider ${isUppercase ? 'uppercase' : ''}`}
            style={{textShadow: '1px 1px 1px #2B8DF0'}}
        >
            {text}
        </h1>
    );
};

export default Title;