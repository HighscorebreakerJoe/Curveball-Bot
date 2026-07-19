import { Generated, InsertResult, Selectable } from "kysely";
import { AuditLogAction } from "../../constant/auditLogAction";
import env from "../../env";
import { Database, db } from "../Database";

export interface AuditLog {
    auditLogID: Generated<number>;
    action: AuditLogAction;
    userID: string | null;
    meetupID: number | null;
    additionalInformation: string | null;
    createTime: Generated<Date | null>;
}

export type AuditLogRow = Selectable<Database["audit_log"]>;

export async function createAuditLog(
    action: AuditLogAction,
    options?: {
        userID?: string;
        meetupID?: number;
        additionalInformation?: string;
    },
): Promise<InsertResult|undefined> {
    if (env.DISABLE_AUDIT_LOG) {
        return;
    }

    return ( await db
        .insertInto("audit_log")
        .values({
            action,
            userID: options?.userID ?? null,
            meetupID: options?.meetupID ?? null,
            additionalInformation: options?.additionalInformation ?? null,
        })
        .executeTakeFirst()
    )
}