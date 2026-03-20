import { tCommand } from "../i18n";
import { MeetupCommand } from "./MeetupCommand";

/**
 * Alias for meetup command
 */

export class PollCommand extends MeetupCommand {
    name: string = "poll";

    protected get description(): string {
        return tCommand("poll.description");
    }
}
