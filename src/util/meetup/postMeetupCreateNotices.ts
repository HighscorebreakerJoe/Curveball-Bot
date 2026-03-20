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
            tMeetup("defaultNotice.tutorial.description", {
                meetupListChannelID: getMeetupListChannel().id,
                meetupInfoChannelID: getMeetupInfoChannel().id,
            }),
            tMeetup("defaultNotice.tutorial.title"),
            noticeTypeMap.get("tutorial")!,
        ),
        prepareEmbedMessage(
            tMeetup("defaultNotice.cleanup.description"),
            tMeetup("defaultNotice.cleanup.title"),
            noticeTypeMap.get("hint")!,
        ),
    );

    for (const embed of embeds) {
        await getMeetupCreateChannel().send({
            embeds: [embed],
        });
    }
}
