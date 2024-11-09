import { assert } from '@std/assert';
import { OPCODE } from './main.ts';

Deno.test(function opcodeCompletnessTest() {
  for (let i = 0; i < 16; i++) {
    assert(OPCODE[i] !== undefined);
  }
  assert(OPCODE[15] === 'LOAD');

  assert(OPCODE[14] !== 'LOAD');
  assert(OPCODE[0] !== 'LOAD');

  assert(OPCODE[0] === 'NOP');

  assert(OPCODE['NOP'] === 0);
  assert(OPCODE['ADDI'] === OPCODE.ADDI);
});
