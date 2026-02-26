import { AbstractCommand } from "../command/AbstractCommand";
import { MeetupAddMentionRoleCommand } from "../command/MeetupAddMentionRole";
import { MeetupCleanUpCommand } from "../command/MeetupCleanUpCommand";
import { MeetupCommand } from "../command/MeetupCommand";
import { MeetupRemoveMentionRoleCommand } from "../command/MeetupRemoveMentionRole";
import { PollCommand } from "../command/PollCommand";

const commandClasses: Array<new () => AbstractCommand> = [
    MeetupCommand,
    MeetupAddMentionRoleCommand,
    MeetupRemoveMentionRoleCommand,
    MeetupCleanUpCommand,
    PollCommand,
];

export const commandsMap = new Map<string, new () => AbstractCommand>();

for (const CommandClass of commandClasses) {
    const tmpInstance = new CommandClass();
    commandsMap.set(tmpInstance.name, CommandClass);
}
