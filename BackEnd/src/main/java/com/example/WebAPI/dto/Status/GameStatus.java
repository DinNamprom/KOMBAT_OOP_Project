package com.example.WebAPI.dto.Status;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GameStatus {
    @JsonProperty("gridStatusList")
    private List<GridStatus> GridStatusList;
    @JsonProperty("minionStatusList")
    private List<MinionStatus> MinionStatusList;
    @JsonProperty("playerStatusList")
    private List<PlayerStatus> PlayerStatusList;
}
