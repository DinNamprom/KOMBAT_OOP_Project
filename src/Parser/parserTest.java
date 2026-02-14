package Parser;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.Map;

import Parser.AST.Statement.statement;

class parserTest {

    private final ByteArrayOutputStream outContent = new ByteArrayOutputStream();
    private final PrintStream originalOut = System.out;
    private Map<String, Long> bindings;

    @BeforeEach
    public void setUp() {
        System.setOut(new PrintStream(outContent));
        bindings = new HashMap<>();
    }

    @AfterEach
    public void tearDown() {
        System.setOut(originalOut);
    }

    @Test
    public void testParseAndExec_Move() throws Exception {
        String input = "move down";
        parser p = new parser(input);
        statement result = p.parse();

        boolean execResult = false;

        if (result != null) {
            execResult = result.exe(bindings);
        }

        assertTrue(execResult);
        assertTrue(outContent.toString().contains("-> [ACTION] Move: DOWN"));
    }

    @Test
    public void testParseAndExec_Attack() throws Exception {
        String input = "shoot up 50";
        parser p = new parser(input);
        statement result = p.parse();

        boolean execResult = false;

        if (result != null) {
            execResult = result.exe(bindings);
        }

        assertTrue(execResult);
        assertTrue(outContent.toString().contains("-> [ACTION] Attack: 50 dmg"));
    }

    @Test
    public void testParseAndExec_SensorNearby() throws Exception {
        String input = "shoot up nearby down";
        parser p = new parser(input);
        statement result = p.parse();

        boolean execResult = false;

        if (result != null) {
            execResult = result.exe(bindings);
        }

        String output = outContent.toString();

        assertTrue(execResult);
        // เช็คว่า Sensor ทำงาน
        assertTrue(output.contains("Checking Nearby Direction") || output.contains("nearby"));
        // เช็คว่าค่า Default ของ nearby (10) ถูกนำไปใช้คำนวณดาเมจ
        assertTrue(output.contains("-> [ACTION] Attack: 10 dmg"));
    }

    @Test
    public void testParseAndExec_Done() throws Exception {
        String input = "done";
        parser p = new parser(input);
        statement result = p.parse();

        boolean execResult = true;

        if (result != null) {
            execResult = result.exe(bindings);
        }

        assertFalse(execResult);
    }
}