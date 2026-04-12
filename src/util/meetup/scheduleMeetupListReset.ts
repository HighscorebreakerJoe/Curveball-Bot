import { resetMeetupListChannel } from "./resetMeetupListChannel";

/**
 * Schedules a debounced and queued reset of the meetup list channel.
 * Ensures that multiple rapid updates are merged and processed sequentially.
 */

let queue: Promise<void> = Promise.resolve();
let timeout: NodeJS.Timeout | null = null;

export function scheduleMeetupListReset() {
    if (timeout) {
        clearTimeout(timeout);
    }

    timeout = setTimeout(enqueueMeetupListReset, 1500);
}

function enqueueMeetupListReset() {
    queue = queue
        .then(resetMeetupListChannel)
        .catch(console.error);
}
