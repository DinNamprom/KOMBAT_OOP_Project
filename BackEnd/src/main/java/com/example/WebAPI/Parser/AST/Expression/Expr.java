package com.example.WebAPI.Parser.AST.Expression;

import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Parser.AST.Node;

public interface Expr extends Node {
    Long eval(minion minion);
}


