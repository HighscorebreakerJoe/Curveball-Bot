import {TranslationObject} from "../../i18n";

const button: TranslationObject = {
    meetupAddParticipant: {
        error: {
            maxParticipantsReached: "You can't add more participants. But I am happy you have so many friends!"
        }
    },

    meetupDelete: {
        confirmEmbedTitle: "❗ Confirm meetup deletion ❗",
        confirmEmbedDescription: "Do you really want to delete the following meetup?",

        confirm: "Yes, of course!",
        cancel: "No, I changed my mind..."
    },

    meetupDeleteCancel: {
        success: "Alright, we will keep the meetup as it is..."
    },

    meetupDeleteConfirm: {
        success: "The meetup is now deleted!"
    },

    meetupRemoveParticipant: {
        notParticipant: "Currently you are not a participant in this meetup. Did you hit the wrong button?"
    }
}

export default button;