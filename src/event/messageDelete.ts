import {Client, Events, Message, OmitPartialGroupDMChannel, PartialMessage} from "discord.js";
import {getMeetupInfoChannel} from "../cache/meetupChannels";
import {deleteMeetupsByMeetupIDs, getMeetupByMessageID, MeetupRow} from "../database/table/Meetup";
import {tCommon} from "../i18n";
import {delay} from "../util/delay";

/**
 * Event handler, when a message is deleted.
 * Also runs on bulk deleting messages and when a message is deleted manually by the user.
 */

export default function onMessageDelete(client: Client): void {
    client.on(Events.MessageDelete, async (message: OmitPartialGroupDMChannel<Message | PartialMessage>): Promise<void> => {
        if(message.channel.id == getMeetupInfoChannel().id){
            await handleMeetupMessage(message);
        }
    });
}

async function handleMeetupMessage(message: OmitPartialGroupDMChannel<Message | PartialMessage>): Promise<void>{
    //wait a bit because related meetup may be already deleted by a cleanup action
    await delay(500);

    const meetup: MeetupRow|undefined = await getMeetupByMessageID(message.id);

    if(!meetup){
        return;
    }

    try{
        await deleteMeetupsByMeetupIDs([meetup.meetupID]);
    }catch (error){
        console.error(tCommon("error.meetupDeleteError"), error);
    }
}