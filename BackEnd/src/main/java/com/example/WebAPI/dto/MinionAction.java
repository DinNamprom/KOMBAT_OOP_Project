package com.example.WebAPI.dto;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
public class MinionAction {
    private int no;
    private UUID owner_uuid;
    private List<Action> actions;
}
