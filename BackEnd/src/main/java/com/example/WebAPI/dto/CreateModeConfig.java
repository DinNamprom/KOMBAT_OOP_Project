package com.example.WebAPI.dto;

import com.example.WebAPI.GameEngine.Mode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateModeConfig {
    private Mode mode;
    private String config;
}


