package com.example.WebAPI.GameEngine;

import Board.*;
import Config.GameConfig;
import Minion.minion;
import Minion.minion_kind;
import Parser.AST.Enum.Direction;
import Strategist.*;

import java.io.IOException;
import java.util.*;

public class Stage {
    private final long max_turn;
    private int current_turn = 1;
    private final GameConfig config;
    private final int max_player = 2;
    private final Map<String,Strategist> PlayerList = new HashMap<String,Strategist>();
    private final Mode mode;
    private final Map<String, minion_kind> minion_kinds = new HashMap<>();
    private final Board board;
    private final Scanner user_input = new Scanner(System.in);

    public Stage(String config_path,Mode mode, Board board) throws IOException {
        this.config = new GameConfig();
        config.load(config_path);
        this.max_turn = config.maxTurns;
        this.mode = mode;
        this.board = board;
    }

    public GameConfig getConfig() {
        return config;
    }

    public Map<String, minion_kind> getMinion_kinds() {
        return minion_kinds;
    }

    private void duel_mode() {
        do {
            System.out.println("Enter Player's name:");
            String name = user_input.nextLine();
            if (PlayerList.containsKey(name)) {
                System.out.println("Player already exists!");
                continue;
            }
            Strategist temp =  new Player(name,config.maxSpawns);
            if (PlayerList.size()%2 == 1) {
                temp.set_player_dir(true);
            }
            PlayerList.put(name,temp);
        }while (PlayerList.size() < max_player);
    }

    private void solitaire_mode() {
        do {
            Strategist temp;
            String name;
            if (!PlayerList.isEmpty()) {
                name = "Bot " + (PlayerList.size());
                temp = new NonePlayer(name,config.maxSpawns);
            }else {
                System.out.println("Enter Player's name:");
                name = user_input.nextLine();
                if (PlayerList.containsKey(name)) {
                    System.out.println("Player already exists!");
                    continue;
                }
                temp = new Player(name,config.maxSpawns);
            }
            if (PlayerList.size()%2 == 1) {
                temp.set_player_dir(true);
            }
            PlayerList.put(name,temp);
        }while (PlayerList.size() < max_player);
    }
    private void auto_mode() {
        do {
            String name = "Bot " + (PlayerList.size()+1);
            Strategist temp = new NonePlayer(name,config.maxSpawns);
            if (PlayerList.size()%2 == 1) {
                temp.set_player_dir(true);
            }
            PlayerList.put(name,temp);
        }while (PlayerList.size() < max_player);
    }

    public void create_player() {
        switch(this.mode) {
            case DUEL -> {
                duel_mode();
            }
            case SOLITAIRE -> {
                solitaire_mode();
            }
            case AUTO -> {
                auto_mode();
            }
            default -> {
                throw new IllegalArgumentException("Invalid mode");
            }
        }
        PlayerList.forEach((name, player) -> {
            Assign_Start_Gird(player);
        });
    }

    public void add_available_minion(minion_kind m) {
        minion_kinds.put(m.getName(), m);
    }

    public void remove_available_minion(minion_kind m) {
        minion_kinds.remove(m.getName());
    }

