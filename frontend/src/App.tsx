import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import ConfigPage from './pages/ConfigPage';
import LoadingToModeSelect from "./pages/LoadingToModeSelect.tsx";
import ModeSelect from "./pages/ModeSelect.tsx";
import MinionSetup from "./pages/MinionSetup.tsx";
import MinionSetupByID from "./pages/MinionSetupByID.tsx";
import MainGame from "./pages/MainGame.tsx";
import LoadingToMainGame from "./pages/LoadingToMainGame.tsx";

function App() {
    return (
        // กำหนดเส้นทาง
        <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/loadingMode" element={<LoadingToModeSelect />} />
            <Route path="/mode" element={<ModeSelect />} />
            <Route path="/setup" element={<MinionSetup/>}/>
            <Route path="/setup/:charId" element={<MinionSetupByID/>}/>
            <Route path="/MainGame" element={<MainGame/>}/>
            <Route path="/loadingGame" element={<LoadingToMainGame/>}/>
        </Routes>
    );
}

export default App;