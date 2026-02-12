import 'dotenv/config';

declare type envStruct = {
    BOT_TOKEN: string
    CLIENT_ID: string,
    GUILD_ID: string,
    MEETUP_CONFIGURATOR_ROLE_ID: string,
    MEETUP_CREATE_CHANNEL_ID: string,
    MEETUP_INFO_CHANNEL_ID: string,
    MEETUP_LIST_CHANNEL_ID: string,
    DB_HOST: string,
    DB_PORT: string,
    DB_USERNAME: string,
    DB_PASSWORD: string,
    DB_DATABASE: string,
}

const env: envStruct = {
    BOT_TOKEN: process.env.BOT_TOKEN || '',
    CLIENT_ID: process.env.CLIENT_ID  || '',
    GUILD_ID: process.env.GUILD_ID  || '',
    MEETUP_CONFIGURATOR_ROLE_ID: process.env.MEETUP_CONFIGURATOR_ROLE_ID  || '',
    MEETUP_CREATE_CHANNEL_ID: process.env.MEETUP_CREATE_CHANNEL_ID  || '',
    MEETUP_INFO_CHANNEL_ID: process.env.MEETUP_INFO_CHANNEL_ID  || '',
    MEETUP_LIST_CHANNEL_ID: process.env.MEETUP_LIST_CHANNEL_ID  || '',
    DB_HOST: process.env.DB_HOST  || '',
    DB_PORT: process.env.DB_PORT  || '',
    DB_USERNAME: process.env.DB_USERNAME  || '',
    DB_PASSWORD: process.env.DB_PASSWORD  || '',
    DB_DATABASE: process.env.DB_DATABASE  || '',
};

export default env;