import { world } from "@minecraft/server";

export class WorldSystem {
    constructor() {}
    isNight() {
        const timeOfDay = world.getTimeOfDay();
        return timeOfDay > 13000 && timeOfDay < 23000;
    }
}