package Parser.AST.Statement.Command;

import Minion.minion;
import Parser.AST.Enum.Direction;
import Parser.AST.Expression.Expr;

public record atkCommand(Direction dir, Expr pwr) implements Command {

    @Override
    public Boolean exe(minion minion) {
        //Execute Attack Command
        long dmg = pwr.eval(minion);
        if (dmg <= 0) return false;
        long current_budget = minion.getVariable().getOrDefault("budget", 0L);
        long total_cost = dmg + 1;
        if (current_budget < total_cost) return false;
        minion.getVariable().put("budget", current_budget - total_cost);
        System.out.println("-> [ACTION] Attack: " + dmg + " cost: " + total_cost);
        minion.Shoot(dir, dmg);
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("shoot ").append(dir).append(" ");
        pwr.prettyPrint(sb);
    }
}
