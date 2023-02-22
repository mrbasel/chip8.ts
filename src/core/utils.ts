export function getNthBit(number: number, n: number) {
    return (number & (1 << n)) >> n;
}
