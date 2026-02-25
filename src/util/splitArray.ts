/**
 * Splits array into chunks
 * Shoutouts to: https://stackoverflow.com/a/8495740
 */
export function splitArray<T>(array: T[], size = 100): T[][] {
    const chunks: T[][] = [];

    if(size == 0){
        return chunks;
    }

    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }

    return chunks;
}