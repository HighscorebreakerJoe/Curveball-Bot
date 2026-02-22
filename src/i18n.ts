import i18next, {i18n} from "i18next";
import * as fs from "node:fs";
import path from "path";
import env from "./env";

const namespaces: string[] = ["common", "modal"];
type Namespace = typeof namespaces[number];
type InitResource = Record<string, Record<string, any>>;
type translationParams = Record<string, string | number | boolean>;

export interface TranslationObject {
    [key: string]: string | TranslationObject;
}

export async function initI18n(): Promise<i18n> {
    await i18next
        .init({
            lng: env.LANGUAGE,
            fallbackLng: "en",

            ns: namespaces,
            defaultNS: "common",

            //debug: true,
            showSupportNotice: false,

            resources: getLocaleResources(),
            interpolation: {
                escapeValue: false
            }
        });

    return i18next;
}

export function t(key: string, namespace: string = "common", params?: translationParams): string{
    return i18next.t(key,{
        ns: namespace,
        ...params
    })
}

export function tCommon(key: string, params?: translationParams): string{
    return t(key, "common", params);
}

export function tModal(key: string, params?: translationParams): string{
    return t(key, "modal", params);
}

function getLocaleResources(): InitResource{
    const resources: InitResource = {};

    const localeDir: string = path.join(__dirname, "locale");

    //get all language files from locale folder
    for(const lang of  fs.readdirSync(localeDir)){
        const langDir: string = path.join(localeDir, lang);
        if (!fs.statSync(langDir).isDirectory()){
            continue;
        }

        resources[lang] = {} as Record<Namespace, any>;

        for (const name of namespaces) {
            const file: string = path.join(langDir, `${name}.js`);
            if (!fs.existsSync(file)){
                continue;
            }

            resources[lang][name] = require(file).default;
        }
    }

    return resources;
}

export default i18next;