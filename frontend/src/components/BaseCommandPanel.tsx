import commandPanelBg from '../assets/CommandPanel.svg';
import player1TurnImg from '../assets/Player1Turn.svg';
import player2TurnImg from '../assets/Player2Turn.svg';
import {ReactNode} from 'react';

interface BaseCommandPanelProps {
    currentTurn: number | string;
    maxTurn?: number;
    currentPlayer: 1 | 2;
    goldAmount: number;
    currentUnits: number;
    maxUnits: number;
    children: ReactNode;
}

const BaseCommandPanel = ({
                              currentTurn,
                              maxTurn,
                              currentPlayer,
                              goldAmount,
                              currentUnits,
                              maxUnits,
                              children
                          }: BaseCommandPanelProps) => {
    const playerTurnImg = currentPlayer === 1 ? player1TurnImg : player2TurnImg;

    return (
        <div className="relative w-full max-w-[500px] h-auto">
            {/* Background SVG */}
            <img
                src={commandPanelBg}
                alt="Command Panel"
                className="w-full h-auto object-contain"
            />

            {/* Turn Tab */}
            <div
                className="absolute flex items-center justify-center"
                style={{left: '0.6%', top: '0.5%', width: '21.5%', height: '4.8%'}}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}
                >
                    Turn {currentTurn}{maxTurn !== undefined ? `/${maxTurn}` : ''}
                </span>
            </div>

            {/* Player Turn Banner */}
            <div
                className="absolute"
                style={{left: '2.7%', top: '7.8%', width: '40%', height: '4.5%'}}
            >
                <img
                    src={playerTurnImg}
                    alt={`Player${currentPlayer}'s turn`}
                    className="h-full w-auto object-contain"
                />
            </div>

            {/* Gold Amount */}
            <div
                className="absolute flex items-center justify-center"
                style={{left: '46%', top: '7.8%', width: '23%', height: '4.5%'}}
            >
                <div className="flex-1 flex items-center justify-center">
                    <span
                        className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                        style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}
                    >
                        {goldAmount}
                    </span>
                </div>
            </div>

            {/* Unit Count */}
            <div
                className="absolute flex items-center justify-center"
                style={{left: '78%', top: '7.9%', width: '17.7%', height: '4.5%'}}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}
                >
                    {currentUnits}/{maxUnits}
                </span>
            </div>

            {/* Content Area */}
            <div
                className="absolute flex flex-col items-center"
                style={{left: '2.7%', top: '15.6%', width: '93%', height: '61.6%'}}
            >
                {children}
            </div>
        </div>
    );
};

export default BaseCommandPanel;
