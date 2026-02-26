import {
    ActionRowBuilder,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import { db } from "../database/Database";
import { MeetupAllowedMentionsRoleRow } from "../database/table/MeetupAllowedMentionsRole";
import { tModal } from "../i18n";
import { AbstractModal } from "./AbstractModal";

/**
 * Displays Create Meetup Modal
 */

export class MeetupCreateModal extends AbstractModal {
    customId: string = "meetup_create";

    protected get modalTitle(): string {
        return tModal("meetupCreate.title");
    }

    private allowedCommands: string[] = ["meetup", "poll"];

    protected async checkPermissions(
        interaction: ChatInputCommandInteraction | ButtonInteraction,
    ): Promise<void> {
        //check interaction type
        if (!interaction.isCommand()) {
            throw new Error(tModal("global.error.invalidInteractionType"));
        }

        if (!this.allowedCommands.includes(interaction.commandName)) {
            const interactionName: string = (interaction as ChatInputCommandInteraction)
                .commandName;
            throw new Error(
                tModal("global.error.invalidCommand", { commandName: interactionName }),
            );
        }

        //check option roles
        const options = interaction.options;
        const roleIds: string[] = [];

        const role1 = options.getRole("role1");
        if (role1 && role1.id) {
            await this.checkRole(role1.id);
            roleIds.push(role1.id);
        }

        const role2 = options.getRole("role2");
        if (role2 && role2.id) {
            await this.checkRole(role2.id);
            roleIds.push(role2.id);
        }

        const role3 = options.getRole("role3");
        if (role3 && role3.id) {
            await this.checkRole(role3.id);
            roleIds.push(role3.id);
        }

        this.setAdditionalData({
            roleIds: roleIds,
        });
    }

    protected setSubmitCustomId() {
        const roleIdString = this.additionalData.roleIds.join(",");

        this.submitCustomId = "meetup_create:" + roleIdString;
    }

    protected buildModal(): ModalBuilder {
        const modal: ModalBuilder = new ModalBuilder()
            .setCustomId(this.submitCustomId)
            .setTitle(this.modalTitle);

        const { pokemon, location, time, date, note } = this.buildInputs();

        const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(pokemon);
        const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(location);
        const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(time);
        const row4 = new ActionRowBuilder<TextInputBuilder>().addComponents(date);
        const row5 = new ActionRowBuilder<TextInputBuilder>().addComponents(note);

        // Add inputs to the modal
        modal.addComponents(row1, row2, row3, row4, row5);

        return modal;
    }

    protected buildInputs() {
        const pokemon: TextInputBuilder = new TextInputBuilder()
            .setCustomId("pokemon")
            .setLabel(tModal("meetupCreate.field.pokemon"))
            .setPlaceholder(tModal("meetupCreate.field.pokemonPlaceholder"))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const location: TextInputBuilder = new TextInputBuilder()
            .setCustomId("location")
            .setLabel(tModal("meetupCreate.field.location"))
            .setPlaceholder(tModal("meetupCreate.field.locationPlaceholder"))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const time: TextInputBuilder = new TextInputBuilder()
            .setCustomId("time")
            .setLabel(tModal("meetupCreate.field.time"))
            .setPlaceholder(tModal("meetupCreate.field.timePlaceholder"))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const nowDate = new Date();
        const day: string = String(nowDate.getDate()).padStart(2, "0");
        const month: string = String(nowDate.getMonth() + 1).padStart(2, "0");
        const dateValue: string = `${day}.${month}`;

        const date: TextInputBuilder = new TextInputBuilder()
            .setCustomId("date")
            .setLabel(tModal("meetupCreate.field.date"))
            .setPlaceholder(tModal("meetupCreate.field.datePlaceholder"))
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(dateValue);

        const note: TextInputBuilder = new TextInputBuilder()
            .setCustomId("note")
            .setLabel(tModal("meetupCreate.field.note"))
            .setPlaceholder(tModal("meetupCreate.field.notePlaceholder"))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        return {
            pokemon: pokemon,
            location: location,
            time: time,
            date: date,
            note: note,
        };
    }

    private async checkRole(roleId: string): Promise<void> {
        const role = (await db
            .selectFrom("meetup_allowed_mentions_role")
            .selectAll()
            .where("roleID", "=", roleId)
            .executeTakeFirst()) as MeetupAllowedMentionsRoleRow | undefined;

        if (!role) {
            throw new Error(tModal("meetupCreate.error.invalidRole", { roleID: roleId }));
        }
    }
}
