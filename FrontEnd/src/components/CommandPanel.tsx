import CyberButton from '../components/CyberButton';
import commandPanelBg from '../assets/CommandPanel.svg';
import player1TurnImg from '../assets/Player1Turn.svg';
import player2TurnImg from '../assets/Player2Turn.svg';

interface GameCommandPanelProps {
    currentTurn: number;
    maxTurns: number;
    currentPlayer: 1 | 2;
    goldAmount: number;
    gridCost: number;
    currentUnits: number;
    maxUnits: number;
    onBuyGrid: () => void;
    onSkipTurn: () => void;
}

const CommandPanel = ({
                          currentTurn,
                          maxTurns,
                          currentPlayer,
                          goldAmount,
                          gridCost,
                          currentUnits,
                          maxUnits,
                          onBuyGrid,
                          onSkipTurn,
                      }: GameCommandPanelProps) => {
    const playerTurnImg = currentPlayer === 1 ? player1TurnImg : player2TurnImg;

    return (
        <div className="relative w-full max-w-[500px] h-auto">
            {/* Background SVG - กำหนดขนาดของ panel ทั้งหมด */}
            <img
                src={commandPanelBg}
                alt="Command Panel"
                className="w-full h-auto object-contain"
            />

            {/* Turn Tab - ข้อความ Turn X/Y ซ้อนทับบน tab มุมซ้ายบน */}
            <div
                className="absolute flex items-center justify-center"
                style={{ left: '0.6%', top: '0.5%', width: '21.5%', height: '4.8%' }}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                    Turn {currentTurn}/{maxTurns}
                </span>
            </div>

            {/* Player Turn Banner - แบนเนอร์แสดงชื่อผู้เล่น */}
            <div
                className="absolute"
                style={{ left: '2.7%', top: '7.8%', width: '40%', height: '4.5%' }}
            >
                <img
                    src={playerTurnImg}
                    alt={`Player${currentPlayer}'s turn`}
                    className="h-full w-auto object-contain"
                />
            </div>

            {/* Gold Amount - ตัวเลขจำนวนทอง */}
            <div
                className="absolute flex items-center justify-center"
                style={{ left: '51.6%', top: '7.9%', width: '17.7%', height: '4.5%' }}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                    {goldAmount}
                </span>
            </div>

            {/* Unit Count - ตัวเลขจำนวนยูนิต */}
            <div
                className="absolute flex items-center justify-center"
                style={{ left: '78%', top: '7.9%', width: '17.7%', height: '4.5%' }}
            >
                <span
                    className="text-white font-handjet font-bold tracking-wider text-[1.8vw] xl:text-lg"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                >
                    {currentUnits}/{maxUnits}
                </span>
            </div>

            {/* Content Area - ปุ่มคำสั่งภายใน content area */}
            <div
                className="absolute flex flex-col items-center justify-center gap-[3%]"
                style={{ left: '2.7%', top: '15.6%', width: '93%', height: '61.6%' }}
            >
                {/* Buy Grid Button */}
                <CyberButton
                    onClick={onBuyGrid}
                    altText={`Buy Grid  💰 ${gridCost}`}
                />

                {/* Skip Turn Button */}
                <CyberButton
                    onClick={onSkipTurn}
                    altText="Skip"
                    width="w-40"
                />
            </div>
        </div>
    );
};

export default CommandPanel;
