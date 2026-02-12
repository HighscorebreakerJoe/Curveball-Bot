import {ButtonInteraction, ChatInputCommandInteraction} from "discord.js";
import {MeetupRow} from "../database/table/Meetup";
import {assertMeetupIDIsValid} from "../permissions/assertMeetupIDIsValid";
import {assertUserIsMeetupCreatorOrConfig} from "../permissions/assertUserIsMeetupCreatorOrConfig";
import {getDynamicData} from "../util/getDynamicIDData";
import {MeetupCreateModal} from "./MeetupCreateModal";

/**
 * Displays Edit Meetup Modal
 */

export class MeetupEditModal extends MeetupCreateModal{
    customId: string = "meetup_edit:{d}";
    modalTitle: string = "Meetup bearbeiten";

    protected async checkPermissions(interaction: ChatInputCommandInteraction|ButtonInteraction): Promise<void> {
        if(!interaction.isButton()){
            throw new Error("Falscher Interaktionstyp");
        }

        const meetupID: number = Number(getDynamicData(interaction.customId));
        const meetup: MeetupRow = await assertMeetupIDIsValid(meetupID);
        assertUserIsMeetupCreatorOrConfig(interaction, meetup, false);

        this.setAdditionalData({
            meetup: meetup
        });
    }

    protected setSubmitCustomId() {
        this.submitCustomId = "meetup_edit:" + this.additionalData.meetup.meetupID;
    }

    protected buildInputs() {
        const { pokemon, location, time, date, note } = super.buildInputs();

        const meetup = this.additionalData.meetup as MeetupRow;

        //set values
        pokemon.setValue(meetup.pokemon);
        location.setValue(meetup.location);

        const timeString = meetup.time.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });
        time.setValue(timeString);

        let dateString = meetup.time.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit"
        });
        if(dateString.endsWith(".")){
            dateString = dateString.slice(0, dateString.length - 1);
        }
        date.setValue(dateString);

        if(meetup.note){
            note.setValue(meetup.note);
        }

        return {
            pokemon: pokemon,
            location: location,
            time: time,
            date: date,
            note: note
        }
    }
}