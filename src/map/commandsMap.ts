import { AbstractCommand } from "../command/AbstractCommand";
import { MeetupAddMentionRoleCommand } from "../command/MeetupAddMentionRole";
import { MeetupCleanUpCommand } from "../command/MeetupCleanUpCommand";
import { MeetupCommand } from "../command/MeetupCommand";
import { MeetupRemoveMentionRoleCommand } from "../command/MeetupRemoveMentionRole";
import { NoticeCreateCommand } from "../command/NoticeCreateCommand";
import { NoticeEditCommand } from "../command/NoticeEditCommand";
import { PollCommand } from "../command/PollCommand";
import { PostMeetupCreateNoticesCommand } from "../command/PostMeetupCreateNotices";

const commandClasses: Array<new () => AbstractCommand> = [
    MeetupCommand,
    MeetupAddMentionRoleCommand,
    MeetupRemoveMentionRoleCommand,
    MeetupCleanUpCommand,
    NoticeCreateCommand,
    NoticeEditCommand,
    PollCommand,
    PostMeetupCreateNoticesCommand,
];

export const commandsMap = new Map<string, new () => AbstractCommand>();

for (const CommandClass of commandClasses) {
    const tmpInstance = new CommandClass();
    commandsMap.set(tmpInstance.name, CommandClass);
}
