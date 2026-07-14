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
    }
    execute() {
        this.ticks++;
    }
    exit() {}
}