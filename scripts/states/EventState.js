export class EventState {
    constructor(brain) { this.brain = brain; }
    enter() { console.warn("[HerobrineAI] -> EventState (Invocando evento)"); }
    execute() {}
    exit() {}
}