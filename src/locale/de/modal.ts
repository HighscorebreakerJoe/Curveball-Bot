import { TranslationObject } from "../../i18n";

const modal: TranslationObject = {
    global: {
        error: {
            invalidInteractionType: "Falscher Interaktionstyp",
            invalidCommand: "Ungültiges Kommando {{commandName}}",
        },
    },

    meetupCreate: {
        title: "Neues Meetup erstellen",

        field: {
            pokemon: "Pokémon",
            pokemonPlaceholder: "z.B. Enton",

            location: "Treffpunkt",
            locationPlaceholder: "z.B. eine Arena",

            time: "Uhrzeit (HH:mm)",
            timePlaceholder: "z.B. 13:37",

            date: "Datum (TT.MM)",
            datePlaceholder: "z.B. 24.12",

            note: "Anmerkungen",
            notePlaceholder:
                "Zusätzliche Infos/Anmerkungen zu deinem Meetup , " +
                "wie z.B. das zugehörige Event (Raid-Stunde etc.)",
        },

        error: {
            invalidRole: "Ungültige Rolle mit der RoleID: {{roleID}}",
        },

        submit: {
            error: {
                pokemonEmpty: "Du hast vergessen, ein Pokémon anzugeben. Wie kannst du nur?",
                locationEmpty: "Du hast vergessen, einen Ort anzugeben. Wo sollen wir uns treffen?",
                timeEmpty: "Du hast vergessen, eine Uhrzeit anzugeben.",
                timeWrongFormat: "Die Uhrzeit muss dem Format HH:mm entsprechen.",
                dateEmpty: "Du hast vergessen, ein Datum anzugeben.",
                dateWrongFormat: "Das Datum muss dem Format TT.MM entsprechen.",
                dateInvalid: "Ungültiges Datum eingegeben.",
                dateInThePast:
                    "Deine eingetragene Zeit liegt in der Vergangenheit. Wir können nicht Zeitreisen...",
            },
        },
    },

    meetupEdit: {
        title: "Meetup bearbeiten",
    },
};

export default modal;
