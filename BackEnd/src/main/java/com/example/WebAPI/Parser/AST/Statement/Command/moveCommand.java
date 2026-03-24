package com.example.WebAPI.Parser.AST.Statement.Command;

import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Parser.AST.Enum.Direction;
import com.example.WebAPI.dto.Action;

import java.util.Map;

public record moveCommand(Direction dir) implements Command {

    @Override
    public Boolean exe(minion minion) {
        // Execute move command
        long cost = minion.cost;
        long cur_budget = minion.getOwner().getBudget();

        if (cur_budget < cost) return false;
        if (minion.move(dir)) {
            minion.getOwner().decreaseBudget(cost);
            Action action = new Action(minion.getRow(),minion.getCol(),false, null, -1);
            minion.getActions().add(action);
            System.out.println("-> [ACTION] Move: " + dir.toString());
            return true;
        }
        return false;
    }

    @Override
    public Boolean exe(Map<String, Long> Val) {
        System.out.println("-> [ACTION] Move: " + dir.toString());
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("move ").append(dir);
    }
}
