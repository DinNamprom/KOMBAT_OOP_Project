package GameEngine;

import Board.*;
import Config.GameConfig;
import Minion.minion;
import Minion.minion_kind;
import Parser.AST.Enum.Direction;
import Strategist.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Stage {
    private final long max_turn;
    private int current_turn = 1;
    private final GameConfig config;
    private Strategist P1;
    private Strategist P2;
    private final Mode mode;
    private final List<minion_kind> minion_kinds = new ArrayList<>();
    private final Board board;
    private final Scanner user_input = new Scanner(System.in);

    public Stage(String config_path,Mode mode, Board board) throws IOException {
        this.config = new GameConfig();
        config.load(config_path);
        this.max_turn = config.maxTurns;
        this.mode = mode;
        this.board = board;
    }

    public void create_player(String p1_name, String p2_name) {
        switch(mode) {
            case DUEL -> {
                P1 = new Player(p1_name, config.maxSpawns);
                P2 = new Player(p2_name, config.maxSpawns);
                P2.set_player_dir(true);
            }
            case SOLITAIRE -> {
                P1 = new Player(p1_name, config.maxSpawns);
                P2 = new NonePlayer(p2_name, config.maxSpawns);
                P2.set_player_dir(true);
            }
            case AUTO -> {
                P1 = new NonePlayer(p1_name, config.maxSpawns);
                P2 = new NonePlayer(p2_name, config.maxSpawns);
                P2.set_player_dir(true);
            }
            default -> throw new IllegalArgumentException("Invalid mode");
        }
        Add_Player_Start_Board();
    }

    public void add_available_minion(minion_kind m) {
        minion_kinds.add(m);
    }

    public void remove_available_minion(minion_kind m) {
        minion_kinds.remove(m);
    }

    private void Add_Player_Start_Board() {
        Grid fst_grid = board.getGrid(board.max_row(), board.max_col());
        Grid snd_grid = fst_grid.getGrid(Direction.UP);
        P1.addGrid(fst_grid);
        P1.addGrid(snd_grid);
        P1.addGrid(snd_grid.getGrid(Direction.DOWN_LEFT));
        P1.addGrid(snd_grid.getGrid(Direction.DOWN_LEFT).getGrid(Direction.DOWN_LEFT));
        P1.addGrid(fst_grid.getGrid(Direction.DOWN_LEFT));

        fst_grid = board.getGrid(1, 1);
        snd_grid = fst_grid.getGrid(Direction.DOWN);
        P2.addGrid(fst_grid);
        P2.addGrid(snd_grid);
        P2.addGrid(snd_grid.getGrid(Direction.UP_RIGHT));
        P2.addGrid(snd_grid.getGrid(Direction.UP_RIGHT).getGrid(Direction.UP_RIGHT));
        P2.addGrid(fst_grid.getGrid(Direction.UP_RIGHT));
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
        IO.println("Chose Action:\n 1.Buy Grid\n 2.Skip\n Action: ");
        int choice = user_input.nextInt();
        if (choice == 1) {
            choose_grid(p);
        }
        boolean pass = false;
        do {
            IO.println("Chose Action:\n 1.Buy Minion\n 2.Skip\n Action: ");
            int choice2 = user_input.nextInt();
            if (choice2 == 1) {
                spawn_minion(p,t);
                pass = true;
            }else {
                if (current_turn == 1) {
                    IO.println("Please spawn free minion.");
                }else pass = true;
            }
        }while (!pass);

    }

    private Strategist endgame_cal() {
        if (current_turn >= max_turn) {
            long p1_minion_hp = 0;
            long p2_minion_hp = 0;
            for (minion m : P1.getMinions()) p1_minion_hp += m.getHp();
            for (minion m : P2.getMinions()) p2_minion_hp += m.getHp();
            if (p1_minion_hp == p2_minion_hp) {
                if (P1.getBudget() == P2.getBudget()) return null;
                if (P1.getBudget() > P2.getBudget()) return P1;
                else return P2;
            }
            if (p1_minion_hp > p2_minion_hp) return P1;
            else return P2;
        }
        boolean p1_lose = P1.getMinions().isEmpty() && P1.isMaxMinion();
        boolean p2_lose = P2.getMinions().isEmpty() && P2.isMaxMinion();
        if (p1_lose && p2_lose)  return null;
        if (p1_lose) return P2;
        if (p2_lose) return P1;

        return null;
    }

    public boolean run_turn() throws Exception {
        turn t = new turn(current_turn, config, board);
        turn_setUp(t, P1);
        turn_setUp(t, P2);

        player_action(t,P1);
        player_action(t,P2);

        t.minion_action(P1);
        t.minion_action(P2);

        t.clear_minion(P1);
        t.clear_minion(P2);

        Strategist winner = endgame_cal();
        if (winner != null) {
            IO.println("Winner is " + winner.getName());
            return true;
        }else if (current_turn >= max_turn) {
            IO.println("Draw");
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

    public void choose_grid(Strategist p) {
        List<Grid> buyable_grid = getBuyableGrids(p);
        boolean buyGrid = false;

        for (Grid g : buyable_grid) {
            IO.print("[" + g.getRow() + "," + g.getCol() + "]:");
        }
        IO.println();
        do {
            IO.println("Choose Grid:");
            int row = user_input.nextInt();
            int col = user_input.nextInt();
            try {
                Grid target = board.getGrid(row, col);
                if (buyable_grid.contains(target)) {
                    p.addGrid(target);
                    buyGrid = true;
                }else {
                    IO.println("This grid cannot be buy!");
                }
            } catch (Exception e) {
                IO.println("Invalid Grid!");
            }
        }while(!buyGrid);
    }

    public void spawn_minion(Strategist p, turn t) throws Exception {
        List<Grid> available_grid = p.getGrids();
        int row,col;
        boolean isMyGrid, buyMinion = false;
        boolean kindFound;
        for (Grid g : available_grid) {
            IO.print("[" + g.getRow() + "," + g.getCol() + "]:");
        }
        IO.print("\n");
        do {
            IO.println("Choose where you want to spawn(row col): ");
            row = user_input.nextInt();
            col = user_input.nextInt();
            int finalRow = row;
            int finalCol = col;
            isMyGrid = available_grid.stream().anyMatch(g -> g.getRow() == finalRow && g.getCol() == finalCol);
            if (!isMyGrid) IO.println("This is not your grid!");
        } while (!isMyGrid);
        for (minion_kind k : minion_kinds) {
            IO.println(k.getName() + " price: " + k.getSpawnCost());
        }
        do {
            IO.println("Choose minion kind (type 'exit' to exit): ");
            String kind =  user_input.next();
            kindFound = false;
            if (kind.equalsIgnoreCase("exit")) {
                if (current_turn == 1) {
                    IO.println("Please spawn free minion.");
                    continue;
                }
                else return;
            }
            for (minion_kind k : minion_kinds) {
                if (k.getName().equals(kind)) {
                    minion m = p.get_player_dir() ?
                            t.buy_minion_inverse(p, k, row, col):
                            t.buy_minion(p, k, row, col);
                    if (m != null) {
                        buyMinion = true;
                    }else IO.println("Not Enough Money!");
                    kindFound = true;
                    break;
                }
            }
            if (!kindFound) IO.println("Invalid minion kind! Maybe you miss spell kind name.");
        }while(!buyMinion);
    }

    // ฟังก์ชันสำหรับสรุป Status ทั้งหมดของเกม
    public void print_game_status() {
        IO.println("\n========== [ GAME STATUS: TURN " + (current_turn - 1) + " END ] ==========");

        // ปรินต์ Status ของ P1
        print_player_status("Player 1", P1);

        // ปรินต์ Status ของ P2
        print_player_status("Player 2", P2);

        IO.println("==================================================");
    }

    private void print_player_status(String playerName, Strategist p) {
        IO.println("--- " + playerName + " ---");
        IO.println("Budget: " + p.getBudget());
        IO.println("Spawns Left: " + (config.maxSpawns - p.getMinion_Create()));

        List<minion> minions = p.getMinions();
        if (minions.isEmpty()) {
            IO.println("Minions: None (All dead or not spawned)");
        } else {
            IO.println("Minions Alive: " + minions.size());
            for (int i = 0; i < minions.size(); i++) {
                minion m = minions.get(i);
                String kindName = m.getKind().getName();
                long hp = m.getHp();
                int row = m.getRow();
                int col = m.getCol();
                // (ถ้าคุณมี getter สำหรับดูว่าโดน inverse ไหม ก็ใส่เพิ่มได้ครับ เช่น m.isInverse())
                IO.println("  [" + (i+1) + "] " + kindName + " | HP: " + hp + " | Pos: [" + row + ", " + col + "]");
            }
        }

        // (Optional) ดูว่าผู้เล่นครอบครอง Grid ไหนอยู่บ้าง
        IO.print("Owned Grids: ");
        for (Grid g : p.getGrids()) {
            IO.print("[" + g.getRow() + "," + g.getCol() + "] ");
        }
        IO.println("\n");
    }
}
