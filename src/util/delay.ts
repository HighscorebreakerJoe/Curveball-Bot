/**
 * Helper function for causing delay (useful to avoid spamming requests to Discord)
 */
export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
