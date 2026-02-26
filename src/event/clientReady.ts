import {
    ActivityType,
    Client,
    Events,
    REST,
    RESTPostAPIApplicationCommandsJSONBody,
    Routes,
} from "discord.js";
import { loadGuild } from "../cache/guild";
import { loadMeetupAllowedMentionsRoles } from "../cache/meetupAllowedMentionsRoles";
import { loadMeetupChannels } from "../cache/meetupChannels";
import { setupDailyCleanupCronjob } from "../cronjob/dailyCleanup";
import { setupHourlyCleanupCronjob } from "../cronjob/hourlyCleanup";
import env from "../env";
import { tSetup } from "../i18n";
import { commandsMap } from "../map/commandsMap";

export default function onClientReady(client: Client): void {
    client.on(Events.ClientReady, async () => {
        if (!client.user || !client.application) {
            console.error(tSetup("error.loginFailed"));
            return;
        }

        client.user.setActivity({
            name: tSetup("client.activity"),
            type: ActivityType.Playing,
        });
        console.log(tSetup("client.loginMessage", { tag: client.user.tag }));

        //load cache data
        await loadGuild();
        await loadMeetupAllowedMentionsRoles();
        await loadMeetupChannels();

        //register cronjobs
        if (!env.DISABLE_CRONJOBS) {
            await setupHourlyCleanupCronjob();
            await setupDailyCleanupCronjob();
        }

        //register commands
        const commandJSONs: RESTPostAPIApplicationCommandsJSONBody[] = [];

        for (const command of commandsMap.values()) {
            const tmpInstance = new command();
            commandJSONs.push(tmpInstance.buildSlashCommandJSON());
        }

        const rest: REST = new REST({ version: "10" }).setToken(env.BOT_TOKEN);

        try {
            await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), {
                body: commandJSONs,
            });
            console.log(tSetup("step.registeredCommands"));
        } catch (error) {
            console.error(tSetup("error.registerCommands"), error);
        }
    });
}
