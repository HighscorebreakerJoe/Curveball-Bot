import {client} from "./client";
import env from "./env";
import onClientReady from "./event/clientReady";
import onInteractionCreate from "./event/interactionCreate";

//events
onClientReady(client);
onInteractionCreate(client);

//login
client.login(env.BOT_TOKEN);