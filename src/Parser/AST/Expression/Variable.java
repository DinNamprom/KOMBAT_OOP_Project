package Parser.AST.Expression;

import Minion.minion;

public record Variable(String name) implements Expr {
    @Override
    public Long eval(minion minion) {
        if (minion.getVariable().containsKey(name)) {
            return minion.getVariable().get(name);
        }
        if (name.equals("Budget")) {
            return minion.getOwner().getBudget();
        }
        IO.println("-> [Warning] Variable " + name + " hasn't assign yet!");
        return 0L;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(name);
    }
}
