package Phaser;

import java.util.NoSuchElementException;

public class tokenizer {
    private final String src;
    private String next;
    private int pos;
    public tokenizer(String src) {
        this.src = src;
        pos = 0;
        computeNext();
    }
    public boolean hasNextToken() {
        return next != null;
    }
    public void checkNextToken() {
        if (!hasNextToken()) {
            throw new NoSuchElementException("There is no more token.");
        }
    }
    public String peek() {
        checkNextToken();
        return next;
    }

    public boolean peek(String s) {
        if (!hasNextToken()) return false;
        return peek().equals(s);
    }

    public String consume() {
        checkNextToken();
        String result = next;
        computeNext();
        return result;
    }

    public void consume(String s) throws Exception {
        if (peek(s)) {
            consume();
        }
        else {
            throw new Exception(s + " is Expected.");
        }
    }

    private void computeNext() {
        StringBuilder s = new StringBuilder();
        while (pos < src.length() && Character.isWhitespace(src.charAt(pos))) {
            pos++;
        }
        if (pos == src.length()) {
            next = null;
            return;
        }
        char c = src.charAt(pos);
        if (c == '#') {
            while (pos < src.length() && src.charAt(pos) != '\n') pos++;
            computeNext();
            return;
        }
        if (Character.isDigit(c)) {
            s.append(c);
            for (pos++; pos < src.length() && Character.isDigit(src.charAt(pos)); pos++) {
                s.append(src.charAt(pos));
            }
        }
        else if (Character.isAlphabetic(src.charAt(pos))) {
            s.append(c);
            for (pos++; pos < src.length() && (Character.isAlphabetic(src.charAt(pos)) || Character.isDigit(src.charAt(pos))); pos++) {
                s.append(src.charAt(pos));
            }
        }else if (c == '(' || c == ')' || c == '{' || c == '}' || c == '=' ) {
            s.append(c);
            pos++;
        }else if (c == '+' || c == '-' || c == '*' || c == '/' || c == '%' || c == '^') {
            s.append(c);
            if (pos + 1 < src.length()) {
                char c2 = src.charAt(pos + 1);
                if (c2 == '+' || c2 == '*' || c2 == '/' || c2 == '%')
                    throw new IllegalArgumentException("ERROR:INVALID OPERATOR");
            }
            pos++;
        }  else throw new IllegalArgumentException("ERROR: Unknown Character " + c + ".");
        next = s.toString();
    }
}
