package com.example.WebAPI.Parser;

import com.example.WebAPI.Parser.AST.Enum.*;
import com.example.WebAPI.Parser.AST.Expression.*;
import com.example.WebAPI.Parser.AST.Statement.*;
import com.example.WebAPI.Parser.AST.Statement.Command.*;

import java.util.*;

public class parser {
    private static tokenizer tk;

    private final Set<String> reservedWords = Set.of(
            "ally", "done", "down", "downleft", "downright", "else", "if",
            "move", "nearby", "opponent", "shoot", "then", "up", "upleft",
            "upright", "while"
    );

    /**
     * Constructor
     * @param msg != null && should have length at least 1
     * effect: change value of tk variable
     */
    public parser(String msg) {
        tk = new tokenizer(msg);
    }

    /**
     * Parse value from tokenizer
     * @return Statement object that ready to execute.
     * @throws Exception from library List,method parseStatement(), BlockStatement()
     * effect: create list contain Statement object
     * effect: create Statement object from method parseStatement()
     */
    public statement parse() throws Exception {
        List<statement> statements = new ArrayList<>();
        while (tk.hasNextToken()) {
            statements.add(parseStatement());
        }
        return new BlockStatement(statements);
    }

    /**
     * Pares value in Statement :Grammar - Statement → Command | BlockStatement | IfStatement | WhileStatement
     * @return Statement object from AST
     * @throws Exception from method parseStatement(), BlockStatement(), parseCommand(), parseExpression(), ifStatement(),whileStatement() ,tokenizer
     * @throws IllegalArgumentException "Expected '(' after if." if next token after "if" isn't "(".
     * @throws IllegalArgumentException "Expect ')' after condition from if-statement" if next token after Expression isn't ")".
     * @throws IllegalArgumentException "Expect 'then' after if condition" if next token after ")" isn't "then".
     * @throws IllegalArgumentException "Expect 'else' after if condition" if next token after Statement isn't "else".
     * @throws IllegalArgumentException "Expect '(' after while" if next token after "while" isn't "(".
     * @throws IllegalArgumentException "Expect ')' after condition from while-statement" if next token after Expression isn't ")".
     * effect: create Statement object
     */
    private statement parseStatement() throws Exception {
        if (tk.peek("{")) {
            tk.consume("{");
            List<statement> stmts = new ArrayList<>();
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
                statement state = parseStatement();
                if (!tk.peek("else")) throw new IllegalArgumentException("Expect 'else' in if-statement");
                tk.consume("else");
                statement elseState = parseStatement();
                return new ifStatement(con, state, elseState);
            }
            else if (cur.equals("while")) {
                if (!tk.peek("(")) throw new IllegalArgumentException("Expect '(' after while");
                tk.consume("(");
                Expr con = parseExpression();
                if (!tk.peek(")")) throw new IllegalArgumentException("Expect ')' after condition from while-statement.");
                tk.consume(")");
                statement state = parseStatement();
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
    /**
     * Pares value in Statement :Grammar - Command → AssignmentStatement | ActionCommand
     * @param cur != null
     * @return return Command Object from AST
     * @throws IllegalArgumentException " Unrecognized command " if cur doesn't contain registered command.
     */
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
    /**
     * Pares value in Statement :Grammar - Expression → Expression + Term | Expression - Term | Term
     * @return Expr Object from AST
     * @throws IllegalArgumentException "Expect NUMBER after OPERATOR." if string value after + || - isn't NUMBER
     */
    private Expr parseExpression() throws Exception {
        Expr e = parseTerm();
        while (tk.hasNextToken() && (tk.peek().equals("+") || tk.peek().equals("-"))) {
            Operator op = getOperator(tk.consume());
            if (!tk.hasNextToken()) throw new IllegalArgumentException("Expect NUMBER after OPERATOR.");
            e = new BinaryExpr(e, op, parseTerm());
        }
        return e;
    }
    /**
     * Pares value in Statement :Grammar - Term → Term * Factor | Term / Factor | Term % Factor | Factor
     * @return Expr Object from AST
     * @throws IllegalArgumentException "Expect NUMBER after OPERATOR." if string value after * || / || % isn't NUMBER
     */
    private Expr parseTerm() throws Exception {
        Expr e = parsePower();
        while (tk.hasNextToken() && (tk.peek().equals("*") || tk.peek().equals("/") || tk.peek().equals("%"))) {
            Operator op = getOperator(tk.consume());
            if (!tk.hasNextToken()) throw new IllegalArgumentException("Expect NUMBER after OPERATOR.");
            Expr right = parsePower();
            e = new BinaryExpr(e, op, right);
        }
        return e;
    }
    /**
     * Pares value in Statement :Grammar - Factor → Power ^ Factor | Power
     * @return Expr Object from AST
     * @throws IllegalArgumentException "Expect NUMBER after OPERATOR." if string value after ^ isn't NUMBER
     */
    private Expr parsePower() throws Exception {
        Expr e = parseFactor();
        while (tk.hasNextToken() && tk.peek().equals("^")) {
            Operator op = getOperator(tk.consume());
            Expr right = parseFactor();
            e = new BinaryExpr(e, op, right);
        }
        return e;
    }

    /**
     * Pares value in Statement :Grammar - Power → <number> | <identifier> | ( Expression ) | InfoExpression
     * @return Expr Object from AST
     * @throws IllegalArgumentException "Expect NUMBER before OPERATOR." if string value before operator isn't NUMBER
     * @throws IllegalArgumentException "NUMBER cannot be negative." if receive negative number
     * @throws IllegalArgumentException "INVALID OPERATOR" if receive duel operator ex. +- ++ -- /%
     * @throws IllegalArgumentException "')' expected." if after Expression doesn't have ')'
     * @throws IllegalArgumentException "Unexpected token." if receive something other than grammar
     * @throws IllegalArgumentException "Line is empty." if recieve empty string
     */
    private Expr parseFactor() throws Exception {
        if (tk.hasNextToken()) {
            if (tk.peek().equals("-")) {
                tk.consume("-");
                if (!tk.hasNextToken()) throw new IllegalArgumentException("Expect NUMBER before OPERATOR.");

                if (isNumeric(tk.peek()) || isIdentifier(tk.peek())) {
                    throw new IllegalArgumentException("NUMBER cannot be negative.");
                } else {
                    throw new IllegalArgumentException("INVALID OPERATOR");
                }
            }
            else if (tk.peek().equals("+") || tk.peek().equals("*") || tk.peek().equals("/") || tk.peek().equals("%")) {
                throw new IllegalArgumentException("Expect NUMBER before OPERATOR.");
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
                    throw new IllegalArgumentException("NUMBER before OPERATOR.");

                Expr e = parseExpression();

                if (!tk.hasNextToken() || !tk.peek().equals(")")) {
                    throw new IllegalArgumentException("')' expected.");
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
                if (!tk.hasNextToken()) throw new IllegalArgumentException("Expect DIRECTION.");
                Direction dir = getDirectionType(tk.consume());
                return new InfoExpr(InfoType.NEARBY, dir);
            } else {
                throw new IllegalArgumentException("Unexpected token.");
            }
        } else {
            throw new IllegalArgumentException("Line is empty.");
        }
    }
    /**
     * Check is incoming string is Numeric
     * @param str != null
     * @return is string contain only Digit.
     */
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
    /**
     * Check incoming string is Identifier
     * @param s != null
     * @return is s a reserved Word? and s contain Alphabetic and Digit.
     */
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

    /**
     * Convert String -> Enum of Direction
     * @param dir != null && dir is "up || down || upleft || upright || downleft || downright"
     * @return Enum Direction
     * @throws IllegalArgumentException "Invalid direction" if there is no registered direction in Enum
     */
    private Direction getDirectionType(String dir) {
        return switch (dir) {
            case "up" -> Direction.UP;
            case "down" -> Direction.DOWN;
            case "upleft" -> Direction.UP_LEFT;
            case "upright" -> Direction.UP_RIGHT;
            case "downleft" -> Direction.DOWN_LEFT;
            case "downright" -> Direction.DOWN_RIGHT;
            default -> throw new IllegalArgumentException("Invalid direction." + dir);
        };
    }

    /**
     * Convert String -> Enum of Direction
     * @param token != null && dir is "* || + || - || / || % || ^"
     * @return Enum Direction
     * @throws IllegalArgumentException "Unknown operator" if there is no registered operator in Enum
     */
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

    public static void main(String[] args) {
        parser p = new parser("t = t+1 \n move  \n shoot up 3*(t+1)-(9/2)");
        try {
            statement ast = p.parse();
            Map<String, Long> v = new HashMap<>();
            ast.exe(v);
        }catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}
