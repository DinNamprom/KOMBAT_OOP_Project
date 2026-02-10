package Parser.AST.Expression;

import java.util.Map;

public record Number(long l) implements Expr {
    @Override
    public Long eval(Map<String, Long> var) {
        return l;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(l);
    }
}
