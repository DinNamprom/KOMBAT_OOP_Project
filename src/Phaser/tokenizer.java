package Phaser;

import java.util.LinkedList;
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
            throw new Exception(s + "is Expected.");
        }
    }

    public String[] returnStrings() {
        LinkedList<String> l = new LinkedList<>();
        while (hasNextToken()) {
            l.add(consume());
        }
        return l.toArray(new String[0]);
    }

    private void computeNext() {
        StringBuilder s = new StringBuilder();
        while(pos < src.length() && Character.isWhitespace(src.charAt(pos))) pos++;
        if (pos >= src.length()) {
            next = null;
            return;
        }
        char c = src.charAt(pos);
        if (Character.isAlphabetic(src.charAt(pos)) || Character.isDigit(c)) {
            s.append(c);
            for (pos++; pos < src.length() && (Character.isAlphabetic(src.charAt(pos)) || Character.isDigit(src.charAt(pos))); pos++) {
                s.append(src.charAt(pos));
            }
        }else throw new IllegalArgumentException("ERROR:Unknown Character " + c + ".");
        next = s.toString();
    }
}
