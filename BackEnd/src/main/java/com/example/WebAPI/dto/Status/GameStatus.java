package com.example.WebAPI.dto.Status;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GameStatus {
    private List<GridStatus> GridStatusList;
}
