import { ButtonInteraction } from "discord.js";
import { ParticipantData } from "./editMeetupInfoEmbed";
import { createParticipantListMessage } from "./createParticipantListMessage";

/**
 * Updates participant list message
 */

export async function updateParticipantList(
    interaction: ButtonInteraction,
    participantData: ParticipantData[],
    participantListMessageID: string,
): Promise<void> {
    const participantListMessage =
        await interaction.message.thread?.messages.fetch(participantListMessageID);

    if (participantListMessage) {
        await participantListMessage.edit({
            content: createParticipantListMessage(participantData),
        });
    }
}