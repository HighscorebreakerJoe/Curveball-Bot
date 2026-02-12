/**
 * Checks if input contains any links
 */
export function checkForLinks(input: string): boolean {
    // search for http(s) or www.
    const urlRegex = /(https?:\/\/\S+|www\.\S+)/i;

    return urlRegex.test(input);
}