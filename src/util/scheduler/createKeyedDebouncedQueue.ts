/**
 * Creates a keyed debounce + queue scheduler for async tasks.
 * Tasks with the same key are debounced and executed sequentially,
 * preventing concurrent execution and merging rapid updates.
 */

type AsyncTask = () => Promise<void>;

export function createKeyedDebouncedQueue(delay = 1500) {
    const queues = new Map<string, Promise<void>>();
    const timeouts = new Map<string, NodeJS.Timeout>();
    const pendingTasks = new Map<string, AsyncTask>();

    function schedule(key: string, task: AsyncTask) {
        //set pending task
        pendingTasks.set(key, task);

        //clear existing timout if available
        const existingTimeout = timeouts.get(key);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        //set timeout
        const timeout = setTimeout(() => enqueueTask(key), delay);
        timeouts.set(key, timeout);
    }

    function enqueueTask(key: string) {
        //get relevant pending task - the function which needs to be executed
        const taskToRun = pendingTasks.get(key);
        if (!taskToRun){
            return;
        }

        pendingTasks.delete(key);
        timeouts.delete(key);
        
        const currentQueue = queues.get(key) || Promise.resolve();

        const newQueue = currentQueue
            .then(taskToRun) //run function
            .catch(console.error);

        queues.set(key, newQueue);

        newQueue.finally(() => {
            if (!pendingTasks.has(key)) {
                queues.delete(key);
            }
        });
    }

    return { schedule };
}