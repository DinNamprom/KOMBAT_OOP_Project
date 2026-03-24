package com.example.WebAPI.dto;
import com.example.WebAPI.Board.Grid;
import com.example.WebAPI.Minion.minion_kind;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpawnMinion {
    private UUID gameID;
    private UUID playerName;
    private String kind;
    private int row;
    private int col;
}


