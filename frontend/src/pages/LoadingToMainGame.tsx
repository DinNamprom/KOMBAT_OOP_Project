// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import bgImage from '../assets/bg.svg';
import Title from "../components/Title.tsx";
import {useEffect} from "react";

const LoadingToMainGame = () => {
    const navigate = useNavigate();

    useEffect(() => {

            const minimumTimer = new Promise((resolve) => setTimeout(resolve, 500));

            Promise.all([minimumTimer]).then(() => {
                navigate('/MainGame');

            });
    }, [navigate]);

    // useEffect(() => {
    //     // รายชื่อรูปภาพทั้งหมดที่ต้องโหลด
    //     const imagesToPreload = [bgImage, solitaireBanner, duelBanner, autoBanner];
    //
    //     // ฟังก์ชันสำหรับจำลองการโหลดรูปเข้า Browser Cache
    //     const preloadImages = (urls: string[]) => {
    //         return Promise.all(
    //             urls.map((url) => {
    //                 return new Promise((resolve) => {
    //                     const img = new Image();
    //                     img.src = url;
    //                     // ไม่ว่าจะโหลดสำเร็จหรือพัง ก็ให้ resolve เพื่อไม่ให้แอปค้าง
    //                     img.onload = resolve;
    //                     img.onerror = resolve;
    //                 });
    //             })
    //         );
    //     };
    //
    //     // สร้าง Promise 2 ตัว:
    //     // 1. ตัวนับเวลา 2 วินาที
    //     const minimumTimer = new Promise((resolve) => setTimeout(resolve, 500));
    //
    //     // 2. ตัวโหลดรูปภาพ
    //     const imageLoading = preloadImages(imagesToPreload);
    //
    //     // รอให้ "ทั้งสองอย่าง" ทำงานเสร็จ ค่อยเปลี่ยนหน้า
    //     Promise.all([minimumTimer, imageLoading]).then(() => {
    //         navigate('/MainGame');
    //     });
    //
    // }, [navigate]);

    return (
        <div
            className="min-h-screen w-full flex items-center justify-center bg-black"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <Title text="Loading" textSize="text-8xl" isUppercase={false}/>
        </div>
    );
};

export default LoadingToMainGame;