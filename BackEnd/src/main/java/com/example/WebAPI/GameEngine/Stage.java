package com.example.WebAPI.GameEngine;

import com.example.WebAPI.Config.GameConfig;
import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Minion.minion_kind;
import com.example.WebAPI.Parser.AST.Enum.Direction;
import com.example.WebAPI.Strategist.*;
import com.example.WebAPI.Board.Grid;
import com.example.WebAPI.Board.Board;
import com.example.WebAPI.dto.Status.GameStatus;
import com.example.WebAPI.dto.Status.GridStatus;
import com.example.WebAPI.dto.Status.MinionStatus;
import lombok.Getter;

import java.io.IOException;
import java.sql.SQLOutput;
import java.util.*;

public class Stage {
    private final long max_turn;
    private int current_turn = 1;
    @Getter

    private final GameConfig config;
    private final int max_player = 2;
    @Getter
    private final Map<UUID, strategist> PlayerList = new LinkedHashMap<>();
    private final Mode mode;
    @Getter

    private final Map<String, minion_kind> minion_kinds = new HashMap<>();
    private final Board board;


    public Stage(String configData,Mode mode, Board board) throws IOException {
        this.config = new GameConfig();
        config.loadFromString(configData);
        this.max_turn = config.maxTurns;
        this.mode = mode;
        this.board = board;
    }

    public int getCurrentTurn() { return current_turn; }

    public boolean addPlayer(UUID playerID) {

        if (PlayerList.containsKey(playerID) || PlayerList.size() >= max_player) {
            return false; // ชื่อซ้ำ หรือห้องเต็ม
        }
        strategist newPlayer;
        if (this.mode == Mode.AUTO || (this.mode == Mode.SOLITAIRE && PlayerList.size() == 1)) {
            newPlayer = new NonePlayer("Bot " + (PlayerList.size() + 1),playerID, config.maxSpawns);
        } else {
            newPlayer = new Player("Player" + (PlayerList.size() + 1),playerID, config.maxSpawns);
        }

        // กำหนดฝั่ง (บนซ้าย หรือ ล่างขวา)
        if (PlayerList.size() % 2 == 1) {
            newPlayer.set_player_dir(true);
        }

        PlayerList.put(newPlayer.getUUID(), newPlayer);

        if (PlayerList.size() == max_player) {
            PlayerList.values().forEach(this::Assign_Start_Gird);
        }
        return true;
    }

    public void add_available_minion(minion_kind m) {
        minion_kinds.put(m.getName(), m);
    }

    public void remove_available_minion(minion_kind m) {
        minion_kinds.remove(m.getName());
    }

    private void Assign_Start_Gird(strategist p) {
        Grid fst_grid, snd_grid;
        if (p.get_player_dir()) {
            fst_grid = board.getGrid(1, 1);
            snd_grid = fst_grid.getGrid(Direction.DOWN);
            p.addGrid(fst_grid);
            p.addGrid(snd_grid);
            p.addGrid(snd_grid.getGrid(Direction.UP_RIGHT));
            p.addGrid(snd_grid.getGrid(Direction.UP_RIGHT).getGrid(Direction.UP_RIGHT));
            p.addGrid(fst_grid.getGrid(Direction.UP_RIGHT));
        }else {
            fst_grid = board.getGrid(board.max_row(), board.max_col());
            snd_grid = fst_grid.getGrid(Direction.UP);
            p.addGrid(fst_grid);
            p.addGrid(snd_grid);
            p.addGrid(snd_grid.getGrid(Direction.DOWN_LEFT));
            p.addGrid(snd_grid.getGrid(Direction.DOWN_LEFT).getGrid(Direction.DOWN_LEFT));
            p.addGrid(fst_grid.getGrid(Direction.DOWN_LEFT));
        }
    }


