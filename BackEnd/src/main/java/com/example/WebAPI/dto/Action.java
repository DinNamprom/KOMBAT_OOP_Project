package com.example.WebAPI.dto;

import lombok.AllArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
public class Action {
    private int row;
    private int col;
    private boolean isAtk;
    private UUID target_owner;
    private long target_no;
}
