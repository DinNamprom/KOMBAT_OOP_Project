package Parser.AST.Statement;

import Parser.AST.Expression.Expr;

import java.util.Map;

public record whileStatement(Expr con, statement state) implements statement {

    @Override
    public Boolean exe(Map<String, Long> var) {
        int i = 0,max = 100;
        while(i < max && con.eval(var) > 0) {
            boolean next_exe = state.exe(var);
            if(!next_exe) {
                return false;
            }
            i++;
        }
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("while (");
        con.prettyPrint(sb);
        sb.append(") ");
        state.prettyPrint(sb);
    }
}
