package Parser.AST.Statement;

import Minion.minion;
import Parser.AST.Expression.Expr;

public record ifStatement(Expr val, statement state, statement elseState) implements statement {

    @Override
    public Boolean exe(minion minion) {
        if (val.eval(minion) > 0) {
            return state.exe(minion);
        } else {
            return elseState.exe(minion);
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
