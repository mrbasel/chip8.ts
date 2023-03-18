interface CpuInfoProps {
    registers: number[];
    pc: number;
    indexReg: number;
}

export function CpuInfo({ registers, pc, indexReg }: CpuInfoProps) {
    return (
        <table>
            <tbody>
                <tr>
                    <td>PC</td>
                    <td colSpan={4}>0x{pc.toString(16)}</td>
                </tr>

                <tr>
                    <td>I</td>
                    <td colSpan={4}>0x{indexReg.toString(16)}</td>
                </tr>

                <tr>
                    <td className={'title'} colSpan={4}>Registers</td>
                </tr>
                {mapRegisters(registers).map((v, i) => (
                    <tr key={i}>
                        <td>V{(i * 2).toString(16).toUpperCase()}</td>
                        <td>0x{v[0].toString(16).toUpperCase()}</td>
                        <td>V{(i * 2 + 1).toString(16).toUpperCase()}</td>
                        <td>0x{v[1].toString(16).toUpperCase()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const mapRegisters = (registers: number[]) => {
    return registers.reduce((acc, v, i) => {
        if (i % 2 === 0) {
            acc.push([v]);
        } else {
            acc[acc.length - 1].push(v);
        }
        return acc;
    }, [] as number[][]);

}


