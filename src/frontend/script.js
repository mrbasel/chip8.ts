import { Chip8 } from "../chip8.js";

const fileInput = document.querySelector('input');
const onColor = "rgb(255, 255, 255)";
const offColor = "rgb(0, 0, 0)";

function drawDisplay(pixels) {
    const canvas = document.querySelector(".canvas");
    const ctx = canvas.getContext("2d");

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

const gameLoop = (emulator) => {
    emulator.emulateCycle();

    if (emulator.drawFlag) {
        drawDisplay(emulator.display);
    }
    window.requestAnimationFrame(() => gameLoop(emulator));
}

function readFile(fileInput, callback) {
    const file = fileInput.files[0];

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
        const view = new Uint8Array(reader.result);
        callback(view)
    }
}


document.querySelector('button').addEventListener('click', () => {
    readFile(fileInput, (view) => {
        const emulator = new Chip8(view);

        window.requestAnimationFrame(() => gameLoop(emulator));
    })
})
