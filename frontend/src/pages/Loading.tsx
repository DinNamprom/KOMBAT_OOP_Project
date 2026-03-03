import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';
import Title from "../components/Title.tsx"; // ใช้พื้นหลังเดียวกัน

const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // ตั้งเวลา 2 วินาที (2000 ms) แล้วไปหน้า /mode
        const timer = setTimeout(() => {
            navigate('/mode');
        }, 2000);

        // คืนค่าเพื่อล้าง timer ออกหาก component ถูกทำลายก่อนเวลา
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* ใส่ animate-pulse ให้ตัวหนังสือกระพริบช้าๆ เป็นเอฟเฟกต์ Loading */}
            <Title text="Loading" isUppercase={false} textSize="text-8xl "/>
        </div>
    );
};

export default Loading;