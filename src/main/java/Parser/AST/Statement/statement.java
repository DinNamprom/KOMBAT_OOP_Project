package Parser.AST.Statement;

import Minion.minion;
import Parser.AST.Node;

import java.util.Map;

public interface statement extends Node {
    Boolean exe(minion minion);
    Boolean exe(Map<String, Long> Val);
}
