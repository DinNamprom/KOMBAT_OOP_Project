package com.example.WebAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MinionAction {
    private int no;
    private UUID owner_uuid;
    private List<Action> actions;
}
