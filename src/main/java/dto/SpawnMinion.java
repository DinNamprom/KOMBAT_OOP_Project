package dto;
import Board.Grid;
import Minion.minion_kind;
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
    private String playerName;
    private String kind;
    private int row;
    private int col;
}
