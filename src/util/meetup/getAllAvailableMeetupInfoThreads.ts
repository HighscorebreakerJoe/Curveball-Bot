import { FetchedThreads, FetchedThreadsMore, TextChannel, ThreadChannel } from "discord.js";
import { getMeetupInfoChannel } from "../../cache/meetupChannels";

export async function getAllAvailableMeetupInfoThreads(): Promise<ThreadChannel[]> {
    const infoChannel: TextChannel = getMeetupInfoChannel();

    const active: FetchedThreads = await infoChannel.threads.fetchActive();
    const archived: FetchedThreadsMore = await infoChannel.threads.fetchArchived({
        fetchAll: true,
    });

    return [...active.threads.values(), ...archived.threads.values()];
}
