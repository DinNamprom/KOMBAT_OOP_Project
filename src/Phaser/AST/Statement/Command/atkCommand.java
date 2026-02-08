package Phaser.AST.Statement.Command;

import Phaser.AST.Enum.Direction;
import Phaser.AST.Expression.Expr;

import java.util.Map;

public record atkCommand(Direction dir, Expr pwr) implements Command {
    @Override
    public Long eval(Map<String, Long> var) {
        return 0L;
    }

    @Override
    public Boolean exe(Map<String, Long> var) {
        //Execute Attack Command
        long dmg = pwr.eval(var);
        System.out.println("-> [ACTION] Robot Attack: " + dmg + " dmg");
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("shoot ").append(dir).append(" ");
        pwr.prettyPrint(sb);
    }
}
