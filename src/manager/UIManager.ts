import { EmbedBuilder } from "discord.js";
import { getMeetupInfoChannel } from "../cache/meetupChannels";
import { client } from "../client";
import { MeetupRow } from "../database/table/Meetup";
import { createParticipantListMessage } from "../util/meetup/createParticipantListMessage";
import { editMeetupInfoEmbed, ParticipantData } from "../util/meetup/editMeetupInfoEmbed";
import { resetMeetupListChannel } from "../util/meetup/resetMeetupListChannel";

/**
 * Manager for handling Discord UI updates (messages and threads).
 * Used for frequently updated or batched message rendering.
 */

class UIManager {

    /**
     * Resets meetup list
     */
    public async resetMeetupListChannel(): Promise<void> {
        await resetMeetupListChannel();
    }

    /**
     * Updates info embed of a specific meetup
     */
    public async updateMeetupInfoEmbed(
        meetup: MeetupRow,
        participantData: ParticipantData[]
    ): Promise<void> {
        if(!meetup.messageID) {
            return;
        }

        const message = await getMeetupInfoChannel().messages.fetch(meetup.messageID);

        if (!message) { 
            return;
        }

        const embed: EmbedBuilder = EmbedBuilder.from(message.embeds[0]);

        const newEmbed: EmbedBuilder = editMeetupInfoEmbed(embed, {
            participants: participantData,
        });

        await message.edit({
            embeds: [newEmbed],
        });
    }

    /**
     * Updates participant list of a specific meetup
     */
    public async updateParticipantList(
        meetup: MeetupRow,
        participantData: ParticipantData[]
    ): Promise<void> {
        if(!meetup.threadID || !meetup.participantListMessageID) {
            return;
        }

        const thread = await client.channels.fetch(meetup.threadID);
        if (!thread || !thread.isThread()) {
            return;
        }

        const message = await thread.messages.fetch(meetup.participantListMessageID);
        if (!message) { 
            return;
        }

        await message.edit({
            content: createParticipantListMessage(participantData),
        });
    }
}

export const uiManager = new UIManager();