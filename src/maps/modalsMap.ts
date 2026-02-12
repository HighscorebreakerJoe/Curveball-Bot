import {AbstractModal} from "../modal/AbstractModal";
import {MeetupCreateModal} from "../modal/MeetupCreateModal";
import {MeetupEditModal} from "../modal/MeetupEditModal";

const modalClasses: Array<new () => AbstractModal> = [
    MeetupCreateModal,
    MeetupEditModal
];

export const modalsMap = new Map<string, new () => AbstractModal>();

for (const ModalClass of modalClasses) {
    const tmpInstance = new ModalClass();
    modalsMap.set(tmpInstance.customId, ModalClass);
}