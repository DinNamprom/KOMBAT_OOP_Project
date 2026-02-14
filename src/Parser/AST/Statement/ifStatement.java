package Parser.AST.Statement;

import Parser.AST.Expression.Expr;

import java.util.Map;

public record ifStatement(Expr val, statement state, statement elseState) implements statement {

    @Override
    public Boolean exe(Map<String, Long> var) {
        if (val.eval(var) > 0) {
            return state.exe(var);
        } else {
            return elseState.exe(var);
        }
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("if (");
        val.prettyPrint(sb);
        sb.append(") then ");
        state.prettyPrint(sb);
        sb.append(" else ");
        elseState.prettyPrint(sb);
    }
}
