import { EmbedBuilder } from "discord.js";
import {
    getMeetupCreateChannel,
    getMeetupInfoChannel,
    getMeetupListChannel,
} from "../../cache/meetupChannels";
import { tMeetup } from "../../i18n";
import { noticeTypeMap } from "../../map/noticeTypeMap";
import { prepareEmbedMessage } from "../postEmbeds";

/**
 * Posts default meetup create notices
 */
export async function postMeetupCreateNotices(): Promise<void> {
    const embeds: EmbedBuilder[] = [];
    embeds.push(
        prepareEmbedMessage(
            tMeetup("tutorial.description", {
                meetupListChannelID: getMeetupListChannel().id,
                meetupInfoChannelID: getMeetupInfoChannel().id,
            }),
            tMeetup("tutorial.title"),
            noticeTypeMap.get("tutorial")!,
        ),
    );

    await getMeetupCreateChannel().send({
        embeds: embeds,
    });
}
