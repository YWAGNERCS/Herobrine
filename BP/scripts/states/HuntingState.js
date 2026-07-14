import { AttackAction } from "../actions/AttackAction.js";

export class HuntingState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> HuntingState"); 
        if (this.brain.targetPlayer) {
            AttackAction.execute(this.brain, this.brain.targetPlayer);
        }
    }
    execute() {}
    exit() {}
}