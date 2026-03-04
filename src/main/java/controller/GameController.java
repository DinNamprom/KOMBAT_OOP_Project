package controller;


import Board.Grid;
import GameEngine.Stage;
import Minion.minion_kind;
import dto.CreateMinion;

import dto.CreateModeConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import repository.GameService;

import java.awt.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/game")
@RequiredArgsConstructor
public class GameController {
    private final GameService gameService;
    //GAMESETUP
    //สร้างกระดานและเตรียม GameConfig โดยเลือกโหมด (DUEL, SOLITAIRE, AUTO) //return gameID
    @PostMapping("/create")
    public String CreateModeConfig(@RequestBody CreateModeConfig modeConfig) {
        try {

        UUID gameId = gameService.createNewGame(modeConfig.getMode(),modeConfig.getConfig());
        return gameId.toString();
    } catch (Exception e) {
        return "Error creating game: " + e.getMessage();
        }
    }
    //เพิ่มผู้เล่นเข้าเกม
    @PostMapping("/{gameID}/player")
    public boolean JoinGame(@PathVariable UUID gameID, @RequestParam String playerName) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return false;

        return stage.addPlayer(playerName);
    }

    //กำหนดชนิดและกลยุทธ์ของ Minion ก่อนเริ่มเกม
    @PostMapping("/{gameID}/minion-kind")
    public boolean CreateMinionKind(@PathVariable UUID gameID, @RequestBody CreateMinion minion) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return false;

        try {
            // สมมติว่า DTO มีฟิลด์เหล่านี้ หากตั้งชื่อใน DTO ต่างออกไป ให้แก้ getter ตามความจริง
            minion_kind newKind = new minion_kind(
                    minion.getName(),
                    minion.getSpawncost(),
                    minion.getDef(),
                    minion.getStrategy()
            );
            stage.add_available_minion(newKind);
            return true;
        } catch (Exception e) {
            return false;
        }}

    //ยืนยันการเริ่มเกม
    @PostMapping("/{gameID}/start")
    public boolean StartGame(@PathVariable UUID gameID) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return false;

        // เรียกคำสั่งเตรียมเริ่มเกม (อาจจะต้องไปสร้าง method start() ใน Stage.java เพิ่ม)

        return stage.start_game_setup();}

    //GAMESTATE
    //ดึงข้อมูลทั้งหมดเพื่อแสดงผล
    @GetMapping("/{gameID}/stat")
    public Stage GetGameStat(@PathVariable UUID gameID) {return gameService.getGame(gameID);}

    //ดึงรายการพิกัด Grid ที่ผู้เล่นคนนั้นสามารถซื้อได้ (อยู่ติดกับพื้นที่เดิม)
    @GetMapping("/{gameID}/{playerName}/buyable-grids")
    public List<Grid> Getbuyablegrids(@PathVariable UUID gameID, @PathVariable String playerName) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return null;
        return stage.getBuyableGrids(playerName);
    }

}
