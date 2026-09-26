import { logger } from "../../logger";
import { tSetup } from "../../i18n";

/**
 * Creates a keyed debounce and queue scheduler for async tasks.
 * Tasks with the same key are debounced and executed sequentially,
 * preventing concurrent execution and merging rapid updates.
 */

type AsyncTask = () => Promise<void>;

export function createKeyedDebouncedQueue(delay = 1500) {
    const queues = new Map<string, Promise<void>>();
    const timeouts = new Map<string, NodeJS.Timeout>();
    const pendingTasks = new Map<string, AsyncTask>();

    function schedule(key: string, task: AsyncTask): void {
        //set pending task
        pendingTasks.set(key, task);

        //clear existing timeout if available
        const existingTimeout = timeouts.get(key);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        //set timeout
        const timeout = setTimeout((): void => enqueueTask(key), delay);
        timeouts.set(key, timeout);
    }

    function enqueueTask(key: string): void {
        //get relevant pending task - the function which needs to be executed
        const taskToRun = pendingTasks.get(key);
        if (!taskToRun) {
            return;
        }

        pendingTasks.delete(key);
        timeouts.delete(key);

        const currentQueue: Promise<void> = queues.get(key) || Promise.resolve();

        const newQueue: Promise<void> = currentQueue
            .then(taskToRun) //run function
            .catch((error: unknown): void => {
                logger.error({ err: error }, tSetup("error.keyedDebouncedQueue"));
            });

        queues.set(key, newQueue);

        newQueue.finally((): void => {
            if (!pendingTasks.has(key)) {
                queues.delete(key);
            }
        });
    }

    return { schedule };
}
