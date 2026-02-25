import {client} from "./client";
import {migrateToLatest} from "./database/Migrate";
import env from "./env";
import onClientReady from "./event/clientReady";
import onInteractionCreate from "./event/interactionCreate";
import onMessageDelete from "./event/messageDelete";
import {initI18n} from "./i18n";


async function main(): Promise<void> {
    //language
    await initI18n();

    //db migration
    await migrateToLatest();

    //events
    onClientReady(client);
    onInteractionCreate(client);
    onMessageDelete(client);

    //login
    await client.login(env.BOT_TOKEN);
}

main().catch(mainError => {
    console.error(mainError);
    process.exit(1);
});