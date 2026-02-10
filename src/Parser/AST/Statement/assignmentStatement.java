package Parser.AST.Statement;

import Parser.AST.Expression.Expr;

import java.util.Map;

public record assignmentStatement(String name, Expr exp) implements Statement {
    @Override
    public Long eval(Map<String, Long> var) {
        return 0L;
    }

    @Override
    public Boolean exe(Map<String, Long> var) {
        long val = exp.eval(var); // คำนวณค่าออกมาก่อน
        var.put(name, val);
        System.out.println("-> [ACTION] Assign: " + name + " = " + val);
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append(name).append(" = ");
        exp.prettyPrint(sb);
    }
}
