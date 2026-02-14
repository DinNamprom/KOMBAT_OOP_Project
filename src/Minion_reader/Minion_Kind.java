package Minion_reader;

public class Minion_Kind {
    private final String name;
    private long spawncost;
    private long atk;
    private long defenseFactor;
    private String strategyScript;


    public Minion_Kind(String name,long SpawnCost,long atk, long defenseFactor, String strategyScript) {
        this.name = name;
        this.spawncost = SpawnCost;
        this.atk = atk;
        this.defenseFactor = defenseFactor;
        this.strategyScript = strategyScript;
    }

    public String getName() { return name; }
    public long getSpawnCost() { return spawncost; }
    public long getAtk() { return atk; }
    public long getDefenseFactor() { return defenseFactor; }
    public String getStrategyScript() { return strategyScript; }

    public static class Main {
        public static void main(String[] args) {


            // Text Blocks (""") โค้ดด้านในจะรักษารูปแบบการย่อหน้าและการขึ้นบรรทัดใหม่ไว้ทั้งหมด
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

            // test
            System.out.println("=== ข้อมูล Minion Kind ===");
            System.out.println("name: " + knightKind.getName());
            System.out.println("cost: " + knightKind.getSpawnCost());
            System.out.println("Atk: " + knightKind.getAtk());
            System.out.println("Def: " + knightKind.getDefenseFactor());
            System.out.println("--- Strategy Script ---");
            System.out.println(knightKind.getStrategyScript());
        }
    }
}