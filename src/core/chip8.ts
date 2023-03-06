import { fontset } from "./fontset.js";
import { getNthBit } from "./utils.js";

export class Chip8 {
  private _memory = new Uint8Array(4096);
  private _registers = new Uint8Array(16);
  private _display = new Uint8Array(64 * 32);
  pc = 0x200;
  indexReg = 0;
  delayTimer: number;
  soundTimer: number;
  drawFlag: boolean;
  stack: number[] = [];
  keypad = new Uint8Array(16);

  constructor() {
    fontset.forEach((elem, i) => {
      this._memory[i] = elem;
    });
  }

  loadProgram(programArray: Uint8Array) {
    this.reset();
    for (let i = 0; i < this._memory.length; i++) {
      this._memory[512 + i] = programArray[i];
    }
  }

  reset() {
    this._memory = new Uint8Array(4096);
    this._registers = new Uint8Array(16);
    this._display = new Uint8Array(64 * 32);
    this.pc = 0x200;
    this.indexReg = 0;
    // this.delayTimer = 0;
    // this.soundTimer = 0;
    this.drawFlag = false;
    this.stack = [];
    this.keypad = new Uint8Array(16);
  }

  get memory() {
    return this._memory;
  }

  get registers() {
    return this._registers;
  }

  get display() {
    return this._display;
  }

  emulateCycle() {
    // Fetch opcode
    const opcode = (this._memory[this.pc] << 8) | this._memory[this.pc + 1];
    this.pc += 2;

    // Decode and execute
    const X = (opcode & 0x0f00) >> 8;
    const Y = (opcode & 0x00f0) >> 4;
    const N = opcode & 0x000f;
    const NN = opcode & 0x00ff;
    const NNN = opcode & 0x0fff;

    this.drawFlag = false;

    // decrement timers
    if (this.delayTimer > 0) this.delayTimer--;
    if (this.soundTimer > 0) this.soundTimer--;

    switch (opcode & 0xf000) {
      case 0x0:
        if (opcode === 0x00ee) {
          this.pc = this.stack.pop() as number;
        } else {
          console.log("Clear display");
          this._display.fill(0);
        }
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
        this._registers[X] = NN;
        break;
      case 0x7000:
        console.log(`Add ${NN} to V${X}`);
        this._registers[X] += NN;
        break;

      case 0xa000:
        console.log(`Set I to ${NNN}`);
        this.indexReg = NNN;
        break;

      // Skip instructions
      case 0x3000:
        if (this._registers[X] === NN) this.pc += 2;
        break;

      case 0x4000:
        if (this._registers[X] !== NN) this.pc += 2;
        break;

      case 0x5000:
        if (this._registers[X] === this._registers[Y]) this.pc += 2;
        break;

      case 0x9000:
        if (this._registers[X] !== this._registers[Y]) this.pc += 2;
        break;

      // Logical and arithmetic instructions
      case 0x8000:
        switch (N) {
          case 0:
            this._registers[X] = this._registers[Y];
            break;

          case 1:
            this._registers[X] |= this._registers[Y];
            break;

          case 2:
            this._registers[X] &= this._registers[Y];
            break;

          case 3:
            this._registers[X] ^= this._registers[Y];
            break;

          case 4:
            if (this._registers[X] + this._registers[Y] > 255)
              this._registers[0xf] = 1;
            else this._registers[0xf] = 0;

            this._registers[X] += this._registers[Y];
            break;

          case 5:
            this._registers[0xf] = 1;
            if (this._registers[Y] > this._registers[X])
              this._registers[0xf] = 0;
            this._registers[X] = this._registers[X] - this._registers[Y];
            break;

          case 7:
            this._registers[0xf] = 1;
            if (this._registers[Y] - this._registers[X] < 0)
              this._registers[0xf] = 0;
            this._registers[Y] -= this._registers[X];
            break;

          case 6:
            // this.registers[X] = this.registers[Y];
            this._registers[0xf] = this._registers[X] & 0x01;
            this._registers[X] = this._registers[X] >> 1;
            break;

          case 0xe:
            // this.registers[X] = this.registers[Y];
            this._registers[0xf] = (this._registers[X] & 0x80) >> 7;
            this._registers[X] = this._registers[X] << 1;
            break;

          default:
            break;
        }

        break;

      case 0xb000:
        this.pc = NNN + this._registers[0x0];
        break;

      case 0xc000:
        this._registers[X] = (Math.random() * 256) & NN;
        break;

      case 0xe000:
        switch (NN) {
          case 0x9e:
            if (this.keypad[this._registers[X]] === 1) this.pc += 2;
            break;
          case 0xa1:
            if (this.keypad[this._registers[X]] !== 1) this.pc += 2;
            break;
        }
        break;

      case 0xf000:
        switch (NN) {
          case 0x07:
            this._registers[X] = this.delayTimer;
            break;
          case 0x15:
            this.delayTimer = this._registers[X];
            break;
          case 0x18:
            this.soundTimer = this._registers[X];
            break;

          case 0x1e:
            this.indexReg += this._registers[X];
            break;

          case 0x0a:
            const pressedKeyIndex = this.keypad.findIndex((key) => key === 1);
            const pressedKey = this.keypad[pressedKeyIndex];

            if (!pressedKey) this.pc -= 2;
            else this._registers[X] = pressedKeyIndex;

            break;

          case 0x29:
            this.indexReg = this._registers[X] * 5;
            break;

          case 0x33:
            let targetNumber = this._registers[X];
            const bcdNumber = Array(3).fill(0);

            let i = 2;
            while (targetNumber > 0) {
              bcdNumber[i] = targetNumber % 10;
              targetNumber = Math.floor(targetNumber / 10)
              i--;
            }
            this._memory[this.indexReg] = bcdNumber[0];
            this._memory[this.indexReg + 1] = bcdNumber[1];
            this._memory[this.indexReg + 2] = bcdNumber[2];

            break;

          case 0x55:
            if (X === 0) this._memory[this.indexReg] = this._registers[X];
            else {
              for (let i = 0; i <= X; i++) {
                this._memory[this.indexReg + i] = this._registers[i];
              }
            }
            break;

          case 0x65:
            if (X === 0) this._registers[X] = this._memory[this.indexReg];
            else {
              for (let i = 0; i <= X; i++) {
                this._registers[i] = this._memory[this.indexReg + i];
              }
            }
            break;
        }

        break;

      case 0xd000:
        let [xCord, yCord] = [this._registers[X], this._registers[Y]];
        if (xCord > 64) xCord = xCord - 64;
        if (yCord > 32) yCord = yCord - 32;
        console.log(`Draw at (${xCord}, ${yCord})`);

        this._registers[0xf] = 0;
        for (let i = 0; i < N; i++) {
          let cy = yCord + i;
          for (let j = 0; j < 8; j++) {
            let cx = xCord + j;
            const pixel = this._memory[this.indexReg + i];
            if (getNthBit(pixel, 7 - j) !== 0) {
              if (this._display[64 * cy + cx] === 1) this._registers[0xf] = 1;

              this._display[64 * cy + cx] ^= 1;
            }
          }
        }

        this.drawFlag = true;
        break;

      default:
        console.error("Unhandled intruction " + opcode.toString(16));
        break;
    }
  }
}
