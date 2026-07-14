import { StalkAction } from "../actions/StalkAction.js";

export class StalkingState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> StalkingState"); 
        if (this.brain.targetPlayer) {
            StalkAction.execute(this.brain, this.brain.targetPlayer);
        }
    }
    execute() {}
    exit() {}
}