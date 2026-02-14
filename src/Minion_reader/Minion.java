package Minion_reader;

public class Minion {
    private final Minion_Kind kind;
    private final int owner;
    private long hp;
    private int row;
    private int col;


public Minion(Minion_Kind kind, int owner, long initHp, int startRow, int startCol) {
    this.kind = kind;
    this.owner = owner;
    this.hp = initHp;
    this.row = startRow;
    this.col = startCol;
    }

    public Minion_Kind getKind() { return kind; }
    public int getRow() { return row; }
    public int getCol() { return col; }
    public int getOwner() { return owner; }
    public long getHp() { return hp; }


    public static class Main {
        public static void main(String[] args) {
            String longStrategyScript = """
            t = 0
            hp = 100
            
            # Test Loop
            while (3 - t) {
                t = t + 1
                move up
            }
            
            # Test InfoExpr
            if (ally) then {
                shoot down 50
            } else {
                move down
            }
            
            done
            """;



            Minion_Kind knightKind = new Minion_Kind("Knight",100, 10,10, longStrategyScript);
            Minion Mon = new Minion(knightKind,1, 100,1, 1);

            // test
            System.out.println("Owner: " + Mon.getOwner());
            System.out.println("HP: " + Mon.getHp());
            System.out.println("Row, Col: " + Mon.getRow() + ", " + Mon.getCol());
            System.out.println("Minion Kind: " + Mon.getKind().getName());
            System.out.println("Script: " + longStrategyScript);
        }
    }
}