    public void setupTurn() {
        turn t = new turn(current_turn, config, board);
        PlayerList.forEach((name, player) -> {
            if (current_turn == 1) {
                t.setup(player);
                player.setBudget(config.initBudget);
            } else {
                t.turnSetup(player);
            }
        });
    }



    private strategist endgame_cal() {
        List<strategist> list = new ArrayList<>(PlayerList.values());
        strategist winner = null;
        List<strategist> alive = new ArrayList<>();
        for (strategist s : list) {
            if (!s.getMinions().isEmpty()) alive.add(s);
        }

        if (alive.size() == 1) {
            return alive.getFirst();
        }

        if (current_turn >= config.maxTurns || alive.isEmpty()) {
            winner = calc_by_point(list);
        }
        return winner;
    }

    private strategist calc_by_point(List<strategist> list) {
        long max_point = -1;
        strategist winner = null;
        boolean draw = false;
        for (strategist s: list) {
            long total_hp = 0;
            for (minion m: s.getMinions()) {
                total_hp += m.getHp();
            }
            if (total_hp > max_point) {
                max_point = total_hp;
                winner = s;
                draw = false;
            }else if (total_hp == max_point) {
                if (winner != null) {
                    if (winner.getBudget() < s.getBudget()) {
                        winner = s;
                        draw = false;
                    }
                    else if (winner.getBudget() == s.getBudget()) draw = true;
                }
            }
        }
        if (draw) {
            return null;
        }
        return winner;
    }

    public List<Grid> getBuyableGrids(UUID playerName) {
        strategist p = PlayerList.get(playerName);
        if (p == null) return new ArrayList<>();

        List<Grid> buyable_grid = new ArrayList<>();
        for (Grid g : p.getGrids()) {
            Direction[] dirs = {
                    Direction.UP, Direction.DOWN,
                    Direction.UP_LEFT, Direction.UP_RIGHT,
                    Direction.DOWN_LEFT, Direction.DOWN_RIGHT
            };
            for (Direction dir : dirs) {
                Grid neighbour = g.getGrid(dir);
                if (neighbour != null && !neighbour.isSpawnable() && !buyable_grid.contains(neighbour)) {
                    buyable_grid.add(neighbour);
                }
            }
        }
        return buyable_grid;
    }

    public List<Grid> getSpawnableGrids(UUID playerName) {
        strategist p = PlayerList.get(playerName);
        if (p == null) return new ArrayList<>();

        List<Grid> spawnable_grid = new ArrayList<>();
        spawnable_grid = p.getGrids();
        return spawnable_grid;
    }


    public boolean buyGridAPI(UUID playerName, int row, int col) {
        strategist p = PlayerList.get(playerName);
        if (p == null) return false;
        System.out.println(p.getName());
        Grid target;
        try {
            target = board.getGrid(row, col);
        } catch (Exception e) {
            return false;
        }

        List<Grid> buyable_grid = getBuyableGrids(playerName);
        if (buyable_grid.contains(target)) {
            turn t = new turn(current_turn, config, board);
            t.buy_grid(target, p, config.HexCost);
            return true;
        }
        return false;
    }


