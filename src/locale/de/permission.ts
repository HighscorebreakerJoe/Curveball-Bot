import { TranslationObject } from "../../i18n";

const permission: TranslationObject = {
    error: {
        memberNotFound: "Member nicht gefunden.",
        meetupCantEdit: "Du hast nicht die notwendigen Rechte, dieses Meetup zu bearbeiten.",
        meetupCantDelete: "Du hast nicht die notwendigen Rechte, dieses Meetup zu löschen.",
        notMeetupCreateChannel:
            "Falscher Channel. Führe dieses Kommando bitte in <#{{channelID}}> aus.",
        invalidMeetup: "Kein Meetup mit der Meetup-ID gefunden: {{meetupID}}",
        noMeetupFoundByMessage: "Kein Meetup mit der folgenden Nachricht-ID gefunden: {{messageID}",
        memberCantExecuteCommand:
            "Du hast nicht die notwendigen Rechte, um dieses Kommando auszuführen.",
        invalidMessageInMeetupCreate:
            "Nachricht mit der ID {{messageID}} existiert nicht im Meetup-Erstellen-Kanal.",
        messageHasNoEmbeds: "Nachricht mit der ID {{messageID}} hat keine Einbettungen.",
        messageHasMoreThanOneEmbed: "Nachricht mit der {{messageID}} hat mehr als eine Einbettung.",
        messageNotPostedByBot: "Nachricht mit der {{messageID}} wurde nicht vom Bot verfasst.",
    },
};

export default permission;
