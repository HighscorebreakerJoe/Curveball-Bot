import { TranslationObject } from "../../i18n";

const meetup: TranslationObject = {
    info: {
        titleRaidFrom: "Raid von",
        threadTitle: "Meetup #{{meetupID}}: Absprache",
        threadDefaultCreateReason: "Automatisch erzeugt",
        threadDefaultDeleteReason: "Automatisch gelöscht",
        createSuccess: "Dein Meetup wurde erfolgreich erstellt!",
        createSuccessLink: "Hier geht es zu deinem erstellten Meetup.",
        editSuccess: "Das Meetup wurde erfolgreich bearbeitet!",

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
        personsTotal: "Personen insgesamt:",
    },

    update: {
        embedTitle: "Dieses Meetup wurde aktualisiert!",
        embedDescription: "Im Folgenden findet ihr die Änderungen dieses Meetups:",
    },

    list: {
        toMeetup: "Zum Meetup",
        toDiscussion: "Zur Absprache",
    },

    defaultNotice: {
        tutorial: {
            title: "Tutorial",
            description:
                "Hi 👋\n" +
                "\n" +
                "Hier erfährst du alles rund um Meetups.\n" +
                "\n" +
                "# Was sind Meetups?\n" +
                "\n" +
                "Meetups sind Verabredungen zu bestimmten Events für Pokémon GO. In den meisten Fällen sind das Verabredungen zu bestimmten Raids. Aber auch darüber hinaus sind Meetups sinnvoll, zum Beispiel bei Gigadynamax-Events, bei denen sich die Teilnehmenden zunächst an einem Treffpunkt versammeln, um anschließend gemeinsam zu den Raids zu gehen.\n" +
                "\n" +
                "# Wo werden alle aktiven Meetups aufgelistet?\n" +
                "\n" +
                "Alle Meetups findest du im Kanal <#{{meetupListChannelID}}>, sortiert nach dem Datum, an dem sie stattfinden.\n" +
                "\n" +
                "# Wie kann ich nähere Informationen zu den aktiven Meetups erhalten?\n" +
                "\n" +
                "Klicke dazu beim jeweiligen Meetup einfach auf „Zum Meetup“. Du wirst anschließend zum Detaileintrag des Meetups im Kanal <#{{meetupInfoChannelID}}> weitergeleitet. Dort findest du alle Detailinformationen zu den aktiven Meetups.\n" +
                "\n" +
                "# Wie erstelle ich ein Meetup?\n" +
                "\n" +
                "Schreibe dazu einfach in diesem Kanal den Befehl `/meetup` oder `/poll`. Optional kannst du bis zu drei Rollen angeben, die nach der Erstellung des Meetups benachrichtigt werden sollen. Nach dem Abschicken des Befehls erscheint ein Eingabefenster, in dem du alle nötigen Daten zum Meetup angeben kannst, darunter Treffpunkt und Zeit des Meetups.\n" +
                "\n" +
                "# Was machen die Knöpfe bei den Meetups? Wie kann ich mich für Meetups anmelden?\n" +
                "\n" +
                "- „👍 +1“: Damit meldest du dich für ein Meetup an. Du kannst zusätzliche Teilnehmer hinzufügen, indem du den Button erneut drückst.\n" +
                "- „👎 -1“: Damit entfernst du einen Teilnehmer von deiner Zusage. Wenn der Wert 0 erreicht, meldest du dich vollständig vom Meetup ab.\n" +
                "- „🤷“: Damit kannst du angeben, dass deine Teilnahme noch unsicher ist. Drücke erneut darauf, um deinen Unsicherheitsstatus wieder zurückzuziehen.\n" +
                "- „🚀“: Damit kannst du angeben, dass du als Fern-Raider am Meetup teilnehmen wirst. Drücke erneut darauf, um deinen Fernstatus wieder zu entfernen.\n" +
                "- „✏️/🗑️“: Diese Buttons können vom Ersteller des Meetups sowie von der Moderation genutzt werden, um das Meetup zu bearbeiten oder zu löschen.\n" +
                "\n" +
                "# Wie kann ich mich mit den Meetup-Teilnehmern absprechen?\n" +
                "\n" +
                "Zu jedem Meetup wird ein Thread erstellt, in dem die Teilnehmenden aufgelistet sind und Absprachen getroffen werden können.\n" +
                "\n" +
                "# Gibt es eine Rolle, mit der alle Teilnehmer eines Meetups benachrichtigt werden können?\n" +
                "\n" +
                "Ja, in der Regel ist die Rolle wie folgt aufgebaut: @Meetup[Nummer]. Bei einem Meetup mit der Nummer 1337 lautet sie also *@Meetup1337*.",
        },

        cleanup: {
            title: "Hinweis",
            description:
                "In diesem Kanal werden täglich alle Nachrichten, die nicht vom Bot stammen, entfernt.\n\n" +
                "*Aus diesem Grund: Bitte hier __nicht__ chatten!*",
        },
    },
};

export default meetup;
