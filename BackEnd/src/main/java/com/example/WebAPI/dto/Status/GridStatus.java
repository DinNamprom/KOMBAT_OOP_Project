package com.example.WebAPI.dto.Status;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class GridStatus {
    private int row;
    private int col;
    private UUID ownerID;
}
