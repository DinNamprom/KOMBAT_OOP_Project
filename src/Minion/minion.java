package Minion;

import Board.Grid;
import Parser.AST.Enum.Direction;
import Parser.AST.Enum.InfoType;
import Parser.AST.Statement.statement;
import Strategist.Strategist;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class minion {
    private final minion_kind kind;
    private final Strategist owner;
    public long cost;
    private Grid grid;
    private long hp;
    private int row;
    private int col;
    private Map<String, Long> variable;
    private final statement action;
    private boolean isDead = false;
    private boolean inverse = false;
    private final long num;

    public minion(minion_kind kind, Strategist owner, long initHp, int start_row, int start_col, long num) throws Exception {
        this.kind = kind;
        this.owner = owner;
        this.hp = initHp;
        this.row = start_row;
        this.col = start_col;
        variable = new HashMap<>();
        action = this.kind.getStrategy();
        this.num = num;
    }

    public minion_kind getKind() { return kind; }
    public int getRow() { return row; }
    public int getCol() { return col; }
    public Strategist getOwner() { return owner; }
    public long getHp() { return hp; }
    public Grid getGrid() { return grid; }
    public Map<String, Long> getVariable() { return variable; }
    public void setInverse(boolean inv) { inverse = inv; }
    public void resetInverse() { inverse = false; }
    public boolean getInvert() { return inverse; }
    public boolean isDead() { return isDead; }

    public void setGrid(Grid grid) { this.grid = grid; }

    public boolean move(Direction dir) {
        if(grid != null) {
            Grid target = grid.getGrid(inverse? Inverse_dir(dir):dir);
            if(target == null || target.haveMinion()) return false;
            grid.removeMinion();
            grid = target;
            target.addMinion(this);
            this.row = target.getRow();
            this.col = target.getCol();

            return true;
        }
        return false;
    }

    public void setVariable() {
        Random rand = new Random();
        variable.put("row", (long) row);
        variable.put("col", (long) col);
        variable.put("random", (long) rand.nextInt(1000));
    }

    public void setVariable(Map<String, Long> variable) {
        this.variable.putAll(variable);
    }

    public void action() {
        action.exe(this);
    }

    public Long Check(InfoType info) {
        Direction[] dir_list = {Direction.UP, Direction.UP_RIGHT, Direction.DOWN_RIGHT, Direction.DOWN, Direction.DOWN_LEFT, Direction.UP_LEFT};
        int i=0;
        Long result;
        while((result = CheckDir(info, dir_list[i]))/10 == 0) {
            i++;
            if (i >= dir_list.length) return 0L;
        }
        return result;
    }

    public Long CheckDir(InfoType info,Direction dir) {
        Direction actual_dir = inverse? Inverse_dir(dir):dir;
        Grid cur = grid.getGrid(actual_dir);
        long dist = 1;
        while(cur != null) {

            if(cur.haveMinion()) {
                minion m = cur.getMinion();
                boolean same_owner = owner.equals(m.getOwner());
                boolean isAlly = info == InfoType.ALLY;
                if (info == InfoType.NEARBY) {
                    long x = String.valueOf(m.getHp()).length();
                    long y = String.valueOf(m.getKind().defenseFactor()).length();
                    long z = dist*10+dirVal(dir);
                    long val = (100*x) + (10*y) + z;
                    return val*(same_owner? -1:1);
                }
                if(same_owner == isAlly) return dist*10+dirVal(dir);
                else return 0L;
            }
            cur = cur.getGrid(actual_dir);
            dist++;
        }
        return 0L;
    }

    private Long dirVal(Direction dir) {
        return switch (dir){
            case UP -> 1L;
            case DOWN -> 4L;
            case UP_LEFT -> 6L;
            case UP_RIGHT -> 2L;
            case DOWN_LEFT -> 5L;
            case DOWN_RIGHT -> 3L;
            case null, default -> 0L;
        };
    }

    private Direction Inverse_dir(Direction dir) {
        return switch (dir) {
            case UP -> Direction.DOWN;
            case DOWN -> Direction.UP;
            case UP_LEFT -> Direction.DOWN_RIGHT;
            case UP_RIGHT -> Direction.DOWN_LEFT;
            case DOWN_LEFT -> Direction.UP_RIGHT;
            case DOWN_RIGHT -> Direction.UP_LEFT;
        };
    }

    public void Shoot(Direction dir,long dmg) {
        if (this.grid == null) return;
        Direction actual_dir = inverse ? Inverse_dir(dir) : dir;
        Grid cur = this.grid.getGrid(actual_dir);
        while (cur != null) {
            if(cur.haveMinion()) {
                minion target = cur.getMinion();
                long def = target.getKind().defenseFactor();
                long r_dmg = Math.max(0, dmg-def);
                target.receive_dmg(r_dmg);
                return;
            }
            cur = cur.getGrid(actual_dir);
        }
    }
    public void receive_dmg(long dmg) {
        this.hp -= dmg;
        if(this.hp <= 0L) {
            this.hp = 0;
            if(this.grid != null) {
                this.grid.removeMinion();
                this.grid = null;
            }
            isDead = true;
        }
    }

    public void check_variable(Map<String, Long> golb_variable) {
        check_golbvar(golb_variable, variable);
    }

    public static void check_golbvar(Map<String, Long> golb_variable, Map<String, Long> variable) {
        for(String k:  variable.keySet()){
            if(k != null && !k.isEmpty()) {
                char c = k.charAt(0);
                if(c >= 'A' && c <= 'Z') {
                    golb_variable.put(k, variable.get(k));
                }
            }
        }
    }
}
