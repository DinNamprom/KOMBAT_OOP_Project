import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import ConfigPage from './pages/ConfigPage';
import Loading from "./pages/Loading.tsx";
import ModeSelect from "./pages/ModeSelect.tsx";
import MinionSetup from "./pages/MinionSetup.tsx";
import MinionSetupByID from "./pages/MinionSetupByID.tsx";
import MainGame from "./pages/MainGame.tsx";

function App() {
    return (
        // กำหนดเส้นทาง
        <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/mode" element={<ModeSelect />} />
            <Route path="/setup" element={<MinionSetup/>}/>
            <Route path="/setup/:charId" element={<MinionSetupByID/>}/>
            <Route path="/MainGame" element={<MainGame/>}/>
        </Routes>
    );
}

export default App;