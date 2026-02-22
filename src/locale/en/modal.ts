import {TranslationObject} from "../../i18n";

const modal: TranslationObject = {
    global: {
        error: {
            invalidInteractionType: "Invalid interaction type",
            invalidCommand: "Invalid command {{commandName}}"
        }
    },

    meetupCreate : {
        title: "Create new meetup",

        field: {
            pokemon: "Pokémon",
            pokemonPlaceholder: "i.e. Psyduck",

            location: "Location",
            locationPlaceholder: "i.e. a gym",

            time: "Time (HH:MM)",
            timePlaceholder: "i.e. 13:37",

            date: "Date (DD.MM)",
            datePlaceholder: "i.e. 24.12",

            note: "Notes",
            notePlaceholder: "Additional information/notes to your meetup , " +
                "i.e. the associated event (raid-hour etc.)",
        },

        error: {
            invalidRole: "Invalid role with roleID: {{roleID}}"
        }
    }
}

export default modal;