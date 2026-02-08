package Phaser;

import Phaser.AST.*;
import Phaser.AST.Enum.Direction;
import Phaser.AST.Enum.InfoType;
import Phaser.AST.Enum.Operator;
import Phaser.AST.Expression.*;
import Phaser.AST.Expression.Number;
import Phaser.AST.Statement.*;
import Phaser.AST.Statement.Command.Command;
import Phaser.AST.Statement.Command.atkCommand;
import Phaser.AST.Statement.Command.doneCommand;
import Phaser.AST.Statement.Command.moveCommand;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class parser {
    private static tokenizer tk;

    private final Set<String> reservedWords = Set.of(
            "ally", "done", "down", "downleft", "downright", "else", "if",
            "move", "nearby", "opponent", "shoot", "then", "up", "upleft",
            "upright", "while"
    );

    public parser(String msg) {
        tk = new tokenizer(msg);
    }

    public Statement parse() throws Exception {
        List<Statement> statements = new ArrayList<>();
        while (tk.hasNextToken()) {
            statements.add(parseStatement());
        }
        return new BlockStatement(statements);
    }

    private Statement parseStatement() throws Exception {
        if (tk.peek("{")) {
            tk.consume("{");
            List<Statement> stmts = new ArrayList<>();
            while (!tk.peek("}")) {
                stmts.add(parseStatement());
            }
            tk.consume("}");
            return new BlockStatement(stmts);
        }
        String cur = tk.consume();
        if (reservedWords.contains(cur)) {
            if (cur.equals("if")) {
                if (!tk.peek("(")) throw new IllegalArgumentException("Expected '(' after if.");
                tk.consume("(");
                Expr con = parseExpression();
                if (!tk.peek(")")) throw new IllegalArgumentException("Expect ')' after condition from if-statement");
                tk.consume(")");
                if (!tk.peek("then")) throw new IllegalArgumentException("Expect 'then' after if condition");
                tk.consume("then");
                Statement state = parseStatement();
                if (!tk.peek("else")) throw new IllegalArgumentException("Expect 'else' in if-statement");
                tk.consume("else");
                Statement elseState = parseStatement();
                return new ifStatement(con, state, elseState);
            }
            else if (cur.equals("while")) {
                if (!tk.peek("(")) throw new IllegalArgumentException("Expect '(' after while");
                tk.consume("(");
                Expr con = parseExpression();
                if (!tk.peek(")")) throw new IllegalArgumentException("Expect ')' after condition from while-statement but found '" + tk.peek() + "'.");
                tk.consume(")");
                Statement state = parseStatement();
                return new whileStatement(con, state);
            }
            else {
                return parseCommand(cur);
            }
        }
        else {
            if (tk.hasNextToken() && tk.peek("=")) {
                tk.consume("=");
                Expr value = parseExpression();
                return new assignmentStatement(cur, value);
            } else {
                throw new IllegalArgumentException("Unexpected token: " + cur + " (Assignments need '=')");
            }
        }
    }

    private Command parseCommand(String cur) throws Exception {
        switch (cur) {
            case "move" -> {
                Direction dir = getDirectionType(tk.consume());
                return new moveCommand(dir);
            }
            case "shoot" -> {
                Direction dir = getDirectionType(tk.consume());
                Expr power = parseExpression();
                return new atkCommand(dir, power);
            }
            case "done" -> {
                return new doneCommand();
            }
        }
        throw new IllegalArgumentException("Unrecognized command: " + cur);
    }

    private Expr parseExpression() throws Exception {
        Expr e = parseTerm();
        while (tk.hasNextToken() && (tk.peek().equals("+") || tk.peek().equals("-"))) {
            Operator op = getOperator(tk.consume());
            if (!tk.hasNextToken()) throw new IllegalArgumentException("ERROR:Expect NUMBER after OPERATOR.");
            e = new BinaryExpr(e, op, parseTerm());
        }
        return e;
    }

    private Expr parseTerm() throws Exception {
        Expr e = parsePower();
        while (tk.hasNextToken() && (tk.peek().equals("*") || tk.peek().equals("/") || tk.peek().equals("%"))) {
            Operator op = getOperator(tk.consume());
            if (!tk.hasNextToken()) throw new IllegalArgumentException("ERROR:Expect NUMBER after OPERATOR.");
            Expr right = parseFactor();
            e = new BinaryExpr(e, op, right);
        }
        return e;
    }

    private Expr parsePower() throws Exception {
        Expr e = parseFactor();
        while (tk.hasNextToken() && tk.peek().equals("^")) {
            Operator op = getOperator(tk.consume());
            Expr right = parseFactor();
            e = new BinaryExpr(e, op, right);
        }
        return e;
    }

    private Expr parseFactor() throws Exception {
        if (tk.hasNextToken()) {
            if (tk.peek().equals("-")) {
                tk.consume("-");
                if (!tk.hasNextToken()) throw new IllegalArgumentException("ERROR:INVALID OPERATOR");

                if (isNumeric(tk.peek()) || isIdentifier(tk.peek())) {
                    throw new IllegalArgumentException("ERROR:NUMBER cannot be negative.");
                } else {
                    throw new IllegalArgumentException("ERROR:INVALID OPERATOR");
                }
            }
            else if (tk.peek().equals("+") || tk.peek().equals("*") || tk.peek().equals("/") || tk.peek().equals("%")) {
                throw new IllegalArgumentException("ERROR:Expect NUMBER before OPERATOR.");
            }
            if (isNumeric(tk.peek())) {
                String tok = tk.consume();
                return new Number(Long.parseLong(tok));
            }
            else if (isIdentifier(tk.peek())) {
                String name = tk.consume();
                return new Variable(name);
            }
            else if (tk.peek().equals("(")) {
                tk.consume("(");
                if (tk.hasNextToken() && (tk.peek().equals("+") || tk.peek().equals("-") || tk.peek().equals("%") || tk.peek().equals("*") || tk.peek().equals("/")))
                    throw new IllegalArgumentException("ERROR:Expect NUMBER before OPERATOR.");

                Expr e = parseExpression();

                if (!tk.hasNextToken() || !tk.peek().equals(")")) {
                    throw new IllegalArgumentException("ERROR:')' expected.");
                }
                tk.consume(")");
                return e;
            }else if (tk.peek().equals("ally")) {
                tk.consume("ally");
                return new InfoExpr(InfoType.ALLY);
            }else if (tk.peek().equals("opponent")){
                tk.consume("opponent");
                return new InfoExpr(InfoType.OPPONENT);
            }else if (tk.peek().equals("nearby")){
                tk.consume("nearby");
                Direction dir = getDirectionType(tk.consume());
                return new InfoExpr(InfoType.NEARBY, dir);
            } else {
                throw new IllegalArgumentException("ERROR: Unexpected token.");
            }
        } else {
            throw new IllegalArgumentException("ERROR:Line is empty.");
        }
    }

    private boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) return false;
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (c < '0' || c > '9') {
                return false;
            }
        }
        return true;
    }

    private boolean isIdentifier(String s) {
        if (s == null || s.isEmpty()) return false;

        if (!Character.isAlphabetic(s.charAt(0))) return false;

        for (int i = 1; i < s.length(); i++) {
            if (!Character.isAlphabetic(s.charAt(i)) && !Character.isDigit(s.charAt(i))) {
                return false;
            }
        }
        return !reservedWords.contains(s);
    }

    private Direction getDirectionType(String dir) {
        return switch (dir) {
            case "up" -> Direction.UP;
            case "down" -> Direction.DOWN;
            case "upleft" -> Direction.UP_LEFT;
            case "upright" -> Direction.UP_RIGHT;
            case "downleft" -> Direction.DOWN_LEFT;
            case "downright" -> Direction.DOWN_RIGHT;
            default -> throw new IllegalArgumentException("ERROR:Invalid direction.");
        };
    }

    private Operator getOperator(String token) {
        return switch (token) {
            case "+" -> Operator.PLUS;
            case "-" -> Operator.MINUS;
            case "*" -> Operator.MULT;
            case "/" -> Operator.DIV;
            case "%" -> Operator.MOD;
            case "^" -> Operator.POW;
            default -> throw new IllegalArgumentException("Unknown operator: " + token);
        };
    }
}
