/**
 * Command for changing the language of the bot
 */
import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    MessageFlags
} from "discord.js";
import i18next from "i18next";
import {registerCommands} from "../event/clientReady";
import {foundLanguages, tCommand} from "../i18n";
import {assertMeetupCreateChannelUsed} from "../permission/assertMeetupCreateChannelUsed";
import {assertUserHasMeetupConfigRole} from "../permission/assertUserHasMeetupConfigRole";
import {postSuccess} from "../util/postEmbeds";
import {AbstractCommand} from "./AbstractCommand";

export class ChangeLanguageCommand extends AbstractCommand {
    name: string = "change_language";

    protected get description(): string {
        return tCommand("changeLanguage.description");
    }

    protected get options(): APIApplicationCommandOption[] {
        return [
            {
                name: "locale",
                description: tCommand("changeLanguage.option.localeDescription"),
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ];
    }

    protected async checkPermissions(interaction: ChatInputCommandInteraction): Promise<void> {
        assertMeetupCreateChannelUsed(interaction);
        assertUserHasMeetupConfigRole(interaction);
    }

    protected async checkOptions(interaction: ChatInputCommandInteraction): Promise<void> {
        //check locale
        const locale = interaction.options.getString("locale")?.trim().toLocaleLowerCase();

        if (!locale || !foundLanguages.includes(locale)) {
            throw new Error(tCommand("changeLanguage.error.invalidLocale"));
        }

        this.sanitizedInputs = {
            locale
        }
    }

    protected async run(interaction: ChatInputCommandInteraction): Promise<void> {
        //post defer reply to prevent timeout errors
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const { locale } = this.sanitizedInputs;

        await i18next.changeLanguage(locale);

        await registerCommands();

        //create success embed
        await postSuccess(interaction, tCommand("changeLanguage.success.languageChanged", {locale: locale}));
    }
}