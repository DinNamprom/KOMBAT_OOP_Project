package com.example.WebAPI.Parser.AST.Statement;

import com.example.WebAPI.Minion.minion;
import com.example.WebAPI.Parser.AST.Expression.Expr;

public record whileStatement(Expr con, statement state) implements statement {

    @Override
    public Boolean exe(minion minion) {
        int i = 0,max = 100;
        while(i < max && con.eval(minion) > 0) {
            boolean next_exe = state.exe(minion);
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


