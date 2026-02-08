package Phaser.AST.Expression;

import java.util.Map;

public record Variable(String name) implements Expr {
    @Override
    public Long eval(Map<String, Long> var) {
        if (var.containsKey(name)) {
            return var.get(name);
        }
        throw new RuntimeException("ERROR: undefined variable: " + name);
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(name);
    }
}
