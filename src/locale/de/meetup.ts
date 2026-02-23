import {TranslationObject} from "../../i18n";

const meetup: TranslationObject = {
    info : {
        titleRaidFrom: "Raid von",
        threadTitle: "Meetup #{{meetupID}}: Absprache",
        threadDefaultReason: "Automatisch erzeugt",
        createSuccess: "Dein Meetup wurde erfolgreich erstellt!",
        createSuccessLink: "Hier geht es zu deinem erstellten Meetup.",

        pokemon: "Pokémon",
        location: "Treffpunkt",
        dateTime: "Datum und Uhrzeit",
        remainingTime: "Verbleibende Zeit",
        note: "Anmerkung",
        participants: "Zusagen",

        unsure: "Unsicher",
        remote: "Fern",
    },

    participantList: {
        participants: "Zusagen",
        confirmedParticipants: "Sichere Zusagen",
        unsureParticipants: "Unsichere Zusagen",

        completeListThreadInfo: "Vollständige Liste im Absprachen-Thread",

        persons: "Personen:",
        personsTotal: "Personen insgesamt:"
    },

    update: {
        embedTitle: "Dieser Meetup wurde aktualisiert!",
        embedDescription: "Im Folgenden findet ihr die Änderungen zu diesem Meetups:"
    },

    list: {
        toMeetup: "Zum Meetup",
        toDiscussion: "Zur Absprache",
    }
}

export default meetup;