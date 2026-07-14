import { MemoryManager } from "./MemoryManager.js";
import { Personality } from "./Personality.js";
import { DecisionEngine } from "./DecisionEngine.js";
import * as States from "../states/index.js";

export class HerobrineBrain {
    constructor(systems) {
        this.systems = systems;
        
        this.memoryManager = new MemoryManager();
        this.memoryManager.loadMemories();

        this.personality = new Personality();
        this.decisionEngine = new DecisionEngine(systems.worldSystem, systems.playerTracker);
        
        this.targetPlayer = null;
        this.currentState = new States.IdleState(this);
        
        this.systems.eventSystem.setBrain(this);
    }

    getMemory(player) {
        return this.memoryManager.getMemory(player);
    }

    saveMemories() {
        this.memoryManager.saveMemories();
    }

    changeState(newState) {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter();
        
        if (this.targetPlayer) {
            const mem = this.getMemory(this.targetPlayer);
            mem.behavior.lastState = newState.constructor.name;
            this.saveMemories();
        }
    }

    tick(players) {
        if (players.length === 0) return;

        if (!this.targetPlayer || Math.random() < 0.01) {
            this.targetPlayer = players[Math.floor(Math.random() * players.length)];
        }

        const memory = this.getMemory(this.targetPlayer);

        const nextState = this.decisionEngine.evaluate(memory, this.personality, this);
        if (nextState) {
            this.changeState(nextState);
        }

        this.currentState.execute();
    }
}