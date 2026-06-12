import { db } from "../database/Database";
import env from "../env";

/**
 * Function for deleting old modal input drafts
 */

export async function deleteOldModalInputDrafts(): Promise<void> {
    //detect old modal input drafts
    const dateNow = new Date();
    const deleteLimitHours: number = 3600000 * env.MODAL_INPUT_DRAFT_DELETE_LIMIT_HOURS;
    const deleteLimitDate = new Date(dateNow.getTime() - deleteLimitHours);

    await db
        .deleteFrom("modal_input_draft")
        .where("createTime", "<", deleteLimitDate)
        .execute();
}
