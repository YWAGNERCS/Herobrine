export class ManipulateState {
    constructor(brain) { this.brain = brain; }
    enter() { console.warn("[HerobrineAI] -> ManipulateState (Modificando mundo)"); }
    execute() {}
    exit() {}
}