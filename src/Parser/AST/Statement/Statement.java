package Parser.AST.Statement;

import Parser.AST.Node;

import java.util.Map;

public interface Statement extends Node {
    Long eval(Map<String, Long> var);
    Boolean exe(Map<String, Long> var);
}
