import {TranslationObject} from "../../i18n";

const command: TranslationObject = {
    meetup: {
        description: "Erstellt ein Meetup",

        option: {
            role1Description: "Die erste Rolle, die in dem Meetup benachrichtigt werden soll",
            role2Description: "Die zweite Rolle, die in dem Meetup benachrichtigt werden soll",
            role3Description: "Die dritte Rolle, die in dem Meetup benachrichtigt werden soll"
        },

        error: {
            roleNotMentionable: "Die Rolle mit der ID {{roleID}} kann nicht erwähnt werden."
        }
    },

    meetupAddMention: {
        description: "Fügt eine Rolle zu den erwähnbaren Rollen in Meetups hinzu",

        option: {
            roleDescription: "Die Rolle, die zu den erwähnbaren Rollen hinzugefügt werden soll"
        },

        error: {
            invalidRole: "Die angegebene Rolle wurde nicht gefunden.",
            roleAlreadyAdded: "Die Rolle mit der ID {{roleID}} befindet sich bereits in den erwähnabren Rollen."
        }
    },

    meetupCleanup: {
        description: "Bereinigt Meetup-Daten und -Kanäle"
    },

    meetupRemoveMention: {
        description: "Entfernt eine Rolle aus den erwähnbaren Rollen für Meetups",

        option: {
            roleDescription: "Die Rolle, die aus den erwähnbaren Rollen entfernt werden soll"
        },

        error: {
            roleAlreadyAdded: "Die Rolle mit der ID {{roleID}} befindet sich nicht in den erwähnabren Rollen."
        }
    },

    poll: {
        description: "Erstellt ein Meetup (Alias für /meetup)"
    }
}

export default command;