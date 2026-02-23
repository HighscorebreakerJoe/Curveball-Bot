import {TranslationObject} from "../../i18n";

const permission: TranslationObject = {
    error : {
        memberNotFound: "Member nicht gefunden.",
        meetupCantEdit: "Du hast nicht die notwendigen Rechte, diesen Meetup zu bearbeiten.",
        meetupCantDelete: "Du hast nicht die notwendigen Rechte, diesen Meetup zu löschen.",
        notMeetupCreateChannel: "Falscher Channel. Führe dieses Kommando bitte in <#{{channelID}}> aus.",
        invalidMeetup: "Kein Meetup mit der Meetup-ID gefunden: {{meetupID}}",
        noMeetupFoundByMessage: "Kein Meetup mit der folgenden Nachricht-ID gefunden: {{messageID}",
        memberCantExecuteCommand: "Du hast nicht die notwendigen Rechte, um dieses Kommando auszuführen."
    }
}

export default permission;