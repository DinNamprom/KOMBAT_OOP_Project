package com.example.WebAPI.Parser.AST.Expression;

import com.example.WebAPI.Minion.minion;

import java.util.Map;

public record Number(long l) implements Expr {
    @Override
    public Long eval(minion minion) {
        return l;
    }

    @Override
    public Long eval(Map<String, Long> Val) {
        return l;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(l);
    }
}
