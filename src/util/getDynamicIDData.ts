import {dynamicIdRegExp} from "../constant/dynamicIdRegExp";

export function getDynamicData(customId: string): string {
    let dynamicData: string = "";
    const matches = customId.match(dynamicIdRegExp);
    if (matches) {
        dynamicData = matches[2];
    }

    return dynamicData;
}