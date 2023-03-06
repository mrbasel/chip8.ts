import { beforeEach, describe, expect, it } from 'vitest'
import { Chip8 } from '../src/core/chip8';

describe('Logical and arithmetic instructions', () => {
  let chip8 = new Chip8();

  beforeEach(() => {
    chip8 = new Chip8();
  });

  it('6XNN set instruction', () => {
    chip8.writeMemory(0x200, 0x61);
    chip8.writeMemory(0x201, 0x05);
    chip8.emulateCycle();
    expect(chip8.registers[0x1]).toBe(0x05);
  })

  it('7XNN add instruction', () => {
    chip8.writeMemory(0x200, 0x71);
    chip8.writeMemory(0x201, 0x10);
    chip8.emulateCycle();
    expect(chip8.registers[0x1]).toBe(0x10);
  })
})
