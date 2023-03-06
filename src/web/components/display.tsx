import { useMemo, useRef } from "preact/hooks";

interface DisplayProps {
    display: Uint8Array;
    shouldDraw: boolean;
}

const onColor = "rgb(255, 255, 255)";
const offColor = "rgb(0, 0, 0)";

function drawDisplay(pixels: Uint8Array, canvasCtx: CanvasRenderingContext2D) {
    for (let j = 0; j < 31; j++) {
        for (let i = 0; i < 64; i++) {
            const currentPixel = pixels[64 * j + i];
            if (currentPixel === 1) {
                canvasCtx.fillStyle = onColor;
            } else {
                canvasCtx.fillStyle = offColor;
            }

            canvasCtx.fillRect(i * 10, j * 10, 10, 10);
        }
    }
}

export function Display({ display, shouldDraw }: DisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>();

    useMemo(() => {
        if (canvasRef.current && shouldDraw) {
            const canvasCtx = canvasRef.current.getContext("2d");
            drawDisplay(display, canvasCtx);
        }
    }, [shouldDraw, display]);


    return (
        <>
            <canvas ref={canvasRef} class="canvas box" width="640" height="310"></canvas>
        </>
    )
}
