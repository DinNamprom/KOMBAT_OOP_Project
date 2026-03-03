package com.example.WebAPI.Parser.AST.Statement;

import Minion.minion;
import Parser.AST.Node;

public interface statement extends Node {
    Boolean exe(minion minion);
}
