package Strategist;

import Board.Grid;
import Config.GameConfig;
import Minion.minion;

import java.util.List;
import java.util.Map;

public class NonePlayer extends Player{

    public NonePlayer(String name, long maxMinionsCreate){
        super(name,maxMinionsCreate);
    }
    @Override
    public List<minion> getMinions() {
        return super.getMinions();
    }
    public Map<String, Long> getGolbVariables() {
        return super.getGolbVariables();
    }

    @Override
    public String getName() {
        return super.getName();
    }

    @Override
    public void addMinion(minion minion) {
        super.addMinion(minion);
    }

    @Override
    public long getMinion_Create() {return super.getMinion_Create();}

    @Override
    public boolean isMaxMinion() {
        return super.isMaxMinion();
    }

    @Override
    public void removeMinion(minion minion) {
        super.removeMinion(minion);
    }

    @Override
    public long getBudget() {
        return super.getBudget();
    }

    @Override
    public void setBudget(long budget) {
        super.setBudget(budget);
    }

    @Override
    public void decreaseBudget(long budget) {
        super.decreaseBudget(budget);
    }

    @Override
    public void increaseBudget(long budget) {
        super.increaseBudget(budget);
    }

    @Override
    public void setInterest(long interest) {
        super.setInterest(interest);
    }

    @Override
    public List<Grid> getGrids() {return super.getGrids();}

    @Override
    public void addGrid(Grid grid) {
        super.addGrid(grid);
    }

    public void clearGrid(){
        super.clearGrid();
    }

    @Override
    public void initVariable(GameConfig config){
        super.initVariable(config);
    }

    @Override
    public void checkGolb_variable() {
        super.checkGolb_variable();
    }

    @Override
    public void addGolb_variable() {
        super.addGolb_variable();
    }

    @Override
    public boolean get_player_dir() {
        return super.get_player_dir();
    }

    @Override
    public void set_player_dir(boolean player_dir) {
        super.set_player_dir(player_dir);
    }

    public void auto_action() {}
}
