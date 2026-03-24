package com.example.WebAPI.Parser;

import java.util.NoSuchElementException;

public class tokenizer {
    private final String src;
    private String next;
    private int pos;

    /**
     * Contractor
     * @param src != null && src should have length more than 1
     * effect: Change value of variable next
     */
    public tokenizer(String src) {
        this.src = src;
        pos = 0;
        computeNext();
    }

    /**
     * Check if this object have next token to return.
     * @return true if next != null else return false.
     */
    public boolean hasNextToken() {
        return next != null;
    }

    /**
     * Throw error when source String is empty.
     * @throws NoSuchElementException "There is no mere token." when hasNextToken() return false.
     */
    public void checkNextToken() {
        if (!hasNextToken()) {
            throw new NoSuchElementException("There is no more token.");
        }
    }

    /**
     * Return first word of String to client.
     * @return next
     */
    public String peek() {
        checkNextToken();
        return next;
    }

    /**
     *Compare word from client with word from current position of source String.
     * @param s != null && s should have length more than 1
     * @return true if s are same value as next variable else return false
     */
    public boolean peek(String s) {
        if (!hasNextToken()) return false;
        return peek().equals(s);
    }

    /**
     * Return current word then change value from current position to next position of source String.
     * @return result as String
     * effect: change value of next variable.
     */
    public String consume() {
        checkNextToken();
        String result = next;
        computeNext();
        return result;
    }

    /**
     * Change word from current position to next position if word from client are same with word in current position of source String.
     * @param s != null && s should have length more than 1
     * @throws Exception " s is Expected." when s isn't equals to next variable.
     * effect: change value of next variable.
     */
    public void consume(String s) throws Exception {
        if (peek(s)) {
            consume();
        }
        else {
            throw new Exception(s + " is Expected.");
        }
    }

    /**
     * Find the next word from source String.
     * @throws  IllegalArgumentException "INVALID OPERATOR" when first word of String follow regular expression as "(+-*%^/)(+-*%/)*"
     * @throws IllegalArgumentException "Unknow Character 'char from sting' " when character as current position ar not "a-z || A-Z || +-*%^/ || {}() || 0-9"
     * effect: change pos variable value
     * effect: change next variable value
     */
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
                    throw new IllegalArgumentException("INVALID OPERATOR");
            }
            pos++;
        }  else throw new IllegalArgumentException("Unknown Character " + c + ".");
        next = s.toString();
    }
}


