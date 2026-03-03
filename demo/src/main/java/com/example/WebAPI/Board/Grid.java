package Board;

import Minion.minion;
import Parser.AST.Enum.Direction;
import Strategist.Strategist;

public class Grid {
    private final int row;
    private final int col;
    private Grid up,down,upleft,downleft,upright,downright;
    private Strategist spawnOwner = null;
    private minion minion;
    public Grid(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public int getRow() {return row;}
    public int getCol() {return col;}

    public Strategist getSpawnOwner() { return spawnOwner; }
    public void setSpawnOwner(Strategist player) { this.spawnOwner = player; }
    public boolean isSpawnable() { return spawnOwner != null; }

    public minion getMinion() {return minion;}
    public void addMinion(minion m) {minion=m;}
    public void removeMinion() {minion=null;}

    //check if at least one nearby grid is owned and the grid owner is null
    public boolean canBeBoughtBy(Strategist p) {
        if (this.spawnOwner != null) {
            return false;
        }

        Direction[] dirs = {
                Direction.UP, Direction.DOWN,
                Direction.UP_LEFT, Direction.UP_RIGHT,
                Direction.DOWN_LEFT, Direction.DOWN_RIGHT
        };

        for (Direction dir : dirs) {
            Grid neighbor = this.getGrid(dir);
            if (neighbor != null && neighbor.getSpawnOwner() == p) {
                return true;
            }
        }

        return false;
    }

    public Grid getGrid(Direction direction) {
        return switch (direction) {
            case UP -> up;
            case DOWN -> down;
            case UP_LEFT -> upleft;
            case UP_RIGHT -> upright;
            case DOWN_LEFT -> downleft;
            case DOWN_RIGHT -> downright;
        };
    }
    public Grid createDirection(Direction direction) {
        switch (direction) {
            case UP -> {
                up = new Grid(row - 1, col);
                up.down = this;
                return up;
            }
            case DOWN -> {
                down = new Grid(row + 1, col);
                down.up = this;
                return down;
            }
            case UP_LEFT -> {
                upleft = new Grid(row, col - 1);
                upleft.downright = this;
                return upleft;
            }
            case UP_RIGHT -> {
                upright = new Grid(row, col + 1);
                upright.downleft = this;
                return upright;
            }
            case DOWN_LEFT -> {
                downleft = new Grid(row, col - 1);
                downleft.upright = this;
                return downleft;
            }
            case DOWN_RIGHT -> {
                downright = new Grid(row, col + 1);
                downright.upleft = this;
                return downright;
            }
            default -> throw new IllegalArgumentException("Invalid direction");
        }
    }
    public void createRow(int max_col) {
        if (col >= max_col) return;
        Grid nextGrid;
        if (isEven(this.col)) {
            nextGrid = this.createDirection(Direction.DOWN_RIGHT);
        } else {
            nextGrid = this.createDirection(Direction.UP_RIGHT);
        }
        nextGrid.createRow(max_col);
    }

    public void createBoard(int max_row, int max_col) {
        this.createRow(max_col);
        if (this.row >= max_row) return;
        Grid nextRowHead = this.createDirection(Direction.DOWN);
        nextRowHead.createBoard(max_row, max_col);
        connectRows(this, nextRowHead);
    }

    private void connectRows(Grid topRow, Grid bottomRow) {
        Grid top = topRow;
        Grid bot = bottomRow;
        while (top != null && bot != null) {
            top.down = bot;
            bot.up = top;
            if (isEven(top.getCol())) {
                if (top.getPrevCol() != null) {
                    bot.upleft = top.getPrevCol();
                    top.getPrevCol().downright = bot;
                }
                if (top.getNextCol() != null) {
                    bot.upright = top.getNextCol();
                    top.getNextCol().downleft = bot;
                }
            }
            top = top.getNextCol();
            bot = bot.getNextCol();
        }

    }

    public static Grid findGrid(Grid root, int targetRow, int targetCol) {
        Grid cur = root;
        while (cur != null && cur.getRow() < targetRow) {
            cur = cur.getGrid(Direction.DOWN);
        }
        while (cur != null && cur.getCol() < targetCol) {
            cur = cur.getNextCol();
        }
        return cur;
    }

    public static void checkNeighbors(Grid root, int r, int c) throws Exception {
        Grid g = findGrid(root, r, c);
        if (g == null) {
            throw new Exception("Cannot find grid (" + r + "," + c + ")");
        }

        System.out.println("Center: (" + g.getRow() + "," + g.getCol() + ")");

        printLink("UP       ", g.up);
        printLink("DOWN     ", g.down);
        printLink("UP_LEFT  ", g.upleft);
        printLink("UP_RIGHT ", g.upright);
        printLink("DOWN_LEFT", g.downleft);
        printLink("DOWN_RIGHT", g.downright);
    }

    private static void printLink(String dirName, Grid target) {
        if (target != null) {
            System.out.println("  -> " + dirName + ": (" + target.getRow() + "," + target.getCol() + ")");
        } else {
            System.out.println("  -> " + dirName + ": null");
        }
    }

    public Grid getNextCol() {
        if (isEven(col)) return downright;
        return upright;
    }

    public Grid getPrevCol() {
        if (isEven(col)) return downleft;
        return upleft;
    }
    public boolean haveMinion() {return minion != null;}
    public static boolean isEven(int i) {
        return i%2==0;
    }
}
