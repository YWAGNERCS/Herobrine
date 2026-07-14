export class InvestigatingState {
    constructor(brain) { this.brain = brain; }
    enter() { console.warn("[HerobrineAI] -> InvestigatingState"); }
    execute() {}
    exit() {}
}