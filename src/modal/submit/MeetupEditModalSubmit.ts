import {
    EmbedBuilder,
    heading,
    ModalSubmitInteraction,
    Snowflake,
    TextThreadChannel,
    time,
    TimestampStyles,
} from "discord.js";
import { getGuild } from "../../cache/guild";
import { getMeetupInfoChannel } from "../../cache/meetupChannels";
import { db } from "../../database/Database";
import { MeetupRow } from "../../database/table/Meetup";
import { tMeetup } from "../../i18n";
import { assertMeetupIDIsValid } from "../../permission/assertMeetupIDIsValid";
import { assertUserIsMeetupCreatorOrConfig } from "../../permission/assertUserIsMeetupCreatorOrConfig";
import { editMeetupInfoEmbed } from "../../util/editMeetupInfoEmbed";
import { getDynamicData } from "../../util/getDynamicIDData";
import { resetMeetupListChannel } from "../../util/resetMeetupListChannel";
import { MeetupCreateModalSubmit } from "./MeetupCreateModalSubmit";

/**
 * Handles Edit Modal submits
 */

export class MeetupEditModalSubmit extends MeetupCreateModalSubmit {
    customId: string = "meetup_edit:{d}";
    dynamicId: boolean = true;

    protected async checkPermissions(interaction: ModalSubmitInteraction): Promise<void> {
        const meetupID: number = Number(getDynamicData(interaction.customId));
        const meetup: MeetupRow = await assertMeetupIDIsValid(meetupID);
        await assertUserIsMeetupCreatorOrConfig(interaction, meetup, false);

        this.setAdditionalData({
            meetup: meetup,
        });
    }

    /**
     * Posts meetup after modal inputs have been successfully validated
     */
    protected async successModalInputs(interaction: ModalSubmitInteraction): Promise<void> {
        const { pokemon, location, time, date, note } = this.sanitizedInputs;

        const meetup = this.additionalData.meetup as MeetupRow;

        //handle date
        const toSaveDate: Date = this.getToSaveDate(time, date);

        //save differences for later use
        const differences = new Map<
            string,
            { title: string; old: string | Date; new: string | Date }
        >();

        if (meetup.pokemon !== pokemon) {
            differences.set("pokemon", {
                title: "👾 " + tMeetup("info.pokemon"),
                old: meetup.pokemon,
                new: pokemon,
            });
        }

        if (meetup.location !== location) {
            differences.set("location", {
                title: "📍 " + tMeetup("info.location"),
                old: meetup.location,
                new: location,
            });
        }

        if (meetup.time.getTime() !== toSaveDate.getTime()) {
            differences.set("time", {
                title: "📅 " + tMeetup("info.dateTime"),
                old: meetup.time,
                new: toSaveDate,
            });
        }

        if (meetup.note !== note) {
            differences.set("note", {
                title: "📝 " + tMeetup("info.note"),
                old: meetup.note ? meetup.note : "",
                new: note,
            });
        }

        //update meetup
        await db
            .updateTable("meetup")
            .set({
                pokemon: pokemon,
                location: location,
                time: toSaveDate,
                note: note,
            })
            .where("meetupID", "=", this.additionalData.meetup.meetupID)
            .execute();

        //update embed in message
        const messageID = meetup.messageID as Snowflake;
        const message = await getMeetupInfoChannel().messages.fetch(messageID);

        const embed: EmbedBuilder = EmbedBuilder.from(message.embeds[0]);
        let userTag: string = interaction.user?.tag;

        if (meetup.userID !== interaction.user?.id) {
            const member = await getGuild().members.fetch(meetup.userID);
            userTag = member?.user.tag;
        }

        const embedTitle: string = pokemon + ": " + tMeetup("info.titleRaidFrom") + " " + userTag;

        const newEmbed: EmbedBuilder = editMeetupInfoEmbed(embed, {
            embedTitle: embedTitle,
            pokemon: pokemon,
            location: location,
            toSaveDate: toSaveDate,
            note: note,
        });

        await message.edit({
            embeds: [newEmbed],
        });

        //send message pointing out differences
        if (differences.size > 0) {
            await this.sendDifferencesMessage(differences, message.thread as TextThreadChannel);
        }

        //reset meetup list channel
        await resetMeetupListChannel();

        await interaction.deferUpdate();

        //dm user
        // await interaction.user.send({
        //     content: "Dein Kommentar wurde erfolgreich bearbeitet!"
        // });
    }

    private async sendDifferencesMessage(
        differences: Map<
            string,
            {
                title: string;
                old: string | Date;
                new: string | Date;
            }
        >,
        thread: TextThreadChannel,
    ): Promise<void> {
        const updateEmbed: EmbedBuilder = new EmbedBuilder();
        updateEmbed.setTitle(tMeetup("update.embedTitle"));
        updateEmbed.setDescription(tMeetup("update.embedDescription"));
        updateEmbed.setColor(0xff0000);

        const fields: { name: string; value: string }[] = [];

        differences.forEach(
            (value: { title: string; old: string | Date; new: string | Date }, key: string) => {
                fields.push({
                    name: value.title,
                    value:
                        value.new instanceof Date
                            ? time(value.new, TimestampStyles.LongDateShortTime)
                            : value.new,
                });
            },
        );

        updateEmbed.addFields(fields);

        await thread.send({
            content: heading(tMeetup("update.title")),
            embeds: [updateEmbed],
        });
    }
}
