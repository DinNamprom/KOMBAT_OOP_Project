import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';
import Title from "../components/Title.tsx";
import { useEffect } from "react";
import { api } from "../services/api";

const LoadingToMainGame = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const initializeGame = async () => {
            const gameID = localStorage.getItem('gameID');
            if (!gameID) {
                console.error("No gameID found in localStorage");
                navigate('/');
                return;
            }

            try {
                // 1. Join Players (Assuming "Player 1" and "Player 2")
                // Note: JoinGame in backend might need to be called twice for DUEL
                await api.joinPlayer(gameID, "Player 1");
                // For other modes, backend start_game_setup will fill with bots
                // But for DUEL we might need to join Player 2 explicitly if we want human vs human
                // For now, let's just join Player 1 and let backend handle the rest based on mode
                
                // 2. Create Minion Kinds
                const configuredMinions = JSON.parse(localStorage.getItem('configuredMinions') || '{}');
                for (const charId in configuredMinions) {
                    const minionData = configuredMinions[charId];
                    await api.createMinionKind(gameID, {
                        name: minionData.customName,
                        hp: minionData.stats.hp,
                        spawncost: minionData.stats.spawnCost,
                        def: minionData.stats.def,
                        strategy: minionData.strategyCode
                    });
                    console.log("Minion created with NAME:", minionData.customName);
                }

                // 3. Start Game
                const started = await api.startGame(gameID);
                if (started) {
                    console.log("Game started successfully");
                    navigate('/MainGame');
                } else {
                    console.error("Failed to start game");
                    alert("Failed to start game. Check if all players joined.");
                    navigate('/setup');
                }
            } catch (error) {
                console.error("Error initializing game:", error);
                alert("Error connecting to backend.");
                navigate('/');
            }
        };

        initializeGame();
    }, [navigate]);

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
            <Title text="Initializing Game" textSize="text-8xl" isUppercase={false}/>
        </div>
    );
};

export default LoadingToMainGame;