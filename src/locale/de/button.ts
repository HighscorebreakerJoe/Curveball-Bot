import {TranslationObject} from "../../i18n";

const button: TranslationObject = {
    meetupAddParticipant: {
        error: {
            maxParticipantsReached: "Maximalanzahl der Mitteilnehmenden erreicht. Mich freut es aber, dass du so viele Freunde hast!"
        }
    },

    meetupDelete: {
        confirmEmbedTitle: "❗ Meetup Löschbestätigung ❗",
        confirmEmbedDescription: "Möchtest du wirklich das folgende Meetup löschen?",

        confirm: "Ja, möchte ich!",
        cancel: "Nein, habs mir doch anders überlegt...."
    },

    meetupDeleteCancel: {
        success: "Na gut, dann löschen wir das Meetup eben nicht...\""
    },

    meetupDeleteConfirm: {
        success: "Das Meetup wurde erfolgreich gelöscht!"
    },

    meetupRemoveParticipant: {
        notParticipant: "Du bist in diesem Meetup nicht als Teilnehmer markiert. Verdrückt?"
    }
}

export default button;