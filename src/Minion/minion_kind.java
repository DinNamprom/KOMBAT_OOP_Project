package Minion;

import Parser.AST.Statement.statement;
import Parser.parser;

public record minion_kind(String name, long spawn_cost, long defenseFactor, String strategy_script) {
    public long getSpawnCost() {
        return spawn_cost;
    }

    public long getDefenseFactor() {
        return defenseFactor;
    }

    public String getName() { return name; }

    public statement getStrategy() throws Exception {
        return new parser(this.strategy_script).parse();
    }
}