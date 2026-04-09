import { ButtonInteraction, Message, User } from "discord.js";
import { tButton, tCommon } from "../i18n";
import { prepareEmbedMessage } from "../util/postEmbeds";
import { AbstractButton } from "./AbstractButton";

/**
 * Class for handling "Meetup delete cancel" buttonpress in meetup delete embeds
 */

export class MeetupDeleteCancelButton extends AbstractButton {
    customId: string = "meetup_delete_cancel";
    protected context: Record<string, unknown> = {};

    protected async run(interaction: ButtonInteraction): Promise<void> {
        const message: Message = interaction.message;
        const user: User = interaction.user;
        await message.delete();

        await this.postCancelSuccess(user);
    }

    protected async postCancelSuccess(user: User) {
        const embed = prepareEmbedMessage(tButton("meetupDeleteCancel.success"), tCommon("successDefaultEmbedTitle"), 0x00ff00);
        
        await user.send({
            embeds: [embed],
            components: [],
        });
    }
}
