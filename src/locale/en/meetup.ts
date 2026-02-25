import {TranslationObject} from "../../i18n";

const meetup: TranslationObject = {
    info : {
        titleRaidFrom: "Raid from",
        threadTitle: "Meetup #{{meetupID}}: Discussion",
        threadDefaultCreateReason: "Created automatically",
        threadDefaultDeleteReason: "Deleted automatically",
        createSuccess: "Your meetup was successfully created!",
        createSuccessLink: "You can find your meetup here.",
        footerText: "Meetup #{{meetupID}}",

        pokemon: "Pokémon",
        location: "Location",
        dateTime: "Date and time",
        remainingTime: "Remaining time",
        note: "Note",
        participants: "Participants",

        unsure: "Unsure",
        remote: "Remote",
    },

    participantList: {
        participants: "Participants",
        confirmedParticipants: "Confirmed participants",
        unsureParticipants: "Unsure participants",

        completeListThreadInfo: "Complete participant list in thread",

        persons: "Persons:",
        personsTotal: "Persons total:"
    },

    update: {
        title: "Update!",
        embedTitle: "This meetup got an update!",
        embedDescription: "Following changes to this meetup have been made:"
    },

    list: {
        toMeetup: "To meetup",
        toDiscussion: "To discussion",
    }
}

export default meetup;