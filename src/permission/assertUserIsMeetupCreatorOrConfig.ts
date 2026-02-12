import {ButtonInteraction, ChatInputCommandInteraction, GuildMember, ModalSubmitInteraction} from "discord.js";
import {MeetupRow} from "../database/table/Meetup";
import env from "../env";

/**
 * Checks if user is creator of given meetup or has meetup config role
 */

export function assertUserIsMeetupCreatorOrConfig(interaction: ModalSubmitInteraction|ChatInputCommandInteraction|ButtonInteraction, meetup: MeetupRow, deleteMessage: boolean): void {
    const userID: string = interaction.user.id;
    const member = interaction.member as GuildMember;

    if (meetup.userID !== userID && !member.roles.cache.has(env.MEETUP_CONFIGURATOR_ROLE_ID)){
        throw new Error("Du hast nicht die notwendigen Rechte, diesen Meetup zu " + (deleteMessage ? "löschen" : "bearbeiten") + ".");
    }
}