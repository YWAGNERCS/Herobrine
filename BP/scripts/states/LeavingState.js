import { IdleState } from "./IdleState.js";
import { EscapeAction } from "../actions/EscapeAction.js";

export class LeavingState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> LeavingState"); 
        EscapeAction.execute(this.brain);
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