/**
 * Command for creating meetups
 */
import {
    APIApplicationCommandOption,
    APIRole,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Role,
} from "discord.js";
import { tCommand } from "../i18n";
import { modalsMap } from "../map/modalsMap";
import { assertMeetupCreateChannelUsed } from "../permission/assertMeetupCreateChannelUsed";
import { AbstractCommand } from "./AbstractCommand";

export class MeetupCommand extends AbstractCommand {
    name: string = "meetup";

    protected get description(): string {
        return tCommand("meetup.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [
            {
                name: "role1",
                description: tCommand("meetup.option.role1Description"),
                type: ApplicationCommandOptionType.Role,
                required: false,
            },
            {
                name: "role2",
                description: tCommand("meetup.option.role2Description"),
                type: ApplicationCommandOptionType.Role,
                required: false,
            },
            {
                name: "role3",
                description: tCommand("meetup.option.role3Description"),
                type: ApplicationCommandOptionType.Role,
                required: false,
            },
        ];
    }

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
            role3: role3,
        };
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

    private checkRole(role: Role | APIRole | null): void {
        if (role && !role.mentionable) {
            throw new Error(tCommand("meetup.error.roleNotMentionable", { roleID: role.id }));
        }
    }
}
