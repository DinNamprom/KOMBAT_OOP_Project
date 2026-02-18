package Minion;

import Parser.AST.Statement.statement;
import Parser.parser;

public class minion_kind {
    private final String name;
    private final long spawn_cost;
    private final long defenseFactor;
    private final String strategy_script;

    public minion_kind(String name, long SpawnCost, long defenseFactor, String strategy_script) {
        this.name = name;
        this.spawn_cost = SpawnCost;
        this.defenseFactor = defenseFactor;
        this.strategy_script = strategy_script;
    }

    public String getName() { return name; }
    public long getSpawnCost() { return spawn_cost; }
    public long getDefenseFactor() { return defenseFactor; }
    public statement getStrategy() throws Exception { return new parser(this.strategy_script).parse(); }

}