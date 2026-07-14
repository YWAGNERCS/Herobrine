import { ScareAction } from "../actions/ScareAction.js";

export class EventState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> EventState (Invocando evento)"); 
        if (this.brain.targetPlayer) {
            ScareAction.execute(this.brain, this.brain.targetPlayer);
        }
    }
    execute() {}
    exit() {}
}