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
    private turn t;
    private final GameConfig config;
    private Strategist P1;
    private Strategist P2;
    private final Mode mode;
    private final List<minion_kind> minion_kinds = new ArrayList<>();
    private final Board board;

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
            }
            case SOLITAIRE -> {
                P1 = new Player(p1_name, config.maxSpawns);
                P2 = new NonePlayer(p2_name, config.maxSpawns);
            }
            case AUTO -> {
                P1 = new NonePlayer(p1_name, config.maxSpawns);
                P2 = new NonePlayer(p2_name, config.maxSpawns);
            }
            default -> {
                throw new IllegalArgumentException("Invalid mode");
            }
        }
    }

    public void add_available_minion(minion_kind m) {
        minion_kinds.add(m);
    }

    public void remove_available_minion(minion_kind m) {
        minion_kinds.remove(m);
    }

    public void first_turn() throws Exception {
        t = new turn(current_turn, config, board);

        t.setup(P1);
        t.setup(P2);

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

        spawn_minion(P1, t);
        spawn_minion(P2, t);
        for(minion m: P2.getMinions()) {
            m.setInverse(true);
        }

        t.minion_action(P1);
        t.minion_action(P2);

        t.clear_minion(P1);
        t.clear_minion(P2);
        current_turn++;
    }

    public void spawn_minion(Strategist p, turn t) throws Exception {
        List<Grid> available_grid = p.getGrids();
        int row,col;
        boolean isMyGrid = false;
        boolean kindFound = false;
        for (Grid g : available_grid) {
            IO.print("[" + g.getRow() + "," + g.getCol() + "]:");
        }
        IO.print("\n");
        Scanner user_input = new Scanner(System.in);
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
            IO.println("Choose minion kind: ");
            String kind =  user_input.next();
            for (minion_kind k : minion_kinds) {
                if (k.getName().equals(kind)) {
                    if (!t.buy_minion(p,k,row,col)) IO.println("Not enough money!");
                    kindFound = true;
                    break;
                }
            }
            if (!kindFound) IO.println("Invalid minion kind! Maybe you miss spell kind name.");
        }while(!kindFound);
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
