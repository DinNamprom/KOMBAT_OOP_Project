package com.example.WebAPI.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BuyGrid {
    private UUID gameID;
    private UUID PlayerName;
    private int row;
    private int col;
}


