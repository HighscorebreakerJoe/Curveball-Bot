import i18next, { i18n } from "i18next";
import * as fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import env from "./env";

const namespaces = [
    "button",
    "command",
    "common",
    "cronjob",
    "meetup",
    "modal",
    "permission",
    "setup",
] as const;

type Namespace = (typeof namespaces)[number];
type TranslationParams = Record<string, string | number | boolean>;

type InitResource = Record<string, Partial<Record<Namespace, TranslationObject>>>;

// general translation object
export type TranslationObject = {
    [key: string]: string | TranslationObject;
};

// used for translations which do not fully cover the original english locales
export type PartialTranslationObject<T> = {
    [K in keyof T]?: T[K] extends object ? PartialTranslationObject<T[K]> : string;
};

export async function initI18n(): Promise<i18n> {
    await i18next.init({
        lng: env.LANGUAGE,
        fallbackLng: "en",

        ns: namespaces,
        defaultNS: "common",

        debug: env.ENABLE_I18NEXT_DEBUG,
        showSupportNotice: false,

        resources: await getLocaleResources(),

        interpolation: {
            escapeValue: false,
        },
    });

    return i18next;
}

export function t(
    key: string,
    namespace: Namespace = "common",
    params?: TranslationParams,
): string {
    return i18next.t(key, {
        ns: namespace,
        ...params,
    });
}

export function tButton(key: string, params?: TranslationParams): string {
    return t(key, "button", params);
}

export function tCommand(key: string, params?: TranslationParams): string {
    return t(key, "command", params);
}

export function tCommon(key: string, params?: TranslationParams): string {
    return t(key, "common", params);
}

export function tCronjob(key: string, params?: TranslationParams): string {
    return t(key, "cronjob", params);
}

export function tMeetup(key: string, params?: TranslationParams): string {
    return t(key, "meetup", params);
}

export function tModal(key: string, params?: TranslationParams): string {
    return t(key, "modal", params);
}

export function tPermission(key: string, params?: TranslationParams): string {
    return t(key, "permission", params);
}

export function tSetup(key: string, params?: TranslationParams): string {
    return t(key, "setup", params);
}

async function getLocaleResources(): Promise<InitResource> {
    const resources: InitResource = {};

    const localeDir: string = path.join(__dirname, "locale");

    //get all language files from locale folder
    for (const lang of fs.readdirSync(localeDir)) {
        const langDir: string = path.join(localeDir, lang);
        if (!fs.statSync(langDir).isDirectory()) {
            continue;
        }

        resources[lang] = {};

        for (const name of namespaces) {
            const file: string = path.join(langDir, `${name}.js`);
            if (!fs.existsSync(file)) {
                continue;
            }

            const module = await import(pathToFileURL(file).href);
            //TODO: replace this workaround with a better solution
            resources[lang][name] = module.default?.default ?? module.default;
        }
    }

    return resources;
}

export default i18next;
