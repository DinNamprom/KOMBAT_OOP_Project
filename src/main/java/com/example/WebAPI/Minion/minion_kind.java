package com.example.WebAPI.Minion;

import com.example.WebAPI.Parser.AST.Statement.statement;
import com.example.WebAPI.Parser.parser;

public record minion_kind(String name, long spawn_cost, long defenseFactor, String strategy_script) {
    public long getSpawnCost() {
        return spawn_cost;
    }

    public String getName() { return name; }

    public statement getStrategy() throws Exception {
        return new parser(this.strategy_script).parse();
    }
}