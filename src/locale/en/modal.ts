import { TranslationObject } from "../../i18n";

const modal: TranslationObject = {
    global: {
        error: {
            invalidInteractionType: "Invalid interaction type",
            invalidCommand: "Invalid command {{commandName}}",
        },
    },

    meetupCreate: {
        title: "Create new meetup",

        field: {
            pokemon: "Pokémon",
            pokemonPlaceholder: "i.e. Psyduck",

            location: "Location",
            locationPlaceholder: "i.e. a gym",

            time: "Time (HH:mm)",
            timePlaceholder: "i.e. 13:37",

            date: "Date (DD.MM)",
            datePlaceholder: "i.e. 24.12",

            note: "Note",
            notePlaceholder:
                "Additional information/notes to your meetup , " +
                "i.e. the associated event (raid-hour etc.)",
        },

        error: {
            invalidRole: "Invalid role with roleID: {{roleID}}",
        },

        submit: {
            error: {
                pokemonEmpty: "You forgot to specify a Pokémon. How could you?",
                locationEmpty: "You forgot to specify a location. Where should we meet?",
                timeEmpty: "You forgot to specify a time.",
                timeWrongFormat: "The time must be in HH:mm format.",
                dateEmpty: "You forgot to specify a date.",
                dateWrongFormat: "The date must be in DD.MM format.",
                dateInvalid: "The specified date is invalid.",
                dateInThePast: "The specified date is in the past. We can't travel back in time...",
            },
        },
    },

    meetupEdit: {
        title: "Edit meetup",
    },
};

export default modal;
