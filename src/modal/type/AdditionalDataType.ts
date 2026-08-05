import { Message } from "discord.js";
import { MeetupRow } from "../../database/table/Meetup";

export type AdditionalDataValue = string | string[] | number | boolean | null | Message | MeetupRow;

export type AdditionalDataRecord = Record<string, AdditionalDataValue>;
