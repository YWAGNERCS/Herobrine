import { LeavingState } from "./LeavingState.js";
import { WatchAction } from "../actions/WatchAction.js";

export class WatchingState {
    constructor(brain) { this.brain = brain; }
    enter() {
        console.warn("[HerobrineAI] -> WatchingState");
        if (this.brain.targetPlayer) {
            WatchAction.execute(this.brain, this.brain.targetPlayer);
        }
        this.ticks = 0;
        this.brain.setVisualState("quiet_stare");
    }
    execute() {
        this.ticks++;
        // Aleatoriamente inclinar la cabeza si te está observando mucho tiempo
        if (this.ticks % 100 === 0 && Math.random() < 0.3) {
            this.brain.setVisualState("tilt_head");
        } else if (this.ticks % 140 === 0) {
            this.brain.setVisualState("quiet_stare"); // volver a la normalidad
        }
    }
    exit() {}
}