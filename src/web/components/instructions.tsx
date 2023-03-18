import { useMemo, useState } from "preact/hooks";

interface InstructionsProps {
  pc: number;
  memory: number[];
}

export function Instructions({ pc = 0x200, memory }: InstructionsProps) {
  const opcodes = useMemo(() => {
    const opcodes: { address: number; opcode: number }[] = [];

    let count = 0;
    let currentPc = pc - 4;
    while (count < 5) {
      const opcode = (memory[pc] << 8) | memory[pc + 1];
      opcodes.push({
        address: currentPc,
        opcode,
      });
      count++;
      currentPc += 2;
    }

    return opcodes;
  }, [pc, memory]);

  return (
    <table>
      <thead>
        <tr>
          <th>Address</th>
          <th>Instruction</th>
        </tr>
      </thead>
      <tbody>
        {opcodes.map(({ address, opcode }, i) => (
          <tr className={address === pc ? 'pc' : ''}>
            <td>0x{address?.toString(16) ?? 0}</td>
            <td>0x{opcode?.toString(16) ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
