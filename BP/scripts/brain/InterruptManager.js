export class InterruptManager {
    constructor(worldSystem) {
        this.worldSystem = worldSystem;
        this.lastDimension = null;
        this.lastHealth = 100;
    }

    checkInterrupts(player, activeMetaGoal) {
        if (!activeMetaGoal || activeMetaGoal.name === "DoNothing") return false;

        const currentDimension = player.dimension.id;
        
        // Initial setup
        if (!this.lastDimension) this.lastDimension = currentDimension;

        let interrupted = false;

        // Context drastically changed (Dimension swap)
        if (currentDimension !== this.lastDimension) {
            console.warn("[InterruptManager] Cambio de dimensión detectado. Abortando plan actual.");
            interrupted = true;
        }

        // Context drastically changed (Player in combat / taking heavy damage)
        const health = player.getComponent("health");
        const currentHp = health ? health.currentValue : 100;
        if (this.lastHealth - currentHp > 6) { // Took more than 3 hearts of damage
            console.warn("[InterruptManager] Daño masivo detectado. Abortando plan actual por pérdida de contexto.");
            interrupted = true;
        }

        this.lastDimension = currentDimension;
        this.lastHealth = currentHp;

        return interrupted;
    }
}
