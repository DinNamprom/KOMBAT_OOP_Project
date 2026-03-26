import {useNavigate} from 'react-router-dom';
import CyberButton from '../components/CyberButton';
import Title from '../components/Title';
import bgImage from '../assets/bg.svg';

const MainMenu = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen w-full flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="flex flex-col items-center gap-16">
                <Title text="KOMBAT"/>

                <div className="flex flex-col items-center gap-8">
                    <CyberButton
                        altText="Start"
                        // เปลี่ยนตรงนี้ให้ไปที่หน้า loading
                        onClick={() => navigate('/loadingMode')}
                    />
                    <CyberButton
                        altText="Edit Config"
                        onClick={() => navigate('/config')}
                    />
                </div>
            </div>
        </div>
    );
};

export default MainMenu;