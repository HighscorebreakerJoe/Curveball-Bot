import { getMeetupByMeetupID } from "../database/table/Meetup";
import { getParticipantData } from "../util/meetup/createMeetupInfoEmbed";
import { ParticipantData } from "../util/meetup/editMeetupInfoEmbed";
import { createKeyedDebouncedQueue } from "../util/scheduler/createKeyedDebouncedQueue";
import { uiManager } from "./UIManager";

/**
 * Central manager for scheduling and coordinating debounced UI updates.
 * Uses a keyed scheduler to prevent race conditions and batch frequent updates.
 */

class ScheduleManager {
    private scheduler = createKeyedDebouncedQueue(1500);

    /**
     * Schedules meetup list reset
     */
    public scheduleResetMeetupList() {
        this.scheduler.schedule("reset-meetup-list", async () => {
            await uiManager.resetMeetupListChannel();
        });
    }

    /**
     * Schedules embed-info and participant list update of a specific meetup
     */
    public scheduleUpdateMeetupInfo(
        meetupID: number) {
        this.scheduler.schedule(`update-meetup-info-${meetupID}`, async () => {
            const meetup = await getMeetupByMeetupID(meetupID);

            if (!meetup) {
                return;
            }

            const participantData: ParticipantData[] = await getParticipantData(meetupID);

            await uiManager.updateMeetupInfoEmbed(meetup, participantData);
            await uiManager.updateParticipantList(meetup, participantData);
        });
    }
}

//export as singleton
export const scheduleManager = new ScheduleManager();