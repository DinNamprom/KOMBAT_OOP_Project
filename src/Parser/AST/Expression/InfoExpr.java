package Parser.AST.Expression;

import Parser.AST.Enum.Direction;
import Parser.AST.Enum.InfoType;

import java.util.Map;

public record InfoExpr(InfoType info, Direction dir) implements Expr {

    public InfoExpr(InfoType type) {
        this(type, null);
    }
    @Override
    public Long eval(Map<String, Long> var) {
        switch (info) {
            case ALLY -> {
                IO.println("   [SENSOR] Checking Ally...");
                return  1L;
            } //add Ally compute later
            case OPPONENT -> {
                IO.println("   [SENSOR] Checking Opponent...");
                return 1L;
            } // same as ally
            case NEARBY -> {
                IO.println("   [SENSOR] Checking Nearby Direction " + dir.toString() + "...");
                return 10L;
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
