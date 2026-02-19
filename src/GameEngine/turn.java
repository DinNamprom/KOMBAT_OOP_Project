package GameEngine;

import Board.Board;
import Board.Grid;
import Config.GameConfig;
import Minion.minion;
import Minion.minion_kind;
import Strategist.Strategist;

import java.util.Iterator;

public class turn {
    private final long current_turn;
    private final long max_turn;
    private final GameConfig config;
    private final Board board;

    public turn(int current_turn, GameConfig config, Board board) {
        this.current_turn = current_turn;
        this.config = config;
        this.max_turn = config.maxTurns;
        this.board = board;
    }

    public boolean buy_minion(Strategist p, minion_kind kind, int row, int col) throws Exception {
        if (p.isMaxMinion()) return false;
        long cost = kind.getSpawnCost();
        if (current_turn != 1 && p.getBudget() < cost) return false;
        Grid target_grid = board.getGrid(row, col);
        if (target_grid == null || target_grid.haveMinion()) return false;
        if (current_turn != 1) p.decreaseBudget(cost);
        minion m = new minion(kind, p, config.initHp, row, col, p.getMinion_Create()+1);
        p.addMinion(m);
        target_grid.addMinion(m);
        m.setGrid(target_grid);
        p.updateVariable();
        return true;
    }

    public void buy_grid(Grid grid, Strategist p, long hex_cost) {
        if (hex_cost <= p.getBudget()) {
            p.addGrid(grid);
            p.decreaseBudget(hex_cost);
            p.updateVariable();
        }
    }

    public void turnSetup(Strategist p) {

        long cur_budget = p.getBudget();
        long interest = (long) (config.TurnInterest * (Math.log10((double) cur_budget)) * (Math.log( current_turn)));
        p.increaseBudget(interest);

        p.updateVariable();
        p.checkGolb_variable();
        p.addGolb_variable();
    }

    public boolean isLastTurn() {
        return  current_turn >= max_turn;
    }

    public void minion_action(Strategist p) {
        p.updateVariable();
        for (minion m: p.getMinions()) {
            if (m.getHp() > 0) {
                try {
                    p.updateVariable();
                    m.setVariable();
                    m.setVariable(p.getGolbVariables());
                    m.action();
                    m.check_variable(p.getGolbVariables());
                }catch (Exception e) {
                    IO.println("Error: " + e.getMessage());
                }
            }
        }
    }

    public void setup(Strategist p) {
        p.checkGolb_variable();
        p.initVariable(config);
        p.addGolb_variable();
    }

    public void clear_minion(Strategist p) {
        Iterator<minion> it = p.getMinions().iterator();
        while (it.hasNext()) {
            minion m = it.next();
            if (m.getHp() <= 0) {
                if (m.getGrid() != null) {
                    m.getGrid().removeMinion();
                    m.setGrid(null);
                }
                it.remove();
            }
        }
    }
}
