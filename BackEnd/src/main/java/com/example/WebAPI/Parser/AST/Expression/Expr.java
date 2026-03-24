package com.example.WebAPI.Parser.AST.Expression;

import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Parser.AST.Node;

import java.util.Map;

public interface Expr extends Node {
    Long eval(minion minion);
    Long eval(Map<String, Long> Val);
}
