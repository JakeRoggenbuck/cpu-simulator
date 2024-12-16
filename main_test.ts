import { assertEquals, assertNotEquals } from "@std/assert";
import { init_state, OPCODE, State } from "./main.ts";

Deno.test(function opcodeCompletnessTest() {
  for (let i = 0; i < 16; i++) {
    assertNotEquals(OPCODE[i], undefined);
  }
  assertEquals(OPCODE[15], "LOAD");

  assertNotEquals(OPCODE[14], "LOAD");
  assertNotEquals(OPCODE[0], "LOAD");

  assertEquals(OPCODE[0], "NOP");

  assertEquals(OPCODE["NOP"], 0);
  assertEquals(OPCODE["ADDI"], OPCODE.ADDI);
});

Deno.test(function init_stateTest() {
  const s: State = init_state();
  assertEquals(s.REGS.length, 16);
  assertEquals(s.REGS[0], 0);
});
