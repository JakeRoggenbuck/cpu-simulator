interface State {
  PC: number;
}

function init_state(): State {
  return { PC: 0 };
}

export enum OPCODE {
  NOP = 0b0000,
  STOP = 0b0001,
  ADDI = 0b0010,
  ADDR = 0b0011,
  SUBI = 0b0100,
  SUBR = 0b0101,
  ANDI = 0b0110,
  ANDR = 0b0111,
  ORI = 0b1000,
  ORR = 0b1001,
  XORI = 0b1010,
  XORR = 0b1011,
  NEGATE = 0b1100,
  NOT = 0b1101,
  MOVE = 0b1110,
  LOAD = 0b1111,
}

if (import.meta.main) {
  let state = init_state();

  console.log(state);

  console.log(OPCODE);
}
