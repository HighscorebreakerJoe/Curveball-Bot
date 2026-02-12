/**
 * Calculates if provided date occurs in the current or in the next year
 */
export function calculateYear(day: number, month: number): number {
    const now = new Date();

    //current date without time (set to midnight)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    //build input date with current year (set to midnight)
    const dateThisYear = new Date(now.getFullYear(), month - 1, day);

    let returnYear: number = now.getFullYear();

    if (dateThisYear < today) {
        //date with current year is in the past -> increase year
        return returnYear + 1;
    }

    return returnYear;
}