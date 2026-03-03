package com.example.WebAPI.Parser.AST.Expression;

import Minion.minion;

public record Number(long l) implements Expr {
    @Override
    public Long eval(minion minion) {
        return l;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(l);
    }
}
