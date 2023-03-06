import { DisplayDevice } from "../core/io";

const onColor = "rgb(255, 255, 255)";
const offColor = "rgb(0, 0, 0)";

export class Chip8CanvasDisplay extends DisplayDevice {
    display = new Uint8Array(64 * 32);
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
    }

    clear(): void {
        this.display.fill(0);
    }
    getPixel(xCord: number, yCord: number): number {
        return this.display[64 * yCord + xCord];
    }
    drawPixel(xCord: number, yCord: number, pixel: number): void {
        this.display[64 * yCord + xCord] = pixel;
        console.log(this.display);

        this.drawCanvas();
    }

    drawCanvas() {
        const ctx = this.canvas?.getContext("2d");

        if (!ctx) throw new Error("No canvas element");

        for (let j = 0; j < 31; j++) {
            for (let i = 0; i < 64; i++) {
                const currentPixel = this.display[64 * j + i];
                if (currentPixel === 1) {
                    ctx.fillStyle = onColor;
                } else {
                    ctx.fillStyle = offColor;
                }

                ctx.fillRect(i * 10, j * 10, 10, 10);
            }
        }

    }
};
