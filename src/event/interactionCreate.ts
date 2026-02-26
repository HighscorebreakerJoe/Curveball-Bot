import {
    ButtonInteraction,
    ChatInputCommandInteraction,
    Client,
    Events,
    Interaction,
    MessageFlags,
    ModalSubmitInteraction,
} from "discord.js";
import { AbstractButton } from "../button/AbstractButton";
import { dynamicIdRegExp } from "../constant/dynamicIdRegExp";
import { tSetup } from "../i18n";
import { buttonsMap } from "../map/buttonsMap";
import { commandsMap } from "../map/commandsMap";
import { modalSubmitsMap } from "../map/modalSubmitsMap";
import { AbstractModalSubmit } from "../modal/submit/AbstractModalSubmit";

export default function onInteractionCreate(client: Client): void {
    client.on(Events.InteractionCreate, async (interaction: Interaction): Promise<void> => {
        try {
            if (interaction.isChatInputCommand()) {
                await handleCommand(interaction);
            } else if (interaction.isModalSubmit()) {
                await handleModalSubmit(interaction);
            } else if (interaction.isButton()) {
                await handleButton(interaction);
            }
        } catch (error) {
            console.error(error);
            if (interaction.isRepliable()) {
                await interaction.reply({
                    content: tSetup("error.interactionGeneral"),
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    });
}

async function handleCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const command = commandsMap.get(interaction.commandName);

    if (!command) {
        return;
    }

    try {
        const commandInstance = new command();
        await commandInstance.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.isRepliable()) {
            await interaction.reply({
                content: tSetup("error.interactionCommand"),
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}

async function handleModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
    let customId: string = interaction.customId;

    if (dynamicIdRegExp.test(customId)) {
        customId = customId.replace(dynamicIdRegExp, "$1:{d}");
    }

    const ModalSubmit: { new (): AbstractModalSubmit } | undefined = modalSubmitsMap.get(customId);
    if (!ModalSubmit) {
        return;
    }

    try {
        const modal = new ModalSubmit();
        await modal.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.isRepliable()) {
            await interaction.reply({
                content: tSetup("error.interactionModal"),
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}

async function handleButton(interaction: ButtonInteraction): Promise<void> {
    let customId: string = interaction.customId;

    if (dynamicIdRegExp.test(customId)) {
        customId = customId.replace(dynamicIdRegExp, "$1:{d}");
    }

    const Button: { new (): AbstractButton } | undefined = buttonsMap.get(customId);

    if (!Button) {
        return;
    }

    try {
        const button = new Button();
        await button.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.isRepliable()) {
            await interaction.reply({
                content: tSetup("error.interactionButton"),
                flags: MessageFlags.Ephemeral,
            });
        }
    }
}
