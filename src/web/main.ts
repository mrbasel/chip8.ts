import { Chip8 } from "../core/chip8.js";

const keys = [
    '1', '2', '3', '4',
    'Q', 'W', 'E', 'R',
    'A', 'S', 'D', 'F',
    'Z', 'X', 'C', 'V'
]

const fileInput = document.querySelector('input');
const onColor = "rgb(255, 255, 255)";
const offColor = "rgb(0, 0, 0)";
const canvas = document.querySelector<HTMLCanvasElement>("canvas");

function drawDisplay(pixels: Uint8Array) {
    const ctx = canvas?.getContext("2d");

    if (!ctx) throw new Error("No canvas element");

    for (let j = 0; j < 31; j++) {
        for (let i = 0; i < 64; i++) {
            const currentPixel = pixels[64 * j + i];
            if (currentPixel === 1) {
                ctx.fillStyle = onColor;
            } else {
                ctx.fillStyle = offColor;
            }

            ctx.fillRect(i * 10, j * 10, 10, 10);
        }
    }
}

const gameLoop = (emulator: Chip8) => {
    emulator.emulateCycle();

    if (emulator.drawFlag) {
        drawDisplay(emulator.display);
    }

    const cpuInfo = document.querySelector('cpu-info');
    cpuInfo?.setAttribute('pc', emulator.pc.toString(16));
    cpuInfo?.setAttribute('I', emulator.indexReg.toString(16));
    
    // TODO: Fix type error  
    cpuInfo.registers = Array.from(emulator.registers);

    cpuInfo.stack = emulator.stack;

    setTimeout(() => {
        gameLoop(emulator);
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

document.querySelector('button')?.addEventListener('click', () => {
    readFile(fileInput, (view: Uint8Array) => {
        const emulator = new Chip8(view);

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

        gameLoop(emulator)
    })
});
