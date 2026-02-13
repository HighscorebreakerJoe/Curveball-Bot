import {client} from "./client";
import env from "./env";
import onClientReady from "./event/clientReady";
import onInteractionCreate from "./event/interactionCreate";

//db migration
//TODO

//events
onClientReady(client);
onInteractionCreate(client);

//login
client.login(env.BOT_TOKEN);