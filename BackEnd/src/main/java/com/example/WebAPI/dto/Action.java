package com.example.WebAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class Action {
    private int row;
    private int col;
    private boolean atk;
    private UUID target_owner;
    private long target_no;
    private long dmg;
}
