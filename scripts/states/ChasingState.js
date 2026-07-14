export class ChasingState {
    constructor(brain) { this.brain = brain; }
    enter() { console.warn("[HerobrineAI] -> ChasingState (Persiguiendo)"); }
    execute() {}
    exit() {}
}