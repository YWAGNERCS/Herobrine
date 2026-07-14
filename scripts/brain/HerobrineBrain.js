import { MemoryManager } from "./MemoryManager.js";
import { Personality } from "./Personality.js";
import { DecisionEngine } from "./DecisionEngine.js";
import { IdleState } from "../states/IdleState.js";

export class HerobrineBrain {
    constructor(systems) {
        this.systems = systems;
        
        this.memoryManager = new MemoryManager();
        this.memoryManager.loadMemories(); // Cargar memoria persistente

        this.personality = new Personality();
        this.decisionEngine = new DecisionEngine(systems.worldSystem, systems.playerTracker);
        
        this.targetPlayer = null;
        this.currentState = new IdleState(this);
        
        // Conectar el cerebro al EventSystem
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
        
        // Guardar estado actual en memoria
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