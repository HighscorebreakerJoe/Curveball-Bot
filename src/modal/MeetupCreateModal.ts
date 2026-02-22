import {
    ActionRowBuilder,
    ButtonInteraction,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";
import i18next from "i18next";
import {db} from "../database/Database";
import {MeetupAllowedMentionsRoleRow} from "../database/table/MeetupAllowedMentionsRole";
import {AbstractModal} from "./AbstractModal";

/**
 * Displays Create Meetup Modal
 */

export class MeetupCreateModal extends AbstractModal{
    customId: string = "meetup_create";

    protected modalTitle: string = i18next.t("modal.meetupCreate.title");

    private allowedCommands: string[] = ["meetup", "poll"];

    protected async checkPermissions(interaction: ChatInputCommandInteraction|ButtonInteraction): Promise<void> {
        //check interaction type
        if(!interaction.isCommand()){
            throw new Error(i18next.t("global.error.invalidInteractionType"));
        }

        if (!this.allowedCommands.includes(interaction.commandName)) {
            const interactionName: string = (interaction as ChatInputCommandInteraction).commandName;
            throw new Error(i18next.t("global.error.invalidCommand", {ns: "modal", commandName: interactionName}));
        }

        //check option roles
        const options = interaction.options;
        const roleIds: string[] = [];

        const role1 = options.getRole('role1');
        if(role1 && role1.id){
            await this.checkRole(role1.id);
            roleIds.push(role1.id);
        }

        const role2 = options.getRole('role2');
        if(role2 && role2.id){
            await this.checkRole(role2.id);
            roleIds.push(role2.id);
        }

        const role3 = options.getRole('role3');
        if(role3 && role3.id){
            await this.checkRole(role3.id);
            roleIds.push(role3.id);
        }

        this.setAdditionalData({
            roleIds: roleIds
        });
    }

    protected setSubmitCustomId() {
        const roleIdString = this.additionalData.roleIds.join(',');

        this.submitCustomId = "meetup_create:" + roleIdString;
    }

    protected buildModal(): ModalBuilder {
        const modal: ModalBuilder = new ModalBuilder()
            .setCustomId(this.submitCustomId)
            .setTitle(this.modalTitle);

        const{pokemon, location, time, date, note} = this.buildInputs()

        const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(pokemon);
        const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(location);
        const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(time);
        const row4 = new ActionRowBuilder<TextInputBuilder>().addComponents(date);
        const row5 = new ActionRowBuilder<TextInputBuilder>().addComponents(note);

        // Add inputs to the modal
        modal.addComponents(row1, row2, row3, row4, row5);

        return modal;
    };

    protected buildInputs() {
        const pokemon: TextInputBuilder = new TextInputBuilder()
            .setCustomId("pokemon")
            .setLabel(i18next.t("meetupCreate.field.pokemon", {ns: "modal"}))
            .setPlaceholder(i18next.t("meetupCreate.field.pokemonPlaceholder", {ns: "modal"}))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const location: TextInputBuilder = new TextInputBuilder()
            .setCustomId("location")
            .setLabel(i18next.t("meetupCreate.field.location", {ns: "modal"}))
            .setPlaceholder(i18next.t("meetupCreate.field.locationPlaceholder", {ns: "modal"}))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const time: TextInputBuilder = new TextInputBuilder()
            .setCustomId("time")
            .setLabel(i18next.t("meetupCreate.field.time", {ns: "modal"}))
            .setPlaceholder(i18next.t("meetupCreate.field.timePlaceholder", {ns: "modal"}))
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const nowDate = new Date;

        const date: TextInputBuilder = new TextInputBuilder()
            .setCustomId("date")
            .setLabel(i18next.t("meetupCreate.field.date", {ns: "modal"}))
            .setPlaceholder(i18next.t("meetupCreate.field.datePlaceholder", {ns: "modal"}))
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue(nowDate.getDate() + "." + (nowDate.getMonth() + 1));

        const note: TextInputBuilder = new TextInputBuilder()
            .setCustomId("note")
            .setLabel(i18next.t("meetupCreate.field.note", {ns: "modal"}))
            .setPlaceholder(i18next.t("meetupCreate.field.notePlaceholder", {ns: "modal"}))
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);

        return {
            pokemon: pokemon,
            location: location,
            time: time,
            date: date,
            note: note
        }
    }

    private async checkRole(roleId: string): Promise<void>{
        const role = await db
            .selectFrom("meetup_allowed_mentions_role")
            .selectAll()
            .where("roleID", "=", roleId)
            .executeTakeFirst() as MeetupAllowedMentionsRoleRow | undefined;

        if(!role){
            throw new Error(i18next.t("meetupCreate.error.invalidRole", {ns: "modal", roleID: roleId}))
        }
    }
}