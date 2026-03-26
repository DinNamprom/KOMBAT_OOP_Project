package com.example.WebAPI.Strategist;


import com.example.WebAPI.Board.Grid;
import com.example.WebAPI.Config.GameConfig;
import com.example.WebAPI.GameEngine.Stage;
import com.example.WebAPI.GameEngine.turn;
import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Minion.minion_kind;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

public class NonePlayer extends Player {

    public NonePlayer(String name,UUID player_id, long maxMinionsCreate){
        super(name,player_id,maxMinionsCreate);
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
    public UUID getUUID() {
        return super.getUUID();
    }

    @Override
    public void set_player_dir(boolean player_dir) {
        super.set_player_dir(player_dir);
    }

    public void auto_action(turn t, Stage stage) {
        List<Grid> buyableGrid = stage.getBuyableGrids(this.getUUID());
        long hex_cost = stage.getConfig().HexCost;
        if (stage.getCurrentTurn() > 0) {
            if (getBudget() > hex_cost) {
                t.buy_grid(buyableGrid.getFirst(),this, hex_cost);
            }
        }
        List<minion_kind> kinds = new ArrayList<>(stage.getMinion_kinds().values());
        if (kinds.isEmpty()) return;
        minion_kind kind = kinds.get(new Random().nextInt(kinds.size()));
        boolean hasEmptyGrid = getGrids().stream().anyMatch(g -> !g.haveMinion());
        if (getBudget() >= kind.getSpawnCost() && hasEmptyGrid) {
                Random rand = new Random();
                Grid target;
                do {
                    target = super.getGrids().get(rand.nextInt(super.getGrids().size()));
                }while(target.haveMinion());
                if (!get_player_dir()) {
                    try {
                        t.buy_minion(this, kind, target.getRow(),target.getCol());
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                }else {
                    try {
                        t.buy_minion_inverse(this,kind, target.getRow(), target.getCol());
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    }
                }
        }
    }
}
