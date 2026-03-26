package com.example.WebAPI.dto.Status;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class PlayerStatus {
    private UUID playerID;
    private long budget;
}
