package Strategist;

import Board.Grid;
import Minion.minion;

import java.util.ArrayList;
import java.util.List;

public class Player implements Strategist{
    private int Budget = 0;
    private double InterestRate = 0;
    private List<minion> Minions = new ArrayList<>();
    private int minionsCreated = 0;
    private final int max_minionsCreate;
    private List<Grid> grids = new ArrayList<>();
    private String name;

    public Player(String name, int maxMinionsCreate){
        this.name = name;
        this.max_minionsCreate = maxMinionsCreate;
    }
    @Override
    public void addMinion(minion minion) {
        if(minionsCreated == max_minionsCreate) return;
        minionsCreated++;
        Minions.add(minion);
    }

    @Override
    public void removeMinion(minion minion) {
        Minions.remove(minion);
    }

    @Override
    public void setBudget(int budget) {
        Budget = budget;
    }

    @Override
    public void setInterest(int interest) {
        InterestRate = interest;
    }

    @Override
    public void addGrid(Grid grid) {
        grids.add(grid);
    }

    public void clearGrid(){
        Minions.removeIf(m -> m.getHp() <= 0);
    }
}
