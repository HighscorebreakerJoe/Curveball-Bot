/**
 * Alias for meetup command
 */
import {Locale} from "discord.js";
import {MeetupCommand} from "./MeetupCommand";

export class PollCommand extends MeetupCommand {
    name: string = "poll";

    description: string = "Creates a Meetup (Alias for /meetup)";
    localizedDescriptions = {
        [Locale.German]: "Erstellt einen Meetup (Alias für /meetup)"
    };
}