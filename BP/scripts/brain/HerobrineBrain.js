import { MemoryManager } from "./MemoryManager.js";
import { Personality } from "./Personality.js";
import { DecisionEngine } from "./DecisionEngine.js";
import { TerrorDirector } from "./TerrorDirector.js";
import * as States from "../states/index.js";

export class HerobrineBrain {
    constructor(systems) {
        this.systems = systems;
        
        this.memoryManager = new MemoryManager();
        this.memoryManager.loadMemories();

        this.personality = new Personality();
        this.terrorDirector = new TerrorDirector(systems.worldSystem);
        this.decisionEngine = new DecisionEngine(systems.worldSystem, systems.playerTracker, this.terrorDirector);
        
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

    setVisualState(stateName) {
        const entity = this.systems.spawnSystem.activeEntity;
        if (!entity || !entity.isValid()) return;

        const stateMap = {
            "default": 0,
            "quiet_stare": 1,
            "tilt_head": 2,
            "slow_walk": 3,
            "run": 4,
            "teleport_fade": 5
        };

        const stateInt = stateMap[stateName] !== undefined ? stateMap[stateName] : 0;
        try {
            entity.setProperty("antigravity:state", stateInt);
        } catch (e) {
            console.warn("[HerobrineAI] Error setting visual state: " + e);
        }
    }

    forceEscape(attacker = null) {
        if (this.currentState.constructor.name === "LeavingState") return; // Ya está huyendo
        
        const playerToScare = attacker || this.targetPlayer;
        if (playerToScare) {
            this.systems.eventSystem.addFear(playerToScare, 20, "Atacó a Herobrine");
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