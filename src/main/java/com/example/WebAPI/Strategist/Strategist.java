package com.example.WebAPI.Strategist;

import Board.Grid;
import Config.GameConfig;
import Minion.minion;

import java.util.List;
import java.util.Map;


public interface Strategist {
    List<minion> getMinions();
    Map<String, Long> getGolbVariables();
    String getName();
    void addMinion(minion minion);
    void removeMinion(minion minion);
    long getBudget();
    void setBudget(long budget);
    void decreaseBudget(long budget);
    void increaseBudget(long budget);
    void setInterest(long interest);
    List<Grid> getGrids();
    void addGrid(Grid grid);
    void clearGrid();
    long getMinion_Create();
    boolean isMaxMinion();
    void initVariable(GameConfig config);
    void updateVariable();
    void checkGolb_variable();
    void addGolb_variable();
    boolean get_player_dir();
    void set_player_dir(boolean player_dir);
}
