export function getPositiveNumberFromString(value: string | undefined, fallback = 1): number {
    const parsed: number = Number(value);
    if (Number.isNaN(parsed)) {
        return fallback;
    }

    const abs: number = Math.abs(parsed);
    return abs === 0 ? fallback : abs;
}
