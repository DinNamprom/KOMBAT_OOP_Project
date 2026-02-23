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
    private final GameConfig config;
    private final Board board;

    public turn(int current_turn, GameConfig config, Board board) {
        this.current_turn = current_turn;
        this.config = config;
        this.board = board;
    }

    public long getCurrent_turn() {
        return current_turn;
    }

    public minion buy_minion(Strategist p, minion_kind kind, int row, int col) throws Exception {
        if (p.isMaxMinion()) return null;
        long cost = kind.getSpawnCost();
        if (current_turn != 1 && p.getBudget() < cost) return null;
        Grid target_grid = board.getGrid(row, col);
        if (target_grid == null || target_grid.haveMinion()) return null;
        if (current_turn != 1) p.decreaseBudget(cost);
        minion m = new minion(kind, p, config.initHp, row, col, p.getMinion_Create()+1);
        p.addMinion(m);
        target_grid.addMinion(m);
        m.setGrid(target_grid);
        p.updateVariable();
        return m;
    }

    public minion buy_minion_inverse(Strategist p, minion_kind kind, int row, int col) throws Exception {
        minion m = buy_minion(p, kind, row, col);
        m.setInverse(true);
        return m;
    }

    public void buy_grid(Grid grid, Strategist p, long hex_cost) {
        if (grid.canBeBoughtBy(p)){
            if (hex_cost <= p.getBudget()) {
                p.addGrid(grid);
                grid.setSpawnOwner(p);
                p.decreaseBudget(hex_cost);
                p.updateVariable();
            }
        }
    }

    public void turnSetup(Strategist p) {
        long cur_budget = p.getBudget();
        long interest = (long) (config.TurnInterest * (Math.log10((double) cur_budget)) * (Math.log( current_turn)));
        p.increaseBudget(interest);
        if (p.getBudget() >= config.maxBudget) {p.setBudget(config.maxBudget);}

        p.updateVariable();
        p.checkGolb_variable();
        p.addGolb_variable();
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
