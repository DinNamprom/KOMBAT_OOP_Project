import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

 class gameconfig {
    public static class GameConfig {
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
         * @param filePath ที่อยู่ของไฟล์ configuration
         * @return Object GameConfig ที่บรรจุค่าเรียบร้อยแล้ว
         */
        public static GameConfig load(String filePath) throws IOException {
            Properties props = new Properties();

            // ใช้ try-with-resources เพื่อปิดไฟล์อัตโนมัติ
            try (FileInputStream fis = new FileInputStream(filePath)) {
                props.load(fis);
            }

            GameConfig config = new GameConfig();

            try {
                config.initSpawnCost = Long.parseLong(props.getProperty("spawn_cost"));
                config.HexCost = Long.parseLong(props.getProperty("hex_purchase_cost"));
                config.initBudget = Long.parseLong(props.getProperty("init_budget"));
                config.initHp = Long.parseLong(props.getProperty("init_hp"));
                config.turnBudget = Long.parseLong(props.getProperty("turn_budget"));
                config.maxBudget = Long.parseLong(props.getProperty("max_budget"));
                config.TurnInterest = Long.parseLong(props.getProperty("interest_pct"));
                config.maxTurns = Long.parseLong(props.getProperty("max_turns"));
                config.maxSpawns = Long.parseLong(props.getProperty("max_spawns"));
            } catch (NumberFormatException e) {
                System.err.println("Error: Config Value Must Be Long ");
                throw e;
            } catch (NullPointerException e) {
                System.err.println("Error: Missing Config Value");
                throw e;
            }

            return config;
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


        public static void main(String[] args) {

            String configFilePath = "config.txt";

            try {
                GameConfig config = GameConfig.load(configFilePath);
                System.out.println("Complete Loading Config file:");
                System.out.println(config);
            } catch (IOException e) {
                System.err.println("Cannot read Config file: " + e.getMessage());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
