package com.example.WebAPI.Parser.AST.Expression;

import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Parser.AST.Enum.Direction;
import com.example.WebAPI.Parser.AST.Enum.InfoType;

import java.util.Map;

public record InfoExpr(InfoType info, Direction dir) implements Expr {

    public InfoExpr(InfoType type) {
        this(type, null);
    }
    @Override
    public Long eval(minion minion) {
        switch (info) {
            case ALLY -> {
                System.out.println("-> [SENSOR] Checking Ally...");
                return  minion.Check(InfoType.ALLY);
            } //add Ally compute later
            case OPPONENT -> {
                System.out.println("-> [SENSOR] Checking Opponent...");
                return minion.Check(InfoType.OPPONENT);
            } // same as ally
            case NEARBY -> {
                System.out.println("-> [SENSOR] Checking Nearby Direction " + dir.toString() + "...");
                return minion.CheckDir(InfoType.NEARBY, dir);
            }// add Nearby direction later
        }
        return 0L;
    }

    @Override
    public Long eval(Map<String, Long> Val) {
        switch (info) {
            case ALLY -> {
                System.out.println("-> [SENSOR] Checking Ally...");
            } //add Ally compute later
            case OPPONENT -> {
                System.out.println("-> [SENSOR] Checking Opponent...");
            } // same as ally
            case NEARBY -> {
                System.out.println("-> [SENSOR] Checking Nearby Direction " + dir.toString() + "...");
            }// add Nearby direction later
        }
        return 0L;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        if (info == InfoType.NEARBY) {
            sb.append("nearby ").append(dir.toString()).append("\n");
        } else {
            sb.append(info.toString().toLowerCase());
        }
    }
}
