import { EmbedBuilder } from "discord.js";
import { getMeetupInfoChannel, getMeetupListChannel } from "../cache/meetupChannels";
import { client } from "../client";
import { MeetupRow } from "../database/table/Meetup";
import { createParticipantListMessage } from "../util/meetup/createParticipantListMessage";
import { editMeetupInfoEmbed, ParticipantData } from "../util/meetup/editMeetupInfoEmbed";
import { generateMeetupListMessage } from "../util/meetup/generareMeetupListMessage";
import { sendChunkedMessages } from "../util/sendChunkedMessages";

/**
 * Manager for handling Discord UI updates (messages and threads).
 * Used for frequently updated or batched message rendering.
 */

class UIManager {

    /**
     * Resets meetup list and generates message listing all currently available meetups from now on
     */
    public async resetMeetupListChannel(): Promise<void> {
        //clear meetup list channel
        const messages = await getMeetupListChannel().messages.fetch({ limit: 100 });
        await getMeetupListChannel().bulkDelete(messages);

        //post new list
        const meetupListMessage: string = await generateMeetupListMessage();
        if (meetupListMessage.length > 0) {
            await sendChunkedMessages(meetupListMessage, getMeetupListChannel());
        }
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