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
  const commands: Command[] = [];

  for (let i = 0; i < instructions.length; i++) {
    const a = lex_command(instructions[i]);
    if (a !== undefined) {
      commands.push(a);
    }
  }

  return commands;
}

function parse_commands(commands: Command[], state: State): State {
  for (let i = 0; i < commands.length; i++) {
    const c: Command = commands[i];

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

function make_instr(parts: number[]): number {
  return (parts[0] << 12) + (parts[1] << 8) + (parts[2] << 4) + parts[3];
}

function read_instr(instr: string): number {
  const parts = instr.split(' ');

  if (parts.length < 1) {
    return 0;
  }

  const op = OPCODE[parts[0]];

  let num: number = op << 12;
  let shift = 8;

  for (let i = 1; i < parts.length; i++) {
    let n = parts[i];
    n = n.replace('REG', '');
    // This work for 8 -> 4 -> 0 specifically but
    // does not generalize
    num += Number(n) << shift;
    shift -= 4;
  }

  return num;
}

if (import.meta.main) {
  const state = init_state();

  const instructions: number[] = [
    // LOAD Reg0 = 3
    0b1111000000110000,
    // LOAD Reg1 = 6
    0b1111000101100000,
    // ADDR Reg2 = Reg0 + Reg1
    make_instr([OPCODE.ADDR, 2, 0, 1]),
    // SUBI Reg2 = Reg2 - 1
    make_instr([OPCODE.SUBI, 2, 2, 1]),
  ];

  const c = read_instr('LOAD REG5 7');
  const d = read_instr('ADDR REG6 REG5 REG0');
  instructions.push(c);
  instructions.push(d);

  const instructions_as_commands: Command[] = lex_commands(instructions);

  state = parse_commands(instructions_as_commands, state);

  const b = lex_command(c);
  console.log(b);
}
