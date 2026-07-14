import { IdleState } from "./IdleState.js";
import { EscapeAction } from "../actions/EscapeAction.js";

export class LeavingState {
    constructor(brain) { this.brain = brain; }
    enter() { 
        console.warn("[HerobrineAI] -> LeavingState"); 
        this.brain.setVisualState("teleport_fade");
        
        // Stop vanilla AI behaviors (attacking, moving)
        const entity = this.brain.systems.spawnSystem.activeEntity;
        if (entity && entity.isValid()) {
            try {
                entity.triggerEvent("antigravity:stop_action");
            } catch(e) {}
        }
        
        // Efecto de cámara en JS ya que MoLang no puede hacer camerashake a un jugador
        if (this.brain.targetPlayer) {
            try {
                this.brain.targetPlayer.dimension.runCommand(`camerashake add "${this.brain.targetPlayer.name}" 0.5 1 positional`);
            } catch(e) {}
        }
        
        this.ticks = 0;
    }
    execute() {
        this.ticks++;
        if (this.ticks == 20) {
            // Dar tiempo (1 segundo) a que la animación termine antes de despawnear
            EscapeAction.execute(this.brain, this.brain.targetPlayer);
        }
        if (this.ticks > 25) {
            this.brain.changeState(new IdleState(this.brain));
        }
    }
    exit() {}
}