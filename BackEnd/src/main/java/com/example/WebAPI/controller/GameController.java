package com.example.WebAPI.controller;


import com.example.WebAPI.Board.Grid;
import com.example.WebAPI.GameEngine.Stage;
import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Minion.minion_kind;
import com.example.WebAPI.Parser.AST.Statement.statement;
import com.example.WebAPI.Parser.parser;
import com.example.WebAPI.Strategist.strategist;
import com.example.WebAPI.dto.*;

import com.example.WebAPI.dto.Status.GameStatus;
import com.example.WebAPI.dto.Status.MinionStatus;
import com.example.WebAPI.dto.Status.PlayerStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.example.WebAPI.repository.GameService;

import java.awt.*;
import java.util.*;
import java.util.List;

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
    @PostMapping("/join/{gameID}")
    public boolean JoinGame(@PathVariable UUID gameID, @RequestParam UUID playerID) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return false;
        return stage.addPlayer(playerID);
    }

    //กำหนดชนิดและกลยุทธ์ของ Minion ก่อนเริ่มเกม
    @PostMapping("/minion-kind/{gameID}")
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

    //Check Strategy
    @PostMapping("/strategy/{gameID}")
    public boolean CheckStrategy(@PathVariable UUID gameID, @RequestBody CheckStartegy startegy) {
        try {
            parser p = new parser(startegy.getStrategy());
            statement ast = p.parse();
            Map<String, Long> v = new HashMap<>();
            ast.exe(v);
            return true;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return false;
        }}

    //ยืนยันการเริ่มเกม
    @PostMapping("/start/{gameID}")
    public boolean StartGame(@PathVariable UUID gameID) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return false;

        // เรียกคำสั่งเตรียมเริ่มเกม (อาจจะต้องไปสร้าง method start() ใน Stage.java เพิ่ม)

        return stage.start_game_setup();}

    //GAMESTATE
    //ดึงข้อมูลทั้งหมดเพื่อแสดงผล
    @GetMapping("/actions/{gameID}/{playerID}")
    public List<MinionAction> MinionAction(@PathVariable UUID gameID ,@PathVariable UUID playerID) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return new ArrayList<>();
        strategist p = stage.getPlayerList().get(playerID);
        if(p == null) {
            System.out.println("Player is null");
            return new ArrayList<>();
        }
        List<MinionAction> PlayerMinionAction = new ArrayList<>();
        for (minion m : p.getMinions() ) {
            // Create a copy of the current actions to return to the frontend
            List<Action> currentActions = new ArrayList<>(m.getActions());
            MinionAction actionsDto = new MinionAction(m.getNo(), p.getUUID(), currentActions);
            PlayerMinionAction.add(actionsDto);
            
            // Clear the actions in the backend so they aren't returned/processed again
            m.clearActions();
        }
        return PlayerMinionAction;
    }


    //ดึงรายการพิกัด Grid ที่ผู้เล่นคนนั้นสามารถซื้อได้ (อยู่ติดกับพื้นที่เดิม)
    @GetMapping("/buyable-grids/{gameID}/{playerID}")
    public List<GridPosition> Getbuyablegrids(@PathVariable UUID gameID, @PathVariable UUID playerID) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return null;
        List<Grid> actualGrids = stage.getBuyableGrids(playerID);
        List<GridPosition> GridPosition = new ArrayList<>();
        for (Grid g : actualGrids) {
            GridPosition.add(g.toPosition());
        }
        return GridPosition;
    }

    //ดึงรายการพิกัด Grid ที่ผู้เล่นคนนั้นเป็นเจ้าของ
    @GetMapping("/spawnable-grids/{gameID}/{playerID}")
    public List<GridPosition> GetSpawnablegrids(@PathVariable UUID gameID, @PathVariable UUID playerID) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return null;

        List<Grid> actualGrids = stage.getSpawnableGrids(playerID);
        List<GridPosition> GridPosition = new ArrayList<>();
        for (Grid g : actualGrids) {
            GridPosition.add(g.toPosition());
        }
        return GridPosition;
    }

    @GetMapping("/status/{gameID}")
    public GameStatus GetGameStatus(@PathVariable UUID gameID) {
        Stage stage = gameService.getGame(gameID);
        if (stage == null) return null;
        return stage.getGameStatus();
    }
}
