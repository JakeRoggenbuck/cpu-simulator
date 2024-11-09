interface State {
  PC: number;
}

function init_state(): State {
  return { PC: 0 };
}

enum OPCODE {
  NOP = 0b0000,
  STOP = 0b0001,
  ADDI = 0b0010,
  ADDR = 0b0011,
}

if (import.meta.main) {
  let state = init_state();

  console.log(state);

  console.log(OPCODE);
}
