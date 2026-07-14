import { State } from "./State.js";
import { EscapeAction } from "../actions/EscapeAction.js";
import { IdleState } from "./IdleState.js";

export class ChasingState extends State {
    constructor(brain) {
        super(brain);
        this.ticks = 0;
        this.duration = 20 * 15; // Persigue lentamente por 15 segundos máximo
    }

    enter() {
        console.warn("[HerobrineAI] -> ChasingState (Nivel 4: Terror Psicológico)");
        this.brain.setVisualState("slow_walk");
        
        const entity = this.brain.systems.spawnSystem.activeEntity;
        if (entity && entity.isValid()) {
            try {
                // Stalk behavior (follows player without attacking)
                entity.triggerEvent("antigravity:start_stalking"); 
            } catch(e) {}
        }
    }

    execute() {
        this.ticks++;

        if (!this.brain.targetPlayer || !this.brain.systems.spawnSystem.activeEntity) {
            this.brain.forceEscape();
            return;
        }

        const entity = this.brain.systems.spawnSystem.activeEntity;
        const dist = this.brain.getDistanceToTarget();

        // Mirar fijamente
        const targetLoc = this.brain.targetPlayer.location;
        try {
            entity.teleport(entity.location, { facingLocation: { x: targetLoc.x, y: targetLoc.y + 1.5, z: targetLoc.z } });
        } catch(e) {}

        // Si se acerca demasiado (tensión extrema), desaparece antes de tocarlo
        if (dist < 4) {
            console.warn("[HerobrineAI] ChasingState: Demasiado cerca. Desvaneciendo.");
            this.brain.forceEscape(this.brain.targetPlayer);
            return;
        }

        if (this.ticks >= this.duration) {
            this.brain.forceEscape(this.brain.targetPlayer);
        }
    }

    exit() {
    }
}