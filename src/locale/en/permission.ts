import { TranslationObject } from "../../i18n";

const permission: TranslationObject = {
    error: {
        memberNotFound: "Member not found.",
        meetupCantEdit: "You don't have permissions to edit this meetup.",
        meetupCantDelete: "You don't have permissions to delete this meetup.",
        notMeetupCreateChannel: "Wrong channel. Please run this command in <#{{channelID}}>.",
        invalidMeetup: "No valid meetup found with meetup ID: {{meetupID}}",
        noMeetupFoundByMessage: "No meetup found with message ID: {{messageID}}",
        memberCantExecuteCommand: "You don't have permissions to run this command.",
        invalidMessageInMeetupCreate:
            "Message with ID {{messageID}} does not exist in meetup create channel.",
        messageHasNoEmbeds: "Message with ID {{messageID}} has no embeds.",
        messageHasMoreThanOneEmbed: "Message with ID {{messageID}} has more than one embed.",
        messageNotPostedByBot: "Message with ID {{messageID}} has not been posted by the bot.",
    },
};

export default permission;
