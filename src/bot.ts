import { client } from "./client";
import { migrateToLatest } from "./database/Migrate";
import env from "./env";
import onClientReady from "./event/clientReady";
import onInteractionCreate from "./event/interactionCreate";
import onMessageDelete from "./event/messageDelete";
import { initI18n } from "./i18n";
import { logger } from "./logger";

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

main().catch((mainError) => {
    logger.fatal({ err: mainError }, "Error executing the bot.");
    process.exit(1);
});
