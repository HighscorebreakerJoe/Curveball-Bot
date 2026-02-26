import { ThreadChannel } from "discord.js";
import { getMeetupInfoChannel } from "../cache/meetupChannels";

export async function getAllAvailableMeetupInfoThreads(): Promise<ThreadChannel[]> {
    const infoChannel = getMeetupInfoChannel();

    const active = await infoChannel.threads.fetchActive();
    const archived = await infoChannel.threads.fetchArchived({ fetchAll: true });

    return [...active.threads.values(), ...archived.threads.values()];
}
