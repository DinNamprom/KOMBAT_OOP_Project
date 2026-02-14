package Parser.AST.Statement;

import java.util.List;
import java.util.Map;

public record BlockStatement(List<statement> statements) implements statement {

    @Override
    public Boolean exe(Map<String, Long> var) {
        for (statement s : statements) {
            boolean continueExecution = s.exe(var);

            if (!continueExecution) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void prettyPrint(StringBuilder sb) {
        sb.append("{\n");
        for (statement s : statements) {
            sb.append("    "); // ย่อหน้าหน่อยจะได้สวย
            s.prettyPrint(sb);
            sb.append("\n");
        }
        sb.append("}");
    }
}
