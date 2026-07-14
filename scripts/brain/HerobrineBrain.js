import { Memory } from "./Memory.js";
import { Personality } from "./Personality.js";
import { DecisionEngine } from "./DecisionEngine.js";
import { IdleState } from "../states/IdleState.js";

export class HerobrineBrain {
    constructor(systems) {
        this.systems = systems; // { worldSystem, playerTracker, spawnSystem, soundSystem, eventSystem }
        this.memories = new Map(); // Mapa de playerName -> Memory
        this.personality = new Personality();
        this.decisionEngine = new DecisionEngine(systems.worldSystem, systems.playerTracker);
        
        this.targetPlayer = null;
        this.currentState = new IdleState(this);
    }

    getMemory(player) {
        if (!this.memories.has(player.name)) {
            this.memories.set(player.name, new Memory(player.name));
        }
        return this.memories.get(player.name);
    }

    changeState(newState) {
        if (this.currentState) {
            this.currentState.exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }

    tick(players) {
        if (players.length === 0) return;

        // Seleccionar un target actual si no hay o si se quiere cambiar
        if (!this.targetPlayer || Math.random() < 0.01) {
            this.targetPlayer = players[Math.floor(Math.random() * players.length)];
        }

        const memory = this.getMemory(this.targetPlayer);

        // El motor evalúa si hay que cambiar de estado
        const nextState = this.decisionEngine.evaluate(memory, this.personality, this);
        if (nextState) {
            this.changeState(nextState);
        }

        // Ejecutar el estado actual
        this.currentState.execute();
    }
}