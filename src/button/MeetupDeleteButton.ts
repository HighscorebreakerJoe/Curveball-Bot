/**
 * Class for handling "Delete meetup" buttonpress in meetup info embeds
 */
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    hyperlink,
    time,
    TimestampStyles
} from "discord.js";
import {MeetupRow} from "../database/table/Meetup";
import env from "../env";
import {assertMessageHasValidMeetup} from "../permission/assertMessageHasValidMeetup";
import {assertUserIsMeetupCreatorOrConfig} from "../permission/assertUserIsMeetupCreatorOrConfig";
import {AbstractButton} from "./AbstractButton";

export class MeetupDeleteButton extends AbstractButton{
    customId: string = "meetup_delete:{d}";
    protected context: Record<string, unknown> = {};

    /**
     * Checks if current user is allowed to execute the function of this button
     */
    protected async checkPermissions(interaction: ButtonInteraction): Promise<void> {
        const messageID: string = interaction.message.id;
        const meetup: MeetupRow = await  assertMessageHasValidMeetup(messageID);

        await assertUserIsMeetupCreatorOrConfig(interaction, meetup, true);

        //save relevant variables for run
        this.context.meetup = meetup;
    }

    protected async run(interaction: ButtonInteraction): Promise<void> {
        await interaction.deferUpdate();

        //post delete prompt to user
        const meetup = this.context.meetup as MeetupRow;

        const messageLink = `https://discord.com/channels/${env.GUILD_ID}/${env.MEETUP_INFO_CHANNEL_ID}/${meetup.messageID}`;

        const embed = new EmbedBuilder()
            .setTitle("❗ Löschbestätigung ❗")
            .setDescription(`Möchtest du wirklich den Meetup mit der ID ${meetup.meetupID} löschen?\n\n${hyperlink("Zum Meetup", messageLink)}\n`)
            .setColor(0xff0000)
            .addFields(
                {
                    name: "👾 Pokémon", value: meetup.pokemon
                },
                {
                    name: "📍 Treffpunkt", value: meetup.location
                },
                {
                    name: "📅 Datum und Uhrzeit", value: time(meetup.time, TimestampStyles.LongDateShortTime)
                }
            );

        //dm user
        const meetupDeleteConfirmButton: ButtonBuilder = new ButtonBuilder()
            .setCustomId("meetup_delete_confirm:" + meetup.meetupID)
            .setLabel("Ja, möchte ich!")
            .setEmoji("😤")
            .setStyle(ButtonStyle.Success);

        const meetupDeleteCancelButton: ButtonBuilder = new ButtonBuilder()
            .setCustomId("meetup_delete_cancel")
            .setLabel("Nein, habs mir doch anders überlegt...")
            .setEmoji("😶‍🌫️")
            .setStyle(ButtonStyle.Danger);

        const meetupDeleteButtonRow: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>().addComponents(
            meetupDeleteConfirmButton, meetupDeleteCancelButton
        );

        await interaction.user.send({
            embeds: [embed],
            components: [meetupDeleteButtonRow]
        });
    }
}