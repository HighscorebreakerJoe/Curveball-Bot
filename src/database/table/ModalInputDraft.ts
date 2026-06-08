import { DeleteResult, Generated, Selectable } from "kysely";
import { Database, db } from "../Database";

export interface ModalInputDraft {
    userID: string;
    modalCustomID: string;
    formData: Record<string, unknown>;

    createTime: Generated<Date | null>;
}

export type ModalInputDraftRow = Selectable<Database["modal_input_draft"]>;

export async function getModalInputDrafts(userID: string, modalCustomID: string): Promise<ModalInputDraftRow[]> {
    return (await db
        .selectFrom("modal_input_draft")
        .selectAll()
        .where("userID", "=", userID)
        .where("modalCustomID", "=", modalCustomID)
        .execute()) as ModalInputDraftRow[];
}

export async function deleteModalInputDrafts(
    userIDs: string[],
    modalCustomID: string,
): Promise<DeleteResult[]> {
    return await db.deleteFrom("modal_input_draft")
        .where("userID", "in", userIDs)
        .where("modalCustomID", "=", modalCustomID)
        .execute();
}

