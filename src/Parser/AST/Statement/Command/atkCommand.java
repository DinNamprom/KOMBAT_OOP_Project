package Parser.AST.Statement.Command;

import Parser.AST.Enum.Direction;
import Parser.AST.Expression.Expr;

import java.util.Map;

public record atkCommand(Direction dir, Expr pwr) implements Command {

    @Override
    public Boolean exe(Map<String, Long> var) {
        //Execute Attack Command
        long dmg = pwr.eval(var);
        System.out.println("-> [ACTION] Attack: " + dmg + " dmg");
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("shoot ").append(dir).append(" ");
        pwr.prettyPrint(sb);
    }
}
