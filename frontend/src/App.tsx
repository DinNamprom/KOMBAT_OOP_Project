import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import ConfigPage from './pages/ConfigPage';
import Loading from "./pages/Loading.tsx";
import ModeSelect from "./pages/ModeSelect.tsx";

function App() {
    return (
        // กำหนดเส้นทาง
        <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/mode" element={<ModeSelect />} />
        </Routes>
    );
}

export default App;