    private void Assign_Start_Gird(Strategist p) {
        Grid fst_grid;
        Grid snd_grid;
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


    private void turn_setUp(turn t, Strategist p) {
        if (t.getCurrent_turn() != 1) {
            t.turnSetup(p);
        }else {
            t.setup(p);
            p.setBudget(config.initBudget);
        }
    }

    private void player_action(turn t, Strategist p) throws Exception {
        System.out.println("Chose Action:\n 1.Buy Grid\n 2.Skip\n Action: ");
        int choice = user_input.nextInt();
        if (choice == 1) {
            choose_grid(p, t);
        }
        boolean pass = false;
        do {
            System.out.println("Chose Action:\n 1.Buy Minion\n 2.Skip\n Action: ");
            int choice2 = user_input.nextInt();
            if (choice2 == 1) {
                spawn_minion(p,t);
                pass = true;
            }else {
                if (current_turn == 1) {
                    System.out.println("Please spawn free minion.");
                }else pass = true;
            }
        }while (!pass);

    }

    private Strategist endgame_cal() {
        List<Strategist> list = new ArrayList<>(PlayerList.values());
        Strategist winner = null;
        List<Strategist> alive = new ArrayList<>();
        for (Strategist s : list) {
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

    private Strategist calc_by_point(List<Strategist> list) {
        long max_point = -1;
        Strategist winner = null;
        boolean draw = false;
        for (Strategist s: list) {
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

    public boolean run_turn() {
        turn t = new turn(current_turn, config, board);
        PlayerList.forEach((name, player) -> {
            System.out.println(player.getName() + "'s turn");
            turn_setUp(t,player);
            try {
                if (player instanceof NonePlayer) {
                    ((NonePlayer) player).auto_action(t, this);
                }else {
                    player_action(t, player);
                }
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

        PlayerList.forEach((name, player) -> {
            System.out.println("Player " + player.getName() + " minion action.");
                t.minion_action(player);
            try {
                Thread.sleep(750);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        });

        PlayerList.forEach((name, player) -> {
            t.clear_minion(player);
        });
        Strategist winner = endgame_cal();
        if (winner != null) {
            System.out.println("Winner is " + winner.getName());
            return true;
        }else if (current_turn >= max_turn) {
            System.out.println("Draw");
            return true;
        }
        current_turn++;
        return false;
    }

    public List<Grid> getBuyableGrids(Strategist p) {
        List<Grid> buyable_grid = new ArrayList<Grid>();
        for(Grid g : p.getGrids()) {
            Direction[] dirs = {
                    Direction.UP, Direction.DOWN,
                    Direction.UP_LEFT, Direction.UP_RIGHT,
                    Direction.DOWN_LEFT, Direction.DOWN_RIGHT
            };
            for (Direction dir : dirs) {
                Grid neighbour = g.getGrid(dir);
                if (neighbour != null && !neighbour.isSpawnable() && !buyable_grid.contains(neighbour)) buyable_grid.add(neighbour);
            }
        }
        return buyable_grid;
    }

    private void choose_grid(Strategist p, turn t) {
        List<Grid> buyable_grid = getBuyableGrids(p);
        boolean buyGrid = false;

        for (Grid g : buyable_grid) {
            System.out.print("[" + g.getRow() + "," + g.getCol() + "]:");
        }
        System.out.println();
        do {
            System.out.println("Choose Grid:");
            int row = user_input.nextInt();
            int col = user_input.nextInt();
            try {
                Grid target = board.getGrid(row, col);
                if (buyable_grid.contains(target)) {
                    t.buy_grid(target,p, config.HexCost);
                    buyGrid = true;
                }else {
                    System.out.println("This grid cannot be buy!");
                }
            } catch (Exception e) {
                System.out.println("Invalid Grid!");
            }
        }while(!buyGrid);
    }

    private void spawn_minion(Strategist p, turn t) throws Exception {
        List<Grid> available_grid = p.getGrids();
        int row,col;
        boolean isMyGrid, buyMinion = false;
        boolean kindFound;
        for (Grid g : available_grid) {
            System.out.print("[" + g.getRow() + "," + g.getCol() + "]:");
        }
        System.out.print("\n");
        do {
            System.out.println("Choose where you want to spawn(row col): ");
            row = user_input.nextInt();
            col = user_input.nextInt();
            int finalRow = row;
            int finalCol = col;
            isMyGrid = available_grid.stream().anyMatch(g -> g.getRow() == finalRow && g.getCol() == finalCol);
            if (!isMyGrid) System.out.println("This is not your grid!");
        } while (!isMyGrid);
        do {
            minion_kinds.forEach((key, val) -> {
                System.out.println("[ " + key + " ]");
            });
            System.out.println("Choose minion kind (type 'exit' to exit): ");
            String kind =  user_input.next();
            if (kind.equalsIgnoreCase("exit")) {
                if (current_turn == 1) {
                    System.out.println("Please spawn free minion.");
                    continue;
                }
                else return;
            }
            if (minion_kinds.containsKey(kind)) {
                minion_kind k = minion_kinds.get(kind);
                minion m = p.get_player_dir() ?
                        t.buy_minion_inverse(p, k, row, col):
                        t.buy_minion(p, k, row, col);
                if (m != null) {
                    break;
                }else System.out.println("Not Enough Money!");
            } else System.out.println("Invalid minion kind! Maybe you miss spell kind name.");
        }while(true);
    }

    // ฟังก์ชันสำหรับสรุป Status ทั้งหมดของเกม
    public void print_game_status() {
        System.out.println("\n========== [ GAME STATUS: TURN " + (current_turn - 1) + " END ] ==========");

        PlayerList.forEach((name, player) -> {
            print_player_status(player.getName(),player);
        });

        System.out.println("==================================================");
    }

    private void print_player_status(String playerName, Strategist p) {
        System.out.println("--- " + playerName + " ---");
        System.out.println("Budget: " + p.getBudget());
        System.out.println("Spawns Left: " + (config.maxSpawns - p.getMinion_Create()));

        List<minion> minions = p.getMinions();
        if (minions.isEmpty()) {
            System.out.println("Minions: None (All dead or not spawned)");
        } else {
            System.out.println("Minions Alive: " + minions.size());
            for (int i = 0; i < minions.size(); i++) {
                minion m = minions.get(i);
                String kindName = m.getKind().getName();
                long hp = m.getHp();
                int row = m.getRow();
                int col = m.getCol();
                // (ถ้าคุณมี getter สำหรับดูว่าโดน inverse ไหม ก็ใส่เพิ่มได้ครับ เช่น m.isInverse())
                System.out.println("  [" + (i+1) + "] " + kindName + " | HP: " + hp + " | Pos: [" + row + ", " + col + "]");
            }
        }

        // (Optional) ดูว่าผู้เล่นครอบครอง Grid ไหนอยู่บ้าง
        System.out.print("Owned Grids: ");
        for (Grid g : p.getGrids()) {
            System.out.print("[" + g.getRow() + "," + g.getCol() + "] ");
        }
        System.out.println("\n");
    }
}
