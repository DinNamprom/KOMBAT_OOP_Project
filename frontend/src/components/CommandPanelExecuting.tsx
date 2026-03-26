import commandPanelExecuting from '../assets/CommandPanelLoading.svg';
import player1TurnImg from '../assets/Player1Turn.svg';
import player2TurnImg from '../assets/Player2Turn.svg';
import { ReactNode } from 'react';


const BaseCommandPanel = () => {

    return (
        <div className="relative w-full max-w-[500px] h-auto">
            {/* Background SVG */}
            <img
                src={commandPanelExecuting}
                alt="Command Panel Executing"
                className="w-full h-auto object-contain"
            />

        </div>
    );
};

export default BaseCommandPanel;
