export class IdleState {
    constructor(brain) { this.brain = brain; }
    enter() {
        console.warn("[HerobrineAI] -> IdleState");
    }
    execute() {
        // En Idle, simplemente incrementamos poco a poco el fearLevel (interés pasivo)
        if (this.brain.targetPlayer) {
            const mem = this.brain.getMemory(this.brain.targetPlayer);
            if (Math.random() < 0.05) {
                mem.fearLevel += 1;
            }
        }
    }
    exit() {}
}