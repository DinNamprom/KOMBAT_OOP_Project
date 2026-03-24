package com.example.WebAPI.Parser.AST.Statement.Command;

import com.example.WebAPI.Minion.minion;

public record doneCommand() implements Command {

    @Override
    public Boolean exe(minion minion) {
        return false;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("-> [ACTION] Done");
    }
}


