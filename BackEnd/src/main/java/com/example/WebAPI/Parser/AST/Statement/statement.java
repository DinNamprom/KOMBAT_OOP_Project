package com.example.WebAPI.Parser.AST.Statement;

import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Parser.AST.Node;

public interface statement extends Node {
    Boolean exe(minion minion);
}


