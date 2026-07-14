import { InvestigateAction } from "../actions/InvestigateAction.js";

export class InvestigatingState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> InvestigatingState"); 
        if (this.brain.targetPlayer) {
            InvestigateAction.execute(this.brain, this.brain.targetPlayer);
        }
    }
    execute() {}
    exit() {}
}