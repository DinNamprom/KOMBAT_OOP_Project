package com.example.WebAPI.Parser.AST.Statement.Command;

import Minion.minion;
import Parser.AST.Enum.Direction;

public record moveCommand(Direction dir) implements Command {

    @Override
    public Boolean exe(minion minion) {
        // Execute move command
        long cost = minion.cost;
        long cur_budget = minion.getOwner().getBudget();

        if (cur_budget < cost) return false;
        if (minion.move(dir)) {
            minion.getOwner().decreaseBudget(cost);
            System.out.println("-> [ACTION] Move: " + dir.toString());
            return true;
        }
        return false;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("move ").append(dir);
    }
}
