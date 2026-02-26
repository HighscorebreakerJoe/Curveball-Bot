import { AbstractButton } from "../button/AbstractButton";
import { MeetupAddParticipantButton } from "../button/MeetupAddParticipantButton";
import { MeetupDeleteButton } from "../button/MeetupDeleteButton";
import { MeetupDeleteCancelButton } from "../button/MeetupDeleteCancelButton";
import { MeetupDeleteConfirmButton } from "../button/MeetupDeleteConfirmButton";
import { MeetupEditButton } from "../button/MeetupEditButton";
import { MeetupRemoteParticipantButton } from "../button/MeetupRemoteParticipantButton";
import { MeetupRemoveParticipantButton } from "../button/MeetupRemoveParticipantButton";
import { MeetupUnsureParticipantButton } from "../button/MeetupUnsureParticipantButton";

const buttonClasses: Array<new () => AbstractButton> = [
    MeetupAddParticipantButton,
    MeetupRemoveParticipantButton,
    MeetupUnsureParticipantButton,
    MeetupRemoteParticipantButton,
    MeetupEditButton,
    MeetupDeleteButton,
    MeetupDeleteConfirmButton,
    MeetupDeleteCancelButton,
];

export const buttonsMap = new Map<string, new () => AbstractButton>();

for (const ButtonClass of buttonClasses) {
    const tmpInstance = new ButtonClass();
    buttonsMap.set(tmpInstance.customId, ButtonClass);
}
