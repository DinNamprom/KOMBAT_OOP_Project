import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg.svg';
import Title from "../components/Title.tsx";
import { useEffect } from "react";
import { api } from "../services/api";
import { v4 as uuidv4 } from 'uuid';

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
                const myId: string = uuidv4();
                const myId2: string = uuidv4();
                localStorage.setItem('Player1', myId);
                localStorage.setItem('Player2', myId2);
                // 1. Join Players (Assuming "Player 1" and "Player 2")
                // Note: JoinGame in backend might need to be called twice for DUEL
                await api.joinPlayer(gameID, myId);
                await api.joinPlayer(gameID, myId2);
                console.log(myId,"1 Join Success");
                console.log(myId2,"2 Join Success");

                // For other modes, backend start_game_setup will fill with bots
                // But for DUEL we might need to join Player 2 explicitly if we want human vs human
                // For now, let's just join Player 1 and let backend handle the rest based on mode
                
                // 2. Create Minion Kinds
                const configuredMinions = JSON.parse(localStorage.getItem('configuredMinions') || '{}');
                
                // Default DB to fallback if not configured
                const defaultDB: Record<string, any> = {
                    'char1': { name: 'RGM-79 GM', hp: 100, def: 10, spawnCost: 100, strategy: "move down" },
                    'char2': { name: 'ZAKU', hp: 120, def: 15, spawnCost: 150, strategy: "move forward" },
                    'char3': { name: 'Gundam', hp: 120, def: 15, spawnCost: 150, strategy: "move forward" },
                    'char4': { name: 'Red Comet', hp: 120, def: 15, spawnCost: 150, strategy: "move forward" },
                    'char5': { name: 'Zeong', hp: 120, def: 15, spawnCost: 150, strategy: "move forward" }
                };

                for (const charId of ['char1', 'char2', 'char3', 'char4', 'char5']) {
                    const minionData = configuredMinions[charId];
                    const name = minionData?.customName || defaultDB[charId].name;
                    const hp = minionData?.stats?.hp || defaultDB[charId].hp;
                    const spawncost = minionData?.stats?.spawnCost || defaultDB[charId].spawnCost;
                    const def = minionData?.stats?.def || defaultDB[charId].def;
                    const strategy = minionData?.strategyCode || defaultDB[charId].strategy;

                    await api.createMinionKind(gameID, {
                        name,
                        hp,
                        spawncost,
                        def,
                        strategy
                    });
                    console.log("Minion registered:", name);
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