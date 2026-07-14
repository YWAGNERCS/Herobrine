import { IdleState } from "../states/IdleState.js";
import { WatchingState } from "../states/WatchingState.js";

export class DecisionEngine {
    constructor(worldSystem, playerTracker) {
        this.worldSystem = worldSystem;
        this.playerTracker = playerTracker;
    }

    evaluate(memory, personality, brain) {
        // Lógica de decisión dinámica basada en el estado del mundo y la memoria
        
        // Si el jugador acaba de llegar, dale tiempo.
        // Simularemos un incremento de interés pasivo.
        let interest = memory.fearLevel + (memory.timesSeen * 2);
        
        const isNight = this.worldSystem.isNight();
        const isAlone = this.playerTracker.isPlayerAlone(brain.targetPlayer);

        if (isNight && isAlone) {
            interest += 20; // Sube mucho el interés si es de noche y está solo
        }

        // Decisiones
        if (brain.currentState.constructor.name === 'IdleState') {
            if (interest > 50 && Math.random() < 0.1) {
                // El motor decide cambiar a Watching
                return new WatchingState(brain);
            }
        }
        
        // Por defecto no cambiar estado
        return null;
    }
}