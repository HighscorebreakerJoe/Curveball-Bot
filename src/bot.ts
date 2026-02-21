import {client} from "./client";
import {migrateToLatest} from "./database/Migrate";
import env from "./env";
import onClientReady from "./event/clientReady";
import onInteractionCreate from "./event/interactionCreate";
import {initI18n} from "./i18n";


async function main() {
    //db migration
    await migrateToLatest();

    //language
    await initI18n();

    //events
    onClientReady(client);
    onInteractionCreate(client);

    //login
    await client.login(env.BOT_TOKEN);
}

main().catch(mainError => {
    console.error(mainError);
    process.exit(1);
});