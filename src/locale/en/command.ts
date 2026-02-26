import { TranslationObject } from "../../i18n";

const command: TranslationObject = {
    meetup: {
        description: "Creates a meetup",

        option: {
            role1Description: "The first role which will be notified in your meetup",
            role2Description: "The second role which will be notified in your meetup",
            role3Description: "The third role which will be notified in your meetup",
        },

        error: {
            roleNotMentionable: "Role with ID {{roleID}} is not mentionable in meetups.",
        },
    },

    meetupAddMention: {
        description: "Adds a role to the mentionable roles list for meetups",

        option: {
            roleDescription: "The role which will be added to the mentionable roles",
        },

        error: {
            invalidRole: "Can't find role.",
            roleAlreadyAdded: "Role with ID {{roleID}} is already added as a mentionable role.",
        },
    },

    meetupCleanup: {
        description: "Cleans up meetup-data and -channels",
        success: "Cleaned up all meetup-data and -channels.",
    },

    meetupRemoveMention: {
        description: "Removes a role from the mentionable roles list for meetups",

        option: {
            roleDescription: "The role which will be removed from the mentionable roles",
        },

        error: {
            roleAlreadyAdded: "Role with ID {{roleID}} is not added as a mentionable role.",
        },
    },

    poll: {
        description: "Creates a meetup (Alias for /meetup)",
    },
};

export default command;
