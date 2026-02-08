package Phaser.AST.Statement.Command;

import java.util.Map;

public record doneCommand() implements Command {
    @Override
    public Long eval(Map<String, Long> var) {
        return 0L;
    }

    @Override
    public Boolean exe(Map<String, Long> var) {
        return false;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("-> [ACTION] Robot Done");
    }
}
