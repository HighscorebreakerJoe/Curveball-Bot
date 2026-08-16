import { PartialTranslationObject } from "../../i18n";
import type commonEn from "../en/common";

const common = {
    edit: "Bearbeiten",
    delete: "Löschen",
    unknown: "Unbekannt",

    successDefaultEmbedTitle: "Hurra!",
    errorDefaultEmbedTitle: "Fehler...",

    defaultCreateReason: "Automatisch erstellt",
    defaultDeleteReason: "Automatisch gelöscht",
    defaultAssignReason: "Automatisch zugewiesen",
    defaultRemoveReason: "Automatisch entfernt",

    error: {
        unknown: "Unbekannter Fehler",
        notANumber: "Wert ist keine gültige Zahl: {{var}}",
        linkDetected: "Hey, bitte keine Links posten!",
    },
} satisfies PartialTranslationObject<typeof commonEn>;

export default common;
