export abstract class InputDevice {
    abstract getIsPressed(key: number): boolean;
    abstract getPressedKey(): number | null;
};

export abstract class DisplayDevice {
  abstract clear(): void;
  abstract getPixel(xCord: number, yCord: number): number;
  abstract drawPixel(xCord: number, yCord: number, pixel: number): void
};
