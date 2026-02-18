package Board;

public class Board {
    private Grid current;
    private int max_row,max_col;
    public Board(int row, int col) {
        current = new Grid(1,1);
        current.createBoard(row,col);
        this.max_row = row;
        this.max_col = col;
    }
    public Board() {
        current = new Grid(1,1);
        current.createBoard(8,8);
        this.max_row = 8;
        this.max_col = 8;
    }

    public Grid getCurrent() {
        return current;
    }

    public Grid getGrid(int row, int col) {
        return Grid.findGrid(current, row, col);
    }

    public void printBoard() {
        for (int r = 1; r <= max_row; r++) {
            if (r % 2 == 0) System.out.print("  ");

            for (int c = 1; c <= max_col; c++) {
                Grid g = getGrid(r, c);
                if (g != null) {
                    System.out.printf("[%d,%d] ", r, c);
                } else {
                    System.out.print("[   ] ");
                }
            }
            System.out.println();
        }
    }
}
