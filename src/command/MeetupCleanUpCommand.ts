/**
 * Command for cleaning up meetup data and channels
 */
import {APIApplicationCommandOption, ChatInputCommandInteraction, Locale, MessageFlags} from "discord.js";
import {db} from "../database/Database";
import {MeetupRow} from "../database/table/Meetup";
import {assertMeetupCreateChannelUsed} from "../permissions/assertMeetupCreateChannelUsed";
import {assertUserHasMeetupConfigRole} from "../permissions/assertUserHasMeetupConfigRole";
import {deleteMeetupData} from "../util/deleteMeetupData";
import {postSuccess} from "../util/postEmbeds";
import {AbstractCommand} from "./AbstractCommand";

export class MeetupCleanUpCommand extends AbstractCommand {
    name: string = "meetup_cleanup";

    description: string = "Cleans up meetup data and channels";
    localizedDescriptions = {
        [Locale.German]: "Bereinigt Meetup-Daten und -Kanäle"
    };

    options: APIApplicationCommandOption[] = [];

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        //collect data from old meetups
        const dateNow = new Date();
        const oneDayAgo = new Date(dateNow);
        oneDayAgo.setDate(dateNow.getDate() - 1);

        const toDeleteMeetups = await db.selectFrom("meetup")
            .selectAll()
            .where("time", "<", dateNow)
            .execute() as MeetupRow[]

        const meetupIDs = [];

        for (const toDeleteMeetup of toDeleteMeetups){
            meetupIDs.push(toDeleteMeetup.meetupID);
        }

        if(meetupIDs.length > 0){
            await deleteMeetupData(meetupIDs);
        }

        //create success embed
        await postSuccess(interaction, "Die Meetup-Daten und -Kanäle wurden erfolgreich bereinigt.");
    }
}