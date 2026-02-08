import Phaser.*;
import Phaser.AST.Statement.Statement;

import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) throws Exception {
        String sourceCode = """
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

        System.out.println("--- 1. Source Code ---");
        System.out.println(sourceCode);
        System.out.println("----------------------");

        try {
            parser p = new parser(sourceCode);
            Statement root = p.parse();

            System.out.println("--- 2. Parsed Successfully ---");
            Map<String, Long> variables = new HashMap<>();

            variables.put("random", 0L);

            System.out.println("--- 3. Start Execution (Eval/Exe) ---");

            root.exe(variables);

            System.out.println("----------------------");
            System.out.println("--- 4. Final Memory State ---");
            // ดูค่าตัวแปรหลังจบโปรแกรม
            for (Map.Entry<String, Long> entry : variables.entrySet()) {
                System.out.println(entry.getKey() + " = " + entry.getValue());
            }

        } catch (Exception e) {
            IO.println(e.getMessage());
        }
    }
}