    public boolean spawnMinionAPI(UUID playerName, String kindName, int row, int col) {
        strategist p = PlayerList.get(playerName);
        if (p == null) return false;

        boolean isMyGrid = p.getGrids().stream().anyMatch(g -> g.getRow() == row && g.getCol() == col);
        if (!isMyGrid) return false;

        if (!minion_kinds.containsKey(kindName)) return false;

        minion_kind k = minion_kinds.get(kindName);
        turn t = new turn(current_turn, config , board);

        try {
            minion m = p.get_player_dir() ?
                    t.buy_minion_inverse(p, k, row, col) :
                    t.buy_minion(p, k, row, col);
            return m != null;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean executeTurnEnding(UUID playerId) {
        turn t = new turn(current_turn, config, board);
        strategist player = PlayerList.get(playerId);
        // ให้ Bot เล่นอัตโนมัติ (ถ้ามี)

            if (player instanceof NonePlayer) {
                try {
                    ((NonePlayer) player).auto_action(t, this);
                } catch (Exception e) {
                    System.out.println("Bot Error: " + e.getMessage());
                }
            }
        // Minion รันโค้ด Strategy ของตัวเองทีละตัว
            t.minion_action(player);

        // เคลียร์ Minion ที่เลือดหมด (ตาย)
            t.clear_minion(player);

        // เช็คผู้ชนะ
        strategist winner = endgame_cal();
        if (winner != null) {
            System.out.println("Winner is " + winner.getName());
            return true; // เกมจบ
        } else if (current_turn >= max_turn) {
            System.out.println("Draw");
            return true; // เสมอ
        }

        current_turn++;
        setupTurn(); // เริ่มคำนวณเงินสำหรับเทิร์นถัดไป
        return false; // เกมยังไม่จบ
    }

    public boolean start_game_setup() {
        // 1. ตรวจสอบว่ามีผู้เล่นอย่างน้อย 1 คน หรือครบตามโหมดหรือไม่
        if (PlayerList.isEmpty()) {
            return false; // ไม่มีผู้เล่นเลย เริ่มเกมไม่ได้
        }

        // 2. ถ้าโหมด AUTO หรือ SOLITAIRE ผู้เล่นยังไม่ครบ ให้เติม Bot อัตโนมัติ
        if (PlayerList.size() == max_player) {
            this.current_turn = 1;
            setupTurn();
            return true;
            } else {
                return false; // คนไม่ครบ 2 คน เริ่มเกมไม่ได้
            }
        }

    public GameStatus getGameStatus() {
        List<GridStatus> grid_list = new ArrayList<>();
        for (int i=1;i<board.max_row();i++) {
            for (int j=1;j<board.max_col();j++) {
                Grid cur = board.getGrid(i,j);
                strategist owner = cur.getSpawnOwner();
                GridStatus grid_status = new GridStatus(cur.getRow(),cur.getCol(),owner != null? owner.getUUID():null);
                grid_list.add(grid_status);
            }
        }
        return new GameStatus(grid_list);
    }
}

//    // ฟังก์ชันสำหรับสรุป Status ทั้งหมดของเกม
//    public void print_game_status() {
//        System.out.println("\n========== [ GAME STATUS: TURN " + (current_turn - 1) + " END ] ==========");
//
//        PlayerList.forEach((name, player) -> {
//            print_player_status(player.getName(),player);
//        });
//
//        System.out.println("==================================================");
//    }
//
//    private void print_player_status(String playerName, strategist p) {
//        System.out.println("--- " + playerName + " ---");
//        System.out.println("Budget: " + p.getBudget());
//        System.out.println("Spawns Left: " + (config.maxSpawns - p.getMinion_Create()));
//
//        List<minion> minions = p.getMinions();
//        if (minions.isEmpty()) {
//            System.out.println("Minions: None (All dead or not spawned)");
//        } else {
//            System.out.println("Minions Alive: " + minions.size());
//            for (int i = 0; i < minions.size(); i++) {
//                minion m = minions.get(i);
//                String kindName = m.getKind().getName();
//                long hp = m.getHp();
//                int row = m.getRow();
//                int col = m.getCol();
//                // (ถ้าคุณมี getter สำหรับดูว่าโดน inverse ไหม ก็ใส่เพิ่มได้ครับ เช่น m.isInverse())
//                System.out.println("  [" + (i+1) + "] " + kindName + " | HP: " + hp + " | Pos: [" + row + ", " + col + "]");
//            }
//        }
//
//        // (Optional) ดูว่าผู้เล่นครอบครอง Grid ไหนอยู่บ้าง
//        System.out.print("Owned Grids: ");
//        for (Grid g : p.getGrids()) {
//            System.out.print("[" + g.getRow() + "," + g.getCol() + "] ");
//        }
//        System.out.println("\n");




