package Phaser.AST.Expression;

import Phaser.AST.Node;

import java.util.Map;

public interface Expr extends Node {
    Long eval(Map<String, Long> var);
}
