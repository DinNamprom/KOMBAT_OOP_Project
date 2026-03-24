package controller;


import GameEngine.Stage;
import dto.BuyGrid;


import dto.SpawnMinion;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import repository.GameService;

import java.util.UUID;

@RestController
@RequestMapping("/action")
@RequiredArgsConstructor
public class ActionController {
    private final GameService gameService;
    //ส่งคำสั่งขอซื้อพื้นที่ Hex ใหม่ในเทิร์นนั้น
    @PostMapping("/buy-grid")
    public Boolean BuyGrid(@RequestBody BuyGrid buyGrid) {
        Stage stage = gameService.getGame(buyGrid.getGameID());
        if (stage == null) return false;
        return stage.buyGridAPI(buyGrid.getPlayerName(), buyGrid.getRow(), buyGrid.getCol());
    }

    //ส่งคำสั่งขอสร้าง Minion ชนิดที่เลือก ลงบนพื้นที่ที่กำหนด
    @PostMapping("/spawn-minion")
    public Boolean SpawnMinion(@RequestBody SpawnMinion spawnMinion) {
        Stage stage = gameService.getGame(spawnMinion.getGameID());
        if (stage == null) return false;


        return stage.spawnMinionAPI(
                spawnMinion.getPlayerName(),
                spawnMinion.getKind(),
                spawnMinion.getRow(),
                spawnMinion.getCol());
    }

    //จบช่วงเวลาการซื้อของผู้เล่น เพื่อสั่งให้ Backend รัน
    @PostMapping("/endTurn/{gameID}/{playerName}")
    public Boolean EndTurnPhase(@PathVariable UUID gameID, @PathVariable String playerName) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return false;

        boolean isGameOver = stage.executeTurnEnding();

        return isGameOver;
    }



}