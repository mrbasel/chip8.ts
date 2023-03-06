import { Display } from "./display";
import { Keypad } from "./keypad";
import { CpuInfo } from "./cpu-info";
import { Chip8 } from "../../core/chip8";
import { useState } from 'preact/hooks';

const keys = [
    '1', '2', '3', '4',
    'Q', 'W', 'E', 'R',
    'A', 'S', 'D', 'F',
    'Z', 'X', 'C', 'V'
]

const gameLoop = (emulator: Chip8, func?: any) => {
    emulator.emulateCycle();

    if (func) func();

    if (emulator.drawFlag) {
        // drawDisplay(emulator.display);
    }

    setTimeout(() => {
        gameLoop(emulator, func);
    }, 5)
}

function readFile(fileInput: HTMLInputElement, callback: (view: Uint8Array) => void) {
    const file = fileInput?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
        const view = new Uint8Array(reader.result);
        callback(view)
    }
}

const emulator = new Chip8();

export function App() {
    const [emulatorState, setEmulatorState] = useState({
        registers: Array.from(emulator.registers),
        display: emulator.display,
        keypad: Array.from(emulator.keypad),
        pc: emulator.pc,
        i: emulator.indexReg,
        drawFlag: emulator.drawFlag
    });

    const handleRun = () => {
        const fileInput = document.querySelector('input');
        readFile(fileInput, (view: Uint8Array) => {
            emulator.loadProgram(view);

            document.addEventListener('keydown', (e) => {
                emulator.keypad[keys.indexOf(e.key.toUpperCase())] = 1;
            })

            document.addEventListener('keyup', (e) => {
                emulator.keypad[keys.indexOf(e.key.toUpperCase())] = 0;
            })

            const keypad = document.querySelector('#keypad')
            keypad?.childNodes.forEach((button) => {
                button.addEventListener('click', () => {
                    const key = parseInt(button.textContent as string, 16);
                    emulator.keypad[key] = 1;

                    // Temporary hack :/
                    setTimeout(() => emulator.keypad.fill(0), 200);
                })
            })

            gameLoop(emulator, () => {
                setEmulatorState({
                    registers: Array.from(emulator.registers),
                    display: emulator.display,
                    keypad: Array.from(emulator.keypad),
                    pc: emulator.pc,
                    i: emulator.indexReg,
                    drawFlag: emulator.drawFlag 
                });

            })
        })

    };


    return (
        <>
            <header>
                <h1>Chip-8 emulator!</h1>
                <label for="rom">Upload rom</label>
                <input id="rom" type="file" />
                <button onClick={handleRun}>Run</button>
            </header>
            <main>
                <section>
                    <Display shouldDraw={emulatorState.drawFlag} display={emulatorState.display} />
                    <Keypad />
                </section>
                <section>
                    <CpuInfo pc={emulatorState.pc} indexReg={emulatorState.i} registers={emulatorState.registers} />
                </section>
            </main>
        </>
    )
}
