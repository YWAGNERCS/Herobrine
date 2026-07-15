import { WorldManipulation } from "../actions/WorldManipulation.js";

export class ManipulateState {
    constructor(brain, actionType = "subtleSounds") { 
        this.brain = brain; 
        this.actionType = actionType;
    }
    
    enter() { 
        console.warn(`[HerobrineAI] -> ManipulateState (Acción: ${this.actionType})`);
        if (this.brain.targetPlayer) {
            const player = this.brain.targetPlayer;
            const rm = this.brain.realityManager;

            // Mapeo dinámico de subgoals a métodos de WorldManipulation
            if (this.actionType === "ManipulateEnvironment") {
                if (Math.random() < 0.5) WorldManipulation.stripLeaves(player, rm);
                else WorldManipulation.openDoors(player, rm);
            } 
            else if (this.actionType === "SpawnSounds") {
                WorldManipulation.subtleSounds(player);
            }
            else if (this.actionType === "ApplyBlindness" || this.actionType === "LocalFog") {
                WorldManipulation.localFog(player);
            }
            else if (this.actionType === "BuildPyramid") {
                WorldManipulation.buildPyramid(player, rm);
            }
            else if (this.actionType === "DigTunnel") {
                WorldManipulation.digTunnel(player, rm);
            }
            else if (this.actionType === "RemoveTorch") {
                WorldManipulation.removeTorch(player, rm);
            }
            else {
                WorldManipulation.subtleSounds(player);
            }
        }
    }
    execute() {}
    exit() {}
}