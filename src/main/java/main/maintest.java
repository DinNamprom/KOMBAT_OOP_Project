//package main;
//
//import Board.Board;
//import Minion.minion;
//import Minion.minion_kind;
//import GameEngine.*;
//        import Parser.AST.Statement.statement;
//import Parser.parser;
//import Parser.tokenizer;
//import Strategist.Player;
//
//import java.io.IOException;
//
//public class maintest {
//    public static void main(String[] args) {
//        try {
//            System.out.println("========== [ INITIALIZING GAME ] ==========");
//
//            // 1. สร้างกระดาน (สมมติขนาด 8x8)
//            Stage stage = getStage();
//
//            System.out.println("========== [ GAME START ] ==========\n");
//
//            // 5. ลูปหลักของเกม (Main Game Loop)
//            boolean isGameOver = false;
//
//            while (!isGameOver) {
//                // รันเทิร์น: ถ้าเกมจบ (มีผู้ชนะ หรือ เสมอ) มันจะ return true
//                isGameOver = stage.run_turn();
//
//                // ปรินต์สรุป Status ของผู้เล่นและกระดานหลังจบแต่ละเทิร์น
//                stage.print_game_status();
//
//                // ถ้าอยากให้เกมหน่วงเวลาอ่าน Status นิดนึงก่อนขึ้นเทิร์นใหม่ (Optional)
//                // Thread.sleep(1500);
//            }
//
//            System.out.println("\n========== [ GAME OVER ] ==========");
//        } catch (Exception e) {
//            System.out.println("❌ Error: " + e.getMessage());
//            e.printStackTrace();
//        }
//    }
//
//    private static Stage getStage() throws Exception {
//        Board board = new Board();
//
//        // 2. สร้าง Stage (อย่าลืมตรวจสอบว่ามีไฟล์ config.txt)
//        Stage stage = new Stage("src/main/java/config.txt", Mode.AUTO, board);
//
//        // 3. สร้างผู้เล่น P1 และ P2
//        stage.create_player();
//
//        // 4. สร้างและเพิ่มชนิดของ Minion เข้าร้านค้า
//        // (ใช้ Record ตามที่คุณกำหนดไว้)
//        minion_kind soldier = new minion_kind("Soldier", 100L, 10L, "t = t + 1  # keeping track of the turn number\n" +
//                "m = 0  # number of random moves this turn\n" +
//                "while (3 - m) {  # made less than 3 random moves\n" +
//                "  if (Budget - 100) then {} else done  # too poor to do anything else\n" +
//                "  opponentLoc = opponent\n" +
//                "  if (opponentLoc / 10 - 1)\n" +
//                "  then  # opponent afar\n" +
//                "    if (opponentLoc % 10 - 5) then move downleft\n" +
//                "    else if (opponentLoc % 10 - 4) then move up\n" +
//                "    else if (opponentLoc % 10 - 3) then move upright\n" +
//                "    else if (opponentLoc % 10 - 2) then move upright\n" +
//                "    else if (opponentLoc % 10 - 1) then move upright\n" +
//                "    else move up\n" +
//                "  else if (opponentLoc)\n" +
//                "  then  # opponent adjacent to this minion\n" +
//                "    if (opponentLoc % 10 - 5) then {\n" +
//                "      cost = 10 ^ (nearby upleft % 100 + 1)\n" +
//                "      if (Budget - cost) then shoot upleft cost else {}\n" +
//                "    }\n" +
//                "    else if (opponentLoc % 10 - 4) then {\n" +
//                "      cost = 10 ^ (nearby downleft % 100 + 1)\n" +
//                "      if (Budget - cost) then shoot downleft cost else {}\n" +
//                "    }\n" +
//                "    else if (opponentLoc % 10 - 3) then {\n" +
//                "      cost = 10 ^ (nearby down % 100 + 1)\n" +
//                "      if (Budget - cost) then shoot down cost else {}\n" +
//                "    }\n" +
//                "    else if (opponentLoc % 10 - 2) then {\n" +
//                "      cost = 10 ^ (nearby downright % 100 + 1)\n" +
//                "      if (Budget - cost) then shoot downright cost else {}\n" +
//                "    }\n" +
//                "    else if (opponentLoc % 10 - 1) then {\n" +
//                "      cost = 10 ^ (nearby upright % 100 + 1)\n" +
//                "      if (Budget - cost) then shoot upright cost else {}\n" +
//                "    }\n" +
//                "    else {\n" +
//                "      cost = 10 ^ (nearby up % 100 + 1)\n" +
//                "      if (Budget - cost) then shoot up cost else {}\n" +
//                "    }\n" +
//                "  else {  # no visible opponent; move in a random direction\n" +
//                "    try = 0  # keep track of number of attempts\n" +
//                "    while (3 - try) {  # no more than 3 attempts\n" +
//                "      success = 1\n" +
//                "      dir = random % 6\n" +
//                "      # (nearby <dir> % 10 + 1) ^ 2 is positive if adjacent cell in <dir> has no ally\n" +
//                "      if ((dir - 4) * (nearby upleft % 10 + 1) ^ 2) then move upleft\n" +
//                "      else if ((dir - 3) * (nearby downleft % 10 + 1) ^ 2) then move downleft\n" +
//                "      else if ((dir - 2) * (nearby down % 10 + 1) ^ 2) then move down\n" +
//                "      else if ((dir - 1) * (nearby downright % 10 + 1) ^ 2) then move downright\n" +
//                "      else if (dir * (nearby upright % 10 + 1) ^ 2) then move upright\n" +
//                "      else if ((nearby up % 10 + 1) ^ 2) then move up\n" +
//                "      else success = 0\n" +
//                "      if (success) then try = 3 else try = try + 1\n" +
//                "    }\n" +
//                "    m = m + 1\n" +
//                "  }\n" +
//                "}  # end while\n");
////        minion m = new minion(soldier);
////        m.action();
////        try {
////            Thread.sleep(500);
////        } catch (InterruptedException e) {
////            throw new RuntimeException(e);
////        }
//        minion_kind test = new minion_kind("Test", 50L, 1L, "if (nearby up) then {done} else  {move upleft}");
//        minion_kind sniper = new minion_kind("Sniper", 150L, 5L, "if (nearby up) then {shoot up 100} else {move upleft}");
//
////        stage.add_available_minion(test);
////        stage.add_available_minion(soldier);
//        stage.add_available_minion(sniper);
//        return stage;
//    }
//}