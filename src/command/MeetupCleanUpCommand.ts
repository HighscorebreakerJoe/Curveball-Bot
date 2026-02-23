/**
 * Command for cleaning up meetup data and channels
 */
import {APIApplicationCommandOption, ChatInputCommandInteraction, MessageFlags} from "discord.js";
import {getMeetupInfoChannel} from "../cache/meetupChannels";
import {db} from "../database/Database";
import {MeetupRow} from "../database/table/Meetup";
import {tCommand} from "../i18n";
import {assertMeetupCreateChannelUsed} from "../permission/assertMeetupCreateChannelUsed";
import {assertUserHasMeetupConfigRole} from "../permission/assertUserHasMeetupConfigRole";
import {deleteMeetupData} from "../util/deleteMeetupData";
import {postSuccess} from "../util/postEmbeds";
import {AbstractCommand} from "./AbstractCommand";

export class MeetupCleanUpCommand extends AbstractCommand {
    name: string = "meetup_cleanup";

    protected get description(): string {
        return tCommand("meetupCleanup.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [];
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        await this.deleteOldMeetups();
        await this.deleteInvalidMeetupMessages();

        //create success embed
        await postSuccess(interaction, "Die Meetup-Daten und -Kanäle wurden erfolgreich bereinigt.");
    }

    private async deleteOldMeetups(): Promise<void> {
        //detect old meetups
        const dateNow = new Date();
        const oneDayAgo = new Date(dateNow);
        oneDayAgo.setDate(dateNow.getDate() - 1);

        const toDeleteMeetups = await db.selectFrom("meetup")
            .selectAll()
            .where("time", "<", oneDayAgo)
            .execute() as MeetupRow[];

        const meetupIDs = [];

        for (const toDeleteMeetup of toDeleteMeetups){
            meetupIDs.push(toDeleteMeetup.meetupID);
        }

        //delete old meetups
        if(meetupIDs.length > 0){
            await deleteMeetupData(meetupIDs);
        }
    }

    private async deleteInvalidMeetupMessages(): Promise<void> {
        //detect invalid meetup messages (message which do not refer to a valid meetup)
        const validMessages: {messageID: string | null}[] = await db.selectFrom("meetup")
            .select("messageID")
            .execute();

        const validMessageIDs: string[] = validMessages.map(message => message.messageID)
            .filter((messageID) => messageID !== null);

        const validMessageIDsSet = new Set(validMessageIDs);

        if(validMessageIDsSet.size === 0){
            return;
        }

        const meetupChannelMessages = await getMeetupInfoChannel()
            .messages.fetch({ limit: 100 });

        const toDeleteMessages = meetupChannelMessages.filter(
            message => !validMessageIDsSet.has(message.id)
        );

        //delete invalid meetup messages
        if(toDeleteMessages.size){
            await getMeetupInfoChannel().bulkDelete(toDeleteMessages, true);
        }
    }
}