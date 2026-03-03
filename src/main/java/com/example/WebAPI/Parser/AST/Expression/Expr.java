package com.example.WebAPI.Parser.AST.Expression;

import Minion.minion;
import Parser.AST.Node;

public interface Expr extends Node {
    Long eval(minion minion);
}
