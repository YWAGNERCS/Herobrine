import { IdleState } from "./IdleState.js";

export class LeavingState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> LeavingState"); 
        this.ticks = 0;
    }
    execute() {
        this.ticks++;
        if (this.ticks > 10) {
            this.brain.changeState(new IdleState(this.brain));
        }
    }
    exit() {}
}