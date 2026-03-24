package com.example.WebAPI.Config;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.StringReader;
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
    public void loadFromString(String configData) throws IOException {
        Properties props = new Properties();
        if (configData == null || configData.trim().isEmpty()) {
            configData = ""; // ป้องกัน StringReader พัง
        }

        try (StringReader reader = new StringReader(configData)) {
            props.load(reader);
        }

        try {
            this.initSpawnCost = getLong(props, "spawn_cost", 100);
            this.HexCost = getLong(props, "hex_purchase_cost", 1000);
            this.initBudget = getLong(props, "init_budget", 10000);
            this.initHp = getLong(props, "init_hp", 100);
            this.turnBudget = getLong(props, "turn_budget", 100);
            this.maxBudget = getLong(props, "max_budget", 50000);
            this.TurnInterest = getLong(props, "interest_pct", 5);
            this.maxTurns = getLong(props, "max_turns", 50);
            this.maxSpawns = getLong(props, "max_spawns", 20);
        } catch (Exception e) {
            System.err.println("Error parsing config values: " + e.getMessage());
            throw e;
        }
    }

    private long getLong(Properties props, String key, long defaultValue) {
        String val = props.getProperty(key);
        if (val == null || val.trim().isEmpty()) return defaultValue;
        try {
            return Long.parseLong(val.trim());
        } catch (NumberFormatException e) {
            return defaultValue;
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



