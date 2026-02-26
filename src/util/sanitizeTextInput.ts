/**
 * Sanitizes string to get rid of discord formatting options
 */
export function sanitizeTextInput(text: string): string {
    return text.replace(/[*_~`|>\[\]#]/g, "").trim();
}
