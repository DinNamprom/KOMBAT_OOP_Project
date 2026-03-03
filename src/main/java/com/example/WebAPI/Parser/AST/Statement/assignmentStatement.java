package com.example.WebAPI.Parser.AST.Statement;

import Minion.minion;
import com.example.WebAPI.Parser.AST.Expression.Expr;

public record assignmentStatement(String name, Expr exp) implements statement {

    @Override
    public Boolean exe(minion minion) {
        long val = exp.eval(minion);
        minion.getVariable().put(name, val);
        System.out.println("-> [ACTION] Assign: " + name + " = " + val);
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(name).append(" = ");
        exp.prettyPrint(sb);
    }
}
