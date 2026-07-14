import { LeavingState } from "./LeavingState.js";

export class WatchingState {
    constructor(brain) { this.brain = brain; }
    enter() {
        console.warn("[HerobrineAI] -> WatchingState");
        if (this.brain.targetPlayer) {
            this.brain.targetPlayer.sendMessage("§eSientes que te observan desde la oscuridad...");
            
            // Actualizar memoria
            const mem = this.brain.getMemory(this.brain.targetPlayer);
            mem.timesSeen++;
        }
        this.ticks = 0;
    }
    execute() {
        this.ticks++;
        if (this.ticks > 100) {
            // El estado por sí mismo puede terminar si toma mucho tiempo
            this.brain.changeState(new LeavingState(this.brain));
        }
    }
    exit() {}
}