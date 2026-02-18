package Parser.AST.Expression;

import Minion.minion;

public record Variable(String name) implements Expr {
    @Override
    public Long eval(minion minion) {
        if (minion.getVariable().containsKey(name)) {
            return minion.getVariable().get(name);
        }
        throw new RuntimeException("ERROR: undefined variable: " + name);
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(name);
    }
}
