import { TranslationObject } from "../../i18n";

const button: TranslationObject = {
    meetupAddParticipant: {
        error: {
            maxParticipantsReached:
                "You can't add more participants. But I am happy you have so many friends!",
            invalidCreateAdditionalAuditLogCall :
                "Dev: Invalid call for creating an additional audit log. Either defaultRemoteState or defaultUnsureState must be set to true."
        },
    },

    meetupDelete: {
        confirmEmbedTitle: "❗ Confirm meetup deletion ❗",
        confirmEmbedDescription: "Do you really want to delete the following meetup?",

        confirm: "Yes, of course!",
        cancel: "No, I changed my mind...",
    },

    meetupDeleteCancel: {
        success: "Alright, we will keep the meetup as it is...",
    },

    meetupDeleteConfirm: {
        success: "The meetup is now deleted!",
    },

    meetupRemoveParticipant: {
        notParticipant:
            "Currently you are not a participant in this meetup. Did you hit the wrong button?",
    },

    showAllParticipants: {
        show: "Show all participants",
        previousPage: "Previous page",
        nextPage: "Next page"
    },
};

export default button;
