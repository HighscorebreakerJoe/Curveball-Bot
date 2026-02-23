import {TextChannel} from "discord.js";
import {client} from "../client";
import env from "../env";
import {tSetup} from "../i18n";

const meetupChannels = new Map<string, TextChannel>();

export async function loadMeetupChannels() {
    const meetupInfoChannel = await client.channels.fetch(env.MEETUP_INFO_CHANNEL_ID) as TextChannel;

    if (!meetupInfoChannel || !meetupInfoChannel.isTextBased()) {
        throw new Error(tSetup("error.invalidInfoChannel"));
    }

    const meetupListChannel = await client.channels.fetch(env.MEETUP_LIST_CHANNEL_ID) as TextChannel;

    if (!meetupListChannel || !meetupListChannel.isTextBased()) {
        throw new Error(tSetup("error.invalidListChannel"));
    }

    meetupChannels.set("info", meetupInfoChannel);
    meetupChannels.set("list", meetupListChannel);

    console.log(tSetup("step.setupMeetupChannelCache"));
}

export function getMeetupInfoChannel(): TextChannel {
    return meetupChannels.get("info") as TextChannel;
}

export function getMeetupListChannel(): TextChannel {
    return meetupChannels.get("list") as TextChannel;
}