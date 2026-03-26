package com.example.WebAPI.Strategist;


import com.example.WebAPI.Board.Grid;
import com.example.WebAPI.Config.GameConfig;
import com.example.WebAPI.Minion.minion;
import lombok.Setter;

import java.util.*;

public class Player implements strategist {
    private long Budget = 0;
    private long InterestRate = 0;
    private final List<minion> Minions = new ArrayList<>();
    private long minionsCreated = 0;
    private final long max_minionsCreate;
    private final List<Grid> grids = new ArrayList<>();
    private final String name;
    private final Map<String, Long> golb_variable = new HashMap<>();
    private boolean inverse = false;
    private final UUID uuid;

    public Player(String name,UUID player_id, long maxMinionsCreate){
        this.name = name;
        this.uuid = player_id;
        this.max_minionsCreate = maxMinionsCreate;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public List<minion> getMinions() {
        return Minions;
    }
    @Override
    public Map<String, Long> getGolbVariables() {
        return golb_variable;
    }
    @Override
    public void addMinion(minion minion) {
        if(minionsCreated == max_minionsCreate) return;
        minionsCreated++;
        Minions.add(minion);
    }
    @Override
    public long getMinion_Create() {return minionsCreated;}

    @Override
    public boolean isMaxMinion() {return minionsCreated == max_minionsCreate;}

    @Override
    public void removeMinion(minion minion) {
        Minions.remove(minion);
    }

    @Override
    public long getBudget() {
        return Budget;
    }

    @Override
    public void setBudget(long budget) {
        Budget = budget;
    }

    @Override
    public void decreaseBudget(long budget) {
        Budget -= budget;
    }
    @Override
    public void increaseBudget(long budget) {
        Budget += budget;
    }

    @Override
    public void setInterest(long interest) {
        InterestRate = interest;
    }

    @Override
    public List<Grid> getGrids() {return grids;}

    @Override
    public void addGrid(Grid grid) {
        grids.add(grid);
        grid.setSpawnOwner(this);
    }

    @Override
    public UUID getUUID() {return uuid;}

    public void clearGrid(){
        Minions.removeIf(m -> m.getHp() <= 0);
    }

    @Override
    public void initVariable(GameConfig config){
        golb_variable.put("Int", InterestRate);
        golb_variable.put("MaxBudget", config.maxBudget);
        golb_variable.put("SpawnsLeft", max_minionsCreate-minionsCreated);
    }

    @Override
    public void updateVariable() {
        golb_variable.put("Int", InterestRate);
        golb_variable.put("SpawnsLeft", max_minionsCreate-minionsCreated);
    }

    @Override
    public void checkGolb_variable() {
        for(minion m : Minions){
            Map<String, Long> m_variable = m.getVariable();
            minion.check_golbvar(golb_variable, m_variable);
        }
    }

    @Override
    public void addGolb_variable() {
        for (minion m : Minions) {
            m.setVariable(golb_variable);
        }
    }

    @Override
    public boolean get_player_dir() {
        return inverse;
    }

    @Override
    public void set_player_dir(boolean player_dir) {
        inverse = player_dir;
    }
}
