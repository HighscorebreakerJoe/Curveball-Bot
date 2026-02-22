/**
 * Alias for meetup command
 */
import {Locale} from "discord.js";
import {tCommand} from "../i18n";
import {MeetupCommand} from "./MeetupCommand";

export class PollCommand extends MeetupCommand {
    name: string = "poll";

    protected get description(): string {
        return tCommand("poll.description");
    }
}