import { TranslationObject } from "../../i18n";

const command: TranslationObject = {
    meetup: {
        description: "Erstellt ein Meetup",

        option: {
            role1Description: "Die erste Rolle, die in dem Meetup benachrichtigt werden soll",
            role2Description: "Die zweite Rolle, die in dem Meetup benachrichtigt werden soll",
            role3Description: "Die dritte Rolle, die in dem Meetup benachrichtigt werden soll",
        },

        error: {
            roleNotMentionable: "Die Rolle {{roleMention}} kann nicht erwähnt werden.",
        },
    },

    meetupAddMention: {
        description: "Fügt eine Rolle zu den erwähnbaren Rollen in Meetups hinzu",

        option: {
            roleDescription: "Die Rolle, die zu den erwähnbaren Rollen hinzugefügt werden soll",
        },

        error: {
            invalidRole: "Die angegebene Rolle wurde nicht gefunden.",
            roleAlreadyAdded:
                "Die Rolle {{roleMention}} befindet sich bereits in den erwähnabren Rollen.",
        },

        success: "Die Rolle {{roleMention}} ist nun in Meetups erwähnbar.",
    },

    meetupCleanup: {
        description: "Bereinigt Meetup-Daten und -Kanäle",
        success: "Die Meetup-Daten und -Kanäle wurden erfolgreich bereinigt.",
    },

    meetupRemoveMention: {
        description: "Entfernt eine Rolle aus den erwähnbaren Rollen für Meetups",

        option: {
            roleDescription: "Die Rolle, die aus den erwähnbaren Rollen entfernt werden soll",
        },

        error: {
            roleAlreadyAdded:
                "Die Rolle {{roleMention}} befindet sich nicht in den erwähnabren Rollen.",
        },

        success: "Die Rolle {{roleMention}} ist nun nicht mehr in Meetups erwähnbar.",
    },

    noticeCreate: {
        description: "Erstellt eine eingebettete Nachricht im Meetup-Erstellen-Kanal",
    },

    noticeEdit: {
        description: "Bearbeitet eine eingebettete Nachricht vom Meetup-Erstellen-Kanal",

        option: {
            messageIDDescription: "Die ID der Nachricht, deren Einbettung bearbeitet wird.",
        },
    },

    poll: {
        description: "Erstellt ein Meetup (Alias für /meetup)",
    },

    postMeetupCreateNotices: {
        description: "Verfasst die Standardhinweise im Meetup-Erstellungskanal",
    },
};

export default command;
