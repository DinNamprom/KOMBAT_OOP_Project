package com.example.WebAPI.Parser.AST.Expression;

import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Parser.AST.Enum.Operator;

import java.util.Map;

public record BinaryExpr(Expr left, Operator op, Expr right) implements Expr {
    @Override
    public Long eval(minion minion) {
        Long left = this.left.eval(minion);
        Long right = this.right.eval(minion);
        return switch (op) {
            case PLUS -> left + right;
            case MINUS -> left - right;
            case MULT -> left * right;
            case DIV -> {
                if (right == 0) throw new ArithmeticException("Division by zero");
                yield left / right;
            }
            case MOD -> {
                if (right == 0) throw new ArithmeticException("Modulo by zero");
                yield left % right;
            }
            case POW -> {
                if (right < 0) yield 0L;
                if (right == 0) yield 1L;
                double res = Math.pow(left, right);
                if (res > Long.MAX_VALUE) {
                    yield Long.MAX_VALUE;
                }
                yield (long) res;
            }
        };
    }

    @Override
    public Long eval(Map<String, Long> Val) {
        Long left = this.left.eval(Val);
        Long right = this.right.eval(Val);
        return switch (op) {
            case PLUS -> left + right;
            case MINUS -> left - right;
            case MULT -> left * right;
            case DIV -> {
                if (right == 0) throw new ArithmeticException("Division by zero");
                yield left / right;
            }
            case MOD -> {
                if (right == 0) throw new ArithmeticException("Modulo by zero");
                yield left % right;
            }
            case POW -> {
                if (right < 0) yield 0L;
                if (right == 0) yield 1L;
                double res = Math.pow(left, right);
                if (res > Long.MAX_VALUE) {
                    yield Long.MAX_VALUE;
                }
                yield (long) res;
            }
        };
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("(");
        left.prettyPrint(sb);
        sb.append(" ");

        String symbol = switch (op) {
            case PLUS -> "+";
            case MINUS -> "-";
            case MULT -> "*";
            case DIV -> "/";
            case MOD -> "%";
            case POW -> "^";
        };
        sb.append(symbol);

        sb.append(" ");
        right.prettyPrint(sb);
        sb.append(")");
    }
}
