package com.example.WebAPI.GameEngine;

import com.example.WebAPI.Board.Board;
import com.example.WebAPI.Board.Grid;
import com.example.WebAPI.Config.GameConfig;
import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Minion.minion_kind;
import com.example.WebAPI.Strategist.strategist;
import lombok.Getter;

import java.util.Iterator;

public class turn {
    @Getter
    private final long current_turn;
    private final GameConfig config;
    private final Board board;

    public turn(int current_turn, GameConfig config, Board board) {
        this.current_turn = current_turn;
        this.config = config;
        this.board = board;
    }

    public minion buy_minion(strategist p, minion_kind kind, int row, int col) throws Exception {
        if (p.isMaxMinion()) return null;
        long cost = kind.getSpawnCost();
        if (current_turn != 1 && p.getBudget() < cost) return null;
        Grid target_grid = board.getGrid(row, col);
        if (target_grid == null || target_grid.haveMinion()) return null;
        if (current_turn != 1) p.decreaseBudget(cost);
        minion m = new minion(kind, p, config.initHp, row, col);
        p.addMinion(m);
        target_grid.addMinion(m);
        m.setGrid(target_grid);
        p.updateVariable();
        return m;
    }

    public minion buy_minion_inverse(strategist p, minion_kind kind, int row, int col) throws Exception {
        minion m = buy_minion(p, kind, row, col);
        m.setInverse(true);
        return m;
    }

    public void buy_grid(Grid grid, strategist p, long hex_cost) {
        if (grid.canBeBoughtBy(p)){
            if (hex_cost <= p.getBudget()) {
                p.addGrid(grid);
                grid.setSpawnOwner(p);
                p.decreaseBudget(hex_cost);
                p.updateVariable();
            }
        }
    }

    public void turnSetup(strategist p) {
        long cur_budget = Math.max(1, p.getBudget());
        long interest = (long) (config.TurnInterest * (Math.log10((double) cur_budget)) * (Math.log( Math.max(1, current_turn) )));
        p.increaseBudget(interest);
        if (p.getBudget() >= config.maxBudget) {p.setBudget(config.maxBudget);}

        p.updateVariable();
        p.checkGolb_variable();
        p.addGolb_variable();
    }

    public void minion_action(strategist p) {
        p.updateVariable();
        for (minion m: p.getMinions()) {
            if (m.getHp() > 0) {
                try {
                    p.updateVariable();
                    m.setVariable();
                    m.setVariable(p.getGolbVariables());
                    m.clearActions();
                    m.action();
                    m.check_variable(p.getGolbVariables());
                }catch (Exception e) {
                    System.out.println("Error: " + e.getMessage());
                }
            }
        }
    }

    public void setup(strategist p) {
        p.checkGolb_variable();
        p.initVariable(config);
        p.addGolb_variable();
    }

    public void clear_minion(strategist p) {
        Iterator<minion> it = p.getMinions().iterator();
        while (it.hasNext()) {
            minion m = it.next();
            if (m.isDead()) {
                if (m.getGrid() != null) {
                    m.getGrid().removeMinion();
                    m.setGrid(null);
                }
                it.remove();
            }
        }
    }
}


