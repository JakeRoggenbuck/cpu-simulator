export interface State {
  PC: number;
  REGS: number[];
}

export function init_state(): State {
  return { PC: 0, REGS: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
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

enum CommandType {
  RType = 0,
  IType = 1,
}

interface Command {
  command_type: CommandType;
  opcode: OPCODE;
  A: number;
  C: number;
  BorIMM: number;
}

function lex_command(input: number): Command | undefined {
  if (input === undefined) {
    return undefined;
  }

  if (typeof input !== 'number') {
    return undefined;
  }

  const opcode = (0xf000 & input) >> 12;
  const c = (0x0f00 & input) >> 8;
  const a = (0x00f0 & input) >> 4;
  const borimm = 0x000f & input;

  // TODO: Check list of IType and RType commands
  const ctype = 0;

  return {
    command_type: ctype,
    opcode: opcode,
    A: a,
    C: c,
    BorIMM: borimm,
  };
}

function lex_commands(instructions: number[]): Command[] {
  let commands: Command[] = [];

  for (let i = 0; i < instructions.length; i++) {
    let a = lex_command(instructions[i]);
    if (a !== undefined) {
      commands.push(a);
    }
  }

  return commands;
}

function parse_commands(commands: Command[], state: State): State {
  for (let i = 0; i < commands.length; i++) {
    let c: Command = commands[i];

	console.log(c);
    if (c.opcode === OPCODE.NOP) {
      continue;
    } else if (c.opcode === OPCODE.STOP) {
      break;
    } else if (c.opcode === OPCODE.ADDI) {
      state.REGS[c.C] = state.REGS[c.A] + c.BorIMM;
    } else if (c.opcode === OPCODE.ADDR) {
      state.REGS[c.C] = state.REGS[c.A] + state.REGS[c.BorIMM];
    } else if (c.opcode === OPCODE.SUBI) {
      state.REGS[c.C] = state.REGS[c.A] - c.BorIMM;
    } else if (c.opcode === OPCODE.SUBR) {
      state.REGS[c.C] = state.REGS[c.A] - state.REGS[c.BorIMM];
    } else if (c.opcode === OPCODE.ANDI) {
      state.REGS[c.C] = state.REGS[c.A] & c.BorIMM;
    } else if (c.opcode === OPCODE.ANDR) {
      state.REGS[c.C] = state.REGS[c.A] & state.REGS[c.BorIMM];
    } else if (c.opcode === OPCODE.ORI) {
      state.REGS[c.C] = state.REGS[c.A] | c.BorIMM;
    } else if (c.opcode === OPCODE.ORR) {
      state.REGS[c.C] = state.REGS[c.A] | state.REGS[c.BorIMM];
    } else if (c.opcode === OPCODE.XORI) {
      state.REGS[c.C] = state.REGS[c.A] ^ c.BorIMM;
    } else if (c.opcode === OPCODE.XORR) {
      state.REGS[c.C] = state.REGS[c.A] ^ state.REGS[c.BorIMM];
    } else if (c.opcode === OPCODE.NEGATE) {
      state.REGS[c.C] = -state.REGS[c.A];
    } else if (c.opcode === OPCODE.NOT) {
      state.REGS[c.C] = Number(!state.REGS[c.A]);
    } else if (c.opcode === OPCODE.MOVE) {
      state.REGS[c.C] = state.REGS[c.A];
    } else if (c.opcode === OPCODE.LOAD) {
      state.REGS[c.C] = c.A;
    }

    console.log(state);
    state.PC++;
  }

  return state;
}

if (import.meta.main) {
  let state = init_state();

  let instructions: number[] = [0b1111000000110000, 0b1111000101100000];

  let instructions_as_commands: Command[] = lex_commands(instructions);

  state = parse_commands(instructions_as_commands, state);
}
