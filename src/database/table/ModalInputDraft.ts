import { DeleteResult, Generated, Selectable } from "kysely";
import { Database, db } from "../Database";

export interface ModalInputDraft {
    userID: string;
    draftCustomID: string;
    formData: string; //json

    createTime: Generated<Date | null>;
}

export type ModalInputDraftRow = Selectable<Database["modal_input_draft"]>;

export async function getModalInputDrafts(userID: string, draftCustomID: string): Promise<ModalInputDraftRow | undefined> {
    return (await db
        .selectFrom("modal_input_draft")
        .selectAll()
        .where("userID", "=", userID)
        .where("draftCustomID", "=", draftCustomID)
        .executeTakeFirst()) as ModalInputDraftRow | undefined;
}

export async function deleteModalInputDrafts(
    userIDs: string[],
    draftCustomID: string,
): Promise<DeleteResult[]> {
    return await db.deleteFrom("modal_input_draft")
        .where("userID", "in", userIDs)
        .where("draftCustomID", "=", draftCustomID)
        .execute();
}
