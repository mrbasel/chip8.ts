import { InputDevice } from "../core/io";

const keys = [
    '1', '2', '3', '4',
    'Q', 'W', 'E', 'R',
    'A', 'S', 'D', 'F',
    'Z', 'X', 'C', 'V'
]

export class KeyboardInput extends InputDevice {
    keypad = new Uint8Array(16);

    constructor() {
        super();

        setInterval(() => {
            console.log(this.keypad);
        }, 1000);

        window.addEventListener('keydown', (e) => {
            const keyIndex = keys.findIndex((k) => e.key.toUpperCase() === k);
            if (keyIndex !== -1) this.keypad[keyIndex] = 1;
        });
    }

    getIsPressed(key: number): boolean {
        const isPressed = this.keypad[key] === 1;
        // this.keypad.fill(0);
        return isPressed;
    }
    getPressedKey(): number | null {
        const key = this.keypad.findIndex((key) => key === 1);
        if (key === -1) return null;
        return key;
    }
};
