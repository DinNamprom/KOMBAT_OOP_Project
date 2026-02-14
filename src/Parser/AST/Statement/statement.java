package Parser.AST.Statement;

import Parser.AST.Node;

import java.util.Map;

public interface statement extends Node {
    Boolean exe(Map<String, Long> var);
}
