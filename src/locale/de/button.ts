import { PartialTranslationObject } from "../../i18n";
import type buttonEn from "../en/button";

const button = {
    meetupAddParticipant: {
        error: {
            maxParticipantsReached:
                "Maximalanzahl der Mitteilnehmenden erreicht. Mich freut es aber, dass du so viele Freunde hast!",
            invalidCreateAdditionalAuditLogCall:
                "Dev: Ungültiger Aufruf von createAdditionalAuditLog. Genau einer der Werte defaultRemoteState oder defaultUnsureState muss true sein.",
        },
    },

    meetupDelete: {
        confirmEmbedTitle: "❗ Meetup Löschbestätigung ❗",
        confirmEmbedDescription: "Möchtest du wirklich das folgende Meetup löschen?",

        confirm: "Ja, möchte ich!",
        cancel: "Nein, habs mir doch anders überlegt....",
    },

    meetupDeleteCancel: {
        success: "Na gut, dann löschen wir das Meetup eben nicht...",
    },

    meetupDeleteConfirm: {
        success: "Das Meetup wurde erfolgreich gelöscht!",
    },

    meetupRemoveParticipant: {
        notParticipant: "Du bist in diesem Meetup nicht als Teilnehmer markiert. Verdrückt?",
    },

    showAllParticipants: {
        show: "Alle Teilnehmer anzeigen",
        previousPage: "Vorherige Seite",
        nextPage: "Nächste Seite",
    },
} satisfies PartialTranslationObject<typeof buttonEn>;

export default button;
