package com.example.WebAPI.Parser.AST.Statement.Command;

import com.example.WebAPI.Minion.minion;

import java.util.Map;

public record doneCommand() implements Command {

    @Override
    public Boolean exe(minion minion) {
        return false;
    }

    @Override
    public Boolean exe(Map<String, Long> Val) {
        return false;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("-> [ACTION] Done");
    }
}
