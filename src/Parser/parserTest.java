package Parser;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.HashMap;
import java.util.Map;


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

//    @Test
//    public void testParseAndExec_Move() throws Exception {
//        String input = "move down";
//        parser p = new parser(input);
//        statement result = p.parse();
//
//        boolean execResult = false;
//
//        if (result != null) {
//            execResult = result.exe(bindings);
//        }
//
//        assertTrue(execResult);
//        assertTrue(outContent.toString().contains("-> [ACTION] Move: DOWN"));
//    }
//
//    @Test
//    public void testParseAndExec_Attack() throws Exception {
//        String input = "shoot up 50";
//        parser p = new parser(input);
//        statement result = p.parse();
//
//        boolean execResult = false;
//
//        if (result != null) {
//            execResult = result.exe(bindings);
//        }
//
//        assertTrue(execResult);
//        assertTrue(outContent.toString().contains("-> [ACTION] Attack: 50 dmg"));
//    }
//
//    @Test
//    public void testParseAndExec_SensorNearby() throws Exception {
//        String input = "shoot up nearby down";
//        parser p = new parser(input);
//        statement result = p.parse();
//
//        boolean execResult = false;
//
//        if (result != null) {
//            execResult = result.exe(bindings);
//        }
//
//        String output = outContent.toString();
//
//        assertTrue(execResult);
//        assertTrue(output.contains("Checking Nearby Direction") || output.contains("nearby"));
//        assertTrue(output.contains("-> [ACTION] Attack: 10 dmg"));
//    }

//    @Test
//    public void testParseAndExec_Done() throws Exception {
//        String input = "done";
//        parser p = new parser(input);
//        statement result = p.parse();
//
//        boolean execResult = true;
//
//        if (result != null) {
//            execResult = result.exe(bindings);
//        }
//
//        assertFalse(execResult);
//    }
//
//    @Test
//    public void testParseAndExec_IfStatement() throws Exception {
//        String input = "if (hp - 0) then x = 1 else x = 0";
//        bindings.put("hp", 100L);
//
//        parser p = new parser(input);
//        statement result = p.parse();
//
//        if (result != null) {
//            result.exe(bindings);
//        }
//
//        assertEquals(1L, bindings.get("x"));
//
//        bindings.clear();
//        bindings.put("hp", -10L);
//        p = new parser(input);
//        result = p.parse();
//
//        if (result != null) {
//            result.exe(bindings);
//        }
//
//        assertEquals(0L, bindings.get("x"));
//    }
//
//    @Test
//    public void testParseAndExec_WhileStatement() throws Exception {
//        String input = "while (count - 0) { total = total + 1 count = count - 1 }";
//        bindings.put("count", 3L);
//        bindings.put("total", 0L);
//
//        parser p = new parser(input);
//        statement result = p.parse();
//
//        if (result != null) {
//            result.exe(bindings);
//        }
//
//        assertEquals(3L, bindings.get("total"));
//        assertEquals(0L, bindings.get("count"));
//    }
//
//    @Test
//    public void testExpression_Precedence() throws Exception {
//        String input = "result = 1 + 2 * 3 / (4 - 2)";
//        parser p = new parser(input);
//        statement result = p.parse();
//
//        if (result != null) {
//            result.exe(bindings);
//        }

//        assertEquals(4L, bindings.get("result"));
//    }
}