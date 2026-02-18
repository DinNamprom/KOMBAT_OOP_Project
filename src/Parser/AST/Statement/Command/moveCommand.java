package Parser.AST.Statement.Command;

import Minion.minion;
import Parser.AST.Enum.Direction;

public record moveCommand(Direction dir) implements Command {

    @Override
    public Boolean exe(minion minion) {
        // Execute move command
        minion.move(dir);
        IO.println("-> [ACTION] Move: " + dir.toString());
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("move ").append(dir);
    }
}
