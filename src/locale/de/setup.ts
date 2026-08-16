import { PartialTranslationObject } from "../../i18n";
import type setupEn from "../en/setup";

const setup = {
    error: {
        interactionGeneral: "Fehler beim Verarbeiten der Interaktion.",
        interactionCommand: "Fehler beim Ausführen des Befehls.",
        interactionModal: "Fehler beim Verarbeiten des Modals.",
        interactionButton: "Fehler beim Ausführen der Funktion des Buttons.",
    },
} satisfies PartialTranslationObject<typeof setupEn>;

export default setup;
