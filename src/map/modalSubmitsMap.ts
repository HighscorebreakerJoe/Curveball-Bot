import { AbstractModalSubmit } from "../modal/submit/AbstractModalSubmit";
import { MeetupCreateModalSubmit } from "../modal/submit/MeetupCreateModalSubmit";
import { MeetupEditModalSubmit } from "../modal/submit/MeetupEditModalSubmit";

const modalSubmitClasses: Array<new () => AbstractModalSubmit> = [
    MeetupCreateModalSubmit,
    MeetupEditModalSubmit,
];

export const modalSubmitsMap = new Map<string, new () => AbstractModalSubmit>();

for (const ModalSubmitClass of modalSubmitClasses) {
    const tmpInstance = new ModalSubmitClass();
    modalSubmitsMap.set(tmpInstance.customId, ModalSubmitClass);
}
