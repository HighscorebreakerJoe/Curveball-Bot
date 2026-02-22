import {TranslationObject} from "../../i18n";

const modal: TranslationObject = {
    global: {
        error: {
            invalidInteractionType: "Falscher Interaktionstyp",
            invalidCommand: "Ungültiges Kommando {{commandName}}"
        }
    },

    meetupCreate: {
        title: "Neuen Meetup erstellen",

        field: {
            pokemon: "Pokémon",
            pokemonPlaceholder: "z.B. Enton",

            location: "Treffpunkt",
            locationPlaceholder: "z.B. eine Arena",

            time: "Uhrzeit (HH:MM)",
            timePlaceholder: "z.B. 13:37",

            date: "Datum (TT.MM)",
            datePlaceholder: "z.B. 24.12",

            note: "Anmerkungen",
            notePlaceholder: "Zusätzliche Infos/Anmerkungen zu deinem Meetup , " +
                "wie z.B. das zugehörige Event (Raid-Stunde etc.)",
        },

        error: {
            invalidRole: "Ungültige Rolle mit der RoleID: {{roleID}}"
        }
    },

    meetupEdit: {
        title: "Meetup bearbeiten"
    }
}

export default modal;