import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    GuildMember,
    ModalSubmitInteraction,
} from "discord.js";
import { getGuild } from "../cache/guild";
import { MeetupRow } from "../database/table/Meetup";
import env from "../env";
import { tPermission } from "../i18n";

/**
 * Checks if user is creator of given meetup or has meetup config role
 */

export async function assertUserIsMeetupCreatorOrConfig(
    interaction: ModalSubmitInteraction | ChatInputCommandInteraction | ButtonInteraction,
    meetup: MeetupRow,
    deleteMessage: boolean,
): Promise<void> {
    const userID: string = interaction.user.id;

    let member;
    if (interaction.inGuild()) {
        member = interaction.member as GuildMember;
    } else {
        member = (await getGuild().members.fetch(userID)) as GuildMember;
    }

    if (!member) {
        throw new Error(tPermission("error.memberNotFound"));
    }

    if (meetup.userID !== userID && !member.roles.cache.has(env.MEETUP_CONFIGURATOR_ROLE_ID)) {
        throw new Error(
            deleteMessage
                ? tPermission("error.meetupCantDelete")
                : tPermission("error.meetupCantEdit"),
        );
    }
}
