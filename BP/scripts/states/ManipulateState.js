import { WorldManipulation } from "../actions/WorldManipulation.js";

export class ManipulateState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> ManipulateState (Modificando mundo)");
        if (this.brain.targetPlayer) {
            const player = this.brain.targetPlayer;
            const rand = Math.random();
            if (rand < 0.2) {
                WorldManipulation.buildPyramid(player);
            } else if (rand < 0.4) {
                WorldManipulation.removeTorch(player);
            } else if (rand < 0.6) {
                WorldManipulation.openDoors(player);
            } else if (rand < 0.8) {
                WorldManipulation.weatherEvent(player);
            } else {
                WorldManipulation.blindnessEvent(player);
            }
        }
    }
    execute() {}
    exit() {}
}