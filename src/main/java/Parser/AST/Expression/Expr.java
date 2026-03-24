package Parser.AST.Expression;

import Minion.minion;
import Parser.AST.Node;

import java.util.Map;

public interface Expr extends Node {
    Long eval(minion minion);
    Long eval(Map<String, Long> Val);
}
