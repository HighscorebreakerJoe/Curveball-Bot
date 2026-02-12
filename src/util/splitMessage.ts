/**
 * Splits message into chunk to avoid posting too big messages
 */
export function splitMessage(message: string, maxLength = 2000): string[] {
    const chunks: string[] = [];
    let current = "";

    for (const line of message.split("\n")) {
        if ((current + line + "\n").length > maxLength) {
            chunks.push(current);
            current = "";
        }
        current += line + "\n";
    }

    if (current.length > 0) {
        chunks.push(current);
    }

    return chunks;
}