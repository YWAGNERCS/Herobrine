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

    forceEscape() {
        if (this.targetPlayer) {
            const mem = this.getMemory(this.targetPlayer);
            mem.player.fearLevel += 20; // Huir da más miedo
            this.saveMemories();
        }
        
        // Limpiar objetivo actual del motor de decisiones
        this.decisionEngine.currentGoal = null;
        
        // Cambiar a LeavingState
        this.changeState(new States.LeavingState(this));
    }

    tick(players) {
        if (players.length === 0) return;

        if (!this.targetPlayer || Math.random() < 0.01) {
            this.targetPlayer = players[Math.floor(Math.random() * players.length)];
        }

        const memory = this.getMemory(this.targetPlayer);

        // Fear decay: -1 fear every ~60 seconds (1200 ticks, we tick every 20 ticks so roughly 60 calls)
        if (!this.tickCount) this.tickCount = 0;
        this.tickCount++;
        if (this.tickCount % 60 === 0) {
            if (memory.player.fearLevel > 0) {
                memory.player.fearLevel--;
                this.saveMemories();
            }
        }

        const nextState = this.decisionEngine.evaluate(memory, this.personality, this);
        if (nextState) {
            this.changeState(nextState);
        }

        this.currentState.execute();
    }
}