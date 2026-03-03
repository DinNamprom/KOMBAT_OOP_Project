package Parser.AST.Expression;

import Minion.minion;
import Parser.AST.Node;

public interface Expr extends Node {
    Long eval(minion minion);
}
