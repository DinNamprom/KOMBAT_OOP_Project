package Strategist;

import Board.Grid;
import Minion.minion;

public interface Strategist {
    void addMinion(minion minion);
    void removeMinion(minion minion);
    void setBudget(int budget);
    void setInterest(int interest);
    void addGrid(Grid grid);
    void clearGrid();
}
