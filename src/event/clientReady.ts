import {ActivityType, Client, Events, REST, RESTPostAPIApplicationCommandsJSONBody, Routes} from "discord.js";
import {loadGuild} from "../cache/guild";
import {loadMeetupAllowedMentionsRoles} from "../cache/meetupAllowedMentionsRoles";
import {loadMeetupChannels} from "../cache/meetupChannels";
import env from "../env";
import commandsMap from "../map/commandsMap";

export default function onClientReady(client: Client): void {
    client.on(Events.ClientReady, async () => {
        if(!client.user || !client.application){
            console.error("Login failed");
            return;
        }

        client.user.setActivity({
            name: "Pokémon GO",
            type: ActivityType.Playing
        })
        console.log(`Logged in as ${client.user.tag}`);

        //load cache data
        await loadGuild();
        await loadMeetupAllowedMentionsRoles();
        await loadMeetupChannels();

        await registerCommands();
    })
}

export async function registerCommands(): Promise<void>{
    //register commands
    const commandJSONs: RESTPostAPIApplicationCommandsJSONBody[] = [];

    for (const command of commandsMap.values()){
        commandJSONs.push(command.buildSlashCommandJSON())
    }

    const rest: REST = new REST({ version: "10" }).setToken(env.BOT_TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID),
            { body: commandJSONs }
        );
        console.log("Successfully registered commands.");
    } catch (error) {
        console.error("Error registering commands:", error);
    }
}