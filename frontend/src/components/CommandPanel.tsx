import CyberButton from '../components/CyberButton';
import BaseCommandPanel from './BaseCommandPanel';

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
    return (
        <BaseCommandPanel
            currentPlayer={currentPlayer}
            currentTurn={currentTurn}
            maxTurn={maxTurns}
            goldAmount={goldAmount}
            currentUnits={currentUnits}
            maxUnits={maxUnits}
        >
            <div className="flex flex-col items-center justify-center gap-[6%] h-full w-full">
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
        </BaseCommandPanel>
    );
};

export default CommandPanel;
