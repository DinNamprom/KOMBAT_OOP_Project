package com.example.WebAPI.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMinion {
    private String name;
    private int hp;
    private int def;
    private int spawncost;
    private String strategy;
}

