package Phaser.AST.Statement.Command;

import Phaser.AST.Enum.Direction;

import java.util.Map;

public record moveCommand(Direction dir) implements Command {

    @Override
    public Long eval(Map<String, Long> var) {
        return 0L;
    }

    @Override
    public Boolean exe(Map<String, Long> var) {
        // Execute move command
        IO.println("-> [ACTION] Robot Move: " + dir.toString());
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("move ").append(dir);
    }
}
