package Phaser.AST.Statement;

import Phaser.AST.Expression.Expr;

import java.util.Map;

public record whileStatement(Expr con, Statement state) implements Statement {
    @Override
    public Long eval(Map<String, Long> var) {
        return 0L;
    }

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
