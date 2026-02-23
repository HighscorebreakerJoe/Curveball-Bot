import {TranslationObject} from "../../i18n";

const permission: TranslationObject = {
    error : {
        memberNotFound: "Member not found.",
        meetupCantEdit: "You don't have permissions to edit this meetup.",
        meetupCantDelete: "You don't have permissions to delete this meetup.",
        notMeetupCreateChannel: "Wrong channel. Please execute this command in <#{{channelID}}>",
        invalidMeetup: "No valid meetup found with meetup ID: {{meetupID}}",
        noMeetupFoundByMessage: "No meetup found with message ID: {{messageID}}",
        memberCantExecuteCommand: "You don't have permissions to run this command."
    }
}

export default permission;