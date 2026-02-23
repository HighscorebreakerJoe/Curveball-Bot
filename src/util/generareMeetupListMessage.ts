import {hyperlink, time, TimestampStyles} from "discord.js";
import {db} from "../database/Database";
import env from "../env";
import {tMeetup} from "../i18n";

/**
 * Generates message listing all currently available meetups from now on
 */
export async function generateMeetupListMessage(): Promise<string> {
    const now = new Date();

    const allUpcomingMeetups = await db
        .selectFrom("meetup")
        .selectAll()
        .where("time", ">=", now)
        .orderBy("time", "asc")
        .execute();

    const lines: string[] = [];

    let currentDateHeader: string|null = null;

    for(const meetup of allUpcomingMeetups){
        const meetupDate = new Date(meetup.time);
        const dateHeader: string = meetupDate.toLocaleDateString("de-DE");

        if(dateHeader !== currentDateHeader){
            currentDateHeader = dateHeader;
            lines.push(`# 📅 ${currentDateHeader} \n`);
        }

        const messageID: string = meetup.messageID as string;
        const threadID: string = meetup.threadID as string;

        const messageLink = `https://discord.com/channels/${env.GUILD_ID}/${env.MEETUP_INFO_CHANNEL_ID}/${messageID}`;
        const threadLink = `https://discord.com/channels/${env.GUILD_ID}/${threadID}`;

        lines.push("## Meetup " + meetup.meetupID);
        lines.push(`👾 ${meetup.pokemon}`);
        lines.push(`📍 ${meetup.location}`);
        lines.push("🕑 " + time(meetupDate, TimestampStyles.ShortTime));
        lines.push("⏳ " + time(meetupDate, TimestampStyles.RelativeTime));
        lines.push("➡️ " + hyperlink(tMeetup("list.toMeetup"), messageLink));
        lines.push("🗨️ " + hyperlink(tMeetup("list.toDiscussion", {meetupID: meetup.meetupID}), threadLink));
    }

    return lines.join("\n");
}