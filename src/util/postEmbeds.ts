import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction,
} from "discord.js";
import { tCommon } from "../i18n";

/**
 * Posts success message to user
 */
export async function postSuccess(
    interaction: ChatInputCommandInteraction | ModalSubmitInteraction | ButtonInteraction,
    message: string,
): Promise<void> {
    return await postEmbedMessage(
        interaction,
        message,
        tCommon("successDefaultEmbedTitle"),
        0x00ff00,
    );
}

/**
 * Posts error message to user
 */
export async function postError(
    interaction: ChatInputCommandInteraction | ModalSubmitInteraction | ButtonInteraction,
    message: string,
): Promise<void> {
    return await postEmbedMessage(
        interaction,
        message,
        tCommon("errorDefaultEmbedTitle"),
        0xff0000,
    );
}

/**
 * prepares embedded message without sending it
 */
export function prepareEmbedMessage(
    message: string,
    title: string,
    color: ColorResolvable | null,
): EmbedBuilder {
    return new EmbedBuilder().setTitle(title).setDescription(message).setColor(color);
}

/**
 * Posts embedded message to user
 */
export async function postEmbedMessage(
    interaction: ChatInputCommandInteraction | ModalSubmitInteraction | ButtonInteraction,
    message: string,
    title: string,
    color: ColorResolvable | null,
): Promise<void> {
    const embed = prepareEmbedMessage(message, title, color);

    if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
            embeds: [embed],
        });
    } else {
        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral,
        });
    }
}
