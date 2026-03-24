package dto;
import lombok.AllArgsConstructor;
import lombok.Data;
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
