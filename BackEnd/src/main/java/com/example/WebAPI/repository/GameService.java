package com.example.WebAPI.repository;


import com.example.WebAPI.Board.Board;
import com.example.WebAPI.GameEngine.Mode;
import com.example.WebAPI.GameEngine.Stage;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GameService {
    private final Map<UUID, Stage> activeGames = new HashMap<>();

    public UUID createNewGame(Mode mode,String config) throws Exception {
        UUID gameId = UUID.randomUUID();
        Board board = new Board();

        // สมมติว่า Stage constructor รับ config, mode, board
        Stage newStage = new Stage(config, mode, board);

        activeGames.put(gameId, newStage);
        return gameId;
    }

    public Stage getGame(UUID gameId) {
        return activeGames.get(gameId);
    }

    public void removeGame(UUID gameId) {
        activeGames.remove(gameId);
    }
}



