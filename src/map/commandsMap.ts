import {AbstractCommand} from "../command/AbstractCommand";
import {MeetupAddMentionRoleCommand} from "../command/MeetupAddMentionRole";
import {MeetupCleanUpCommand} from "../command/MeetupCleanUpCommand";
import {MeetupCommand} from "../command/MeetupCommand";
import {MeetupRemoveMentionRoleCommand} from "../command/MeetupRemoveMentionRole";
import {PollCommand} from "../command/PollCommand";

const commands: AbstractCommand[] = [
    new MeetupCommand(),
    new MeetupAddMentionRoleCommand(),
    new MeetupRemoveMentionRoleCommand(),
    new MeetupCleanUpCommand(),
    new PollCommand()
];

export const commandsMap: Map<string,  AbstractCommand> = new Map();
for (const cmd of commands) {
    commandsMap.set(cmd.name, cmd);
}

export default commandsMap;