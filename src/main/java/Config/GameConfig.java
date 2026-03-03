package Config;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class GameConfig {
        public long initSpawnCost;
        public long HexCost;
        public long initBudget;
        public long initHp;
        public long turnBudget;
        public long maxBudget;
        public long TurnInterest;
        public long maxTurns;
        public long maxSpawns;

        // Constructor ว่าง
        public GameConfig() {}

        /**
         * เมธอดสำหรับโหลดไฟล์ config จาก path ที่กำหนด
         *
         * @param filePath ที่อยู่ของไฟล์ configuration
         */
        public void load(String filePath) throws IOException {
            Properties props = new Properties();

            // ใช้ try-with-resources เพื่อปิดไฟล์อัตโนมัติ
            try (FileInputStream fis = new FileInputStream(filePath)) {
                props.load(fis);
            }

            try {
                this.initSpawnCost = Long.parseLong(props.getProperty("spawn_cost"));
                this.HexCost = Long.parseLong(props.getProperty("hex_purchase_cost"));
                this.initBudget = Long.parseLong(props.getProperty("init_budget"));
                this.initHp = Long.parseLong(props.getProperty("init_hp"));
                this.turnBudget = Long.parseLong(props.getProperty("turn_budget"));
                this.maxBudget = Long.parseLong(props.getProperty("max_budget"));
                this.TurnInterest = Long.parseLong(props.getProperty("interest_pct"));
                this.maxTurns = Long.parseLong(props.getProperty("max_turns"));
                this.maxSpawns = Long.parseLong(props.getProperty("max_spawns"));
            } catch (NumberFormatException e) {
                System.err.println("Error: Config Value Must Be Long ");
                throw e;
            } catch (NullPointerException e) {
                System.err.println("Error: Missing Config Value");
                throw e;
            }

        }

        @Override
        public String toString() {
            return "GameConfig {" +
                    "\n  spawn_cost=" + initSpawnCost +
                    "\n  hex_purchase_cost=" + HexCost +
                    "\n  init_budget=" + initBudget +
                    "\n  init_hp=" + initHp +
                    "\n  turn_budget=" + turnBudget +
                    "\n  max_budget=" + maxBudget +
                    "\n  interest_pct=" + TurnInterest +
                    "\n  max_turns=" + maxTurns +
                    "\n  max_spawns=" + maxSpawns +
                    "\n}";
        }
}

