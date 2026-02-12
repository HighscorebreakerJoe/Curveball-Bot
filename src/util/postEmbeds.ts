import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    MessageFlags,
    ModalSubmitInteraction
} from "discord.js";

/**
 * Posts success message to user
 */
export async function postSuccess(interaction: ChatInputCommandInteraction|ModalSubmitInteraction|ButtonInteraction, message: string): Promise<void> {
    return await postEmbedMessage(interaction, message, "Hurra!", 0x00ff00);
}

/**
 * Posts error message to user
 */
export async function postError(interaction: ChatInputCommandInteraction|ModalSubmitInteraction|ButtonInteraction, message: string): Promise<void> {
    return await postEmbedMessage(interaction, message, "Fehler...", 0xff0000);
}

/**
 * Posts embedded message to user
 */
export async function postEmbedMessage(interaction: ChatInputCommandInteraction|ModalSubmitInteraction|ButtonInteraction, message: string, title: string, color: ColorResolvable | null): Promise<void>{
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(message)
        .setColor(color);

    if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
            embeds: [embed]
        });
    } else {
        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
}