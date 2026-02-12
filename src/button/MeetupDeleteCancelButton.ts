/**
 * Class for handling "Meetup delete cancel" buttonpress in meetup delete embeds
 */
import {ButtonInteraction, Message} from "discord.js";
import {postSuccess} from "../util/postEmbeds";
import {AbstractButton} from "./AbstractButton";

export class MeetupDeleteCancelButton extends AbstractButton{
    customId: string = "meetup_delete_cancel";
    protected context: Record<string, unknown> = {};

    protected async run(interaction: ButtonInteraction): Promise<void> {
        const message: Message = interaction.message;
        await message.delete();

        await postSuccess(interaction, "Na gut, dann löschen wir deinen Meetup eben nicht...")
    }
}