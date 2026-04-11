import { TranslationObject } from "../../i18n";

const meetup: TranslationObject = {
    info: {
        titleRaidFrom: "Raid from",
        threadTitle: "Meetup #{{meetupID}}: Discussion",
        threadDefaultCreateReason: "Created automatically",
        threadDefaultDeleteReason: "Deleted automatically",
        createSuccess: "Your meetup was successfully created!",
        createSuccessLink: "You can find your meetup here.",
        editSuccess: "The meetup was successfully edited!",
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
        personsTotal: "Persons total:",
    },

    role: {
        error: {
            assignRole: "Failed to assign user {{userID}} the role {{roleID}}",
            removeRole: "Failed to remove role {{roleID}} from user {{userID}}",
            delete: "Failed to delete role {{roleID}}",
        },
    },

    update: {
        title: "Update!",
        embedTitle: "This meetup got an update!",
        embedDescription: "Following changes to this meetup have been made:",
    },

    list: {
        toMeetup: "To meetup",
        toDiscussion: "To discussion",
    },

    defaultNotice: {
        tutorial: {
            title: "Tutorial",
            description:
                "Hi 👋\n" +
                "\n" +
                "Here you can find all information about meetups.\n" +
                "\n" +
                "# What are meetups?\n" +
                "\n" +
                "Meetups are gatherings for specific Pokémon GO events. In most cases, these are for particular raids, but meetups are also useful beyond that, for example during Gigantamax events, where participants first meet at a designated spot before heading to the raids together.\n" +
                "\n" +
                "# Where can I find all active meetups?\n" +
                "\n" +
                "All meetups are listed in the channel <#{{meetupListChannelID}}>, sorted by the date on which they will take place.\n" +
                "\n" +
                "# How can I get more information about active meetups?\n" +
                "\n" +
                'Simply click "To meetup" on the meetup you are interested in. You will then be directed to the detailed entry of the meetup in the channel <#{{meetupInfoChannelID}}>. There you will find all details for the active meetups.\n' +
                "\n" +
                "# How do I create a meetup?\n" +
                "\n" +
                "Simply type the command `/meetup` or `/poll` in this channel. Optionally, you can specify up to three roles to be notified after the meetup is created. After submitting the command, an input window will appear where you can enter all the necessary meetup information, including the meeting point and time.\n" +
                "\n" +
                "# What do the buttons on meetups do? How can I sign up?\n" +
                "\n" +
                '- "👍 +1": Signs up for a meetup. You can add additional participants by clicking the button again.\n' +
                '-  "👎 -1": Removes a participant from your meetup. If the count reaches 0, you are completely removed from the meetup.\n' +
                '-  "🤷": Indicates that your participation is uncertain. Click again to remove your uncertain status.\n' +
                '-  "🚀": Indicates that you will participate as a remote raider. Click again to remove your remote status.\n' +
                '-  "✏️/🗑️": These buttons can be used by the meetup creator or moderators to edit or delete the meetup.\n' +
                "\n" +
                "# How can I communicate with other meetup participants?\n" +
                "\n" +
                "A thread is created for each meetup, where participants are listed and can coordinate with each other.\n" +
                "\n" +
                "# Is there a role to notify all meetup participants?\n" +
                "\n" +
                "Yes. Typically, the role is formatted like this: @Meetup[Number]. For a Meetup with the number 1337, it would be *@Meetup1337*.",
        },

        cleanup: {
            title: "Note",
            description:
                "Messages in this channel, which are not posted by the bot, are deleted daily.\n\n" +
                "*For this reason: Please __do not__ chat here in this channel!*",
        },
    },
};

export default meetup;
