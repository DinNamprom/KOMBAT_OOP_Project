package com.example.WebAPI.Parser.AST.Statement;

import Minion.minion;

import java.util.List;

public record BlockStatement(List<statement> statements) implements statement {

    @Override
    public Boolean exe(minion minion) {
        for (statement s : statements) {
            boolean continueExecution = s.exe(minion);

            if (!continueExecution) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("{\n");
        for (statement s : statements) {
            sb.append("    "); // ย่อหน้าหน่อยจะได้สวย
            s.prettyPrint(sb);
            sb.append("\n");
        }
        sb.append("}");
    }
}
