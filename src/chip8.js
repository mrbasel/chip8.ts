import { fontset } from "./fontset.js";
import { getNthBit } from "./utils.js";

export class Chip8 {
  memory = new Uint8Array(4096);
  registers = new Uint8Array(16);
  display = new Uint8Array(64 * 32);
  pc = 0x200;
  indexReg = 0;
  delayTimer;
  soundTimer;
  drawFlag;
  stack = [];
  stackPointer;
  keypad = new Uint8Array(16);

  constructor(programArray) {
    fontset.forEach((elem, i) => {
      this.memory[i] = elem;
    });

    for (let i = 0; i < this.memory.length; i++) {
      this.memory[512 + i] = programArray[i];
    }
  }

  emulateCycle() {
    // Fetch opcode
    const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
    this.pc += 2;

    // Decode and execute
    const X = (opcode & 0x0f00) >> 8;
    const Y = (opcode & 0x00f0) >> 4;
    const N = opcode & 0x000f;
    const NN = opcode & 0x00ff;
    const NNN = opcode & 0x0fff;

    this.drawFlag = false;

    switch (opcode & 0xf000) {
      case 0x0:
        if (opcode === 0x00ee) {
          this.pc = this.stack.pop();
        }
        console.log("Clear display");
        this.display.fill(0);
        break;
      case 0x1000:
        console.log("Jump to " + NNN);
        this.pc = NNN;
        break;

      case 0x2000:
        this.stack.push(this.pc);
        this.pc = NNN;
        break;

      case 0x6000:
        console.log(`Set register V${X} to ${NN}`);
        this.registers[X] = NN;
        break;
      case 0x7000:
        console.log(`Add ${NN} to V${X}`);
        this.registers[X] += NN;
        break;

      case 0xa000:
        console.log(`Set I to ${NNN}`);
        this.indexReg = NNN;
        break;

      case 0xd000:
        let [xCord, yCord] = [this.registers[X], this.registers[Y]];
        if (xCord > 64) xCord = xCord - 64;
        if (yCord > 32) yCord = yCord - 32;
        console.log(`Draw at (${xCord}, ${yCord})`);

        this.registers[0xf] = 0;
        for (let i = 0; i < N; i++) {
          let cy = yCord + i;
          for (let j = 0; j < 8; j++) {
            let cx = xCord + j;
            const pixel = this.memory[this.indexReg + i];
            if (getNthBit(pixel, 7 - j) !== 0) {
              if (this.display[64 * cy + cx] === 1) this.registers[0xf] = 1;

              this.display[64 * cy + cx] ^= 1;
            }
          }
        }

        this.drawFlag = true;
        break;

      default:
        break;
    }
  }
}
