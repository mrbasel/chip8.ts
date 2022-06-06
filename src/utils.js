export function getNthBit(number, n) {
    return (number & (1 << n)) >> n;
}