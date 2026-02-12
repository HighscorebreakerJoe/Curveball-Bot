/**
 * Command for creating meetups
 */
import {
    APIApplicationCommandOption,
    APIRole,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Locale,
    Role,
    roleMention
} from "discord.js";
import {modalsMap} from "../maps/modalsMap";
import {assertMeetupCreateChannelUsed} from "../permissions/assertMeetupCreateChannelUsed";
import {AbstractCommand} from "./AbstractCommand";

export class MeetupCommand extends AbstractCommand {
    name: string = "meetup";

    description: string = "Creates a Meetup";
    localizedDescriptions = {
        [Locale.German]: "Erstellt einen Meetup"
    };

    options: APIApplicationCommandOption[] = [
        {
            name: "role1",
            description: "The first role which will be notified in your meetup",
            description_localizations: {
                [Locale.German]: "Die erste Rolle, die in dem Meetup benachrichtigt werden soll"
            },
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: "role2",
            description: "The second role which will be notified in your meetup",
            description_localizations: {
                [Locale.German]: "Die zweite Rolle, die in dem Meetup benachrichtigt werden soll"
            },
            type: ApplicationCommandOptionType.Role,
            required: false
        },
        {
            name: "role3",
            description: "The third role which will be notified in your meetup",
            description_localizations: {
                [Locale.German]: "Die dritte Rolle, die in dem Meetup benachrichtigt werden soll"
            },
            type: ApplicationCommandOptionType.Role,
            required: false
        }
    ];

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
    }

    protected async checkOptions(interaction: ChatInputCommandInteraction): Promise<void> {
        //check roles
        const role1 = interaction.options.getRole("role1");
        this.checkRole(role1);

        const role2 = interaction.options.getRole("role2");
        this.checkRole(role2);

        const role3 = interaction.options.getRole("role3");
        this.checkRole(role3);

        this.sanitizedInputs = {
            role1: role1,
            role2: role2,
            role3: role3
        }
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //show modal
        const MeetupCreateModalClass = modalsMap.get("meetup_create");
        if (!MeetupCreateModalClass) {
            return;
        }

        const createMeetupModal = new MeetupCreateModalClass();
        await createMeetupModal.execute(interaction);
    }

    private checkRole(role: Role| APIRole | null): void{
        if (role && !role.mentionable) {
            throw new Error(`Die Rolle ${roleMention(role.id)} kann nicht erwähnt werden.`);
        }
    }
}