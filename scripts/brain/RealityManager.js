export class RealityManager {
    constructor(worldSystem) {
        this.worldSystem = worldSystem;
        this.playerStates = {}; // Tracks rapid block placement
    }

    // Retorna true si es seguro alterar la realidad (no rompe la experiencia)
    isRealitySafe(player) {
        const memory = this.worldSystem.playerTracker.getMemory(player);
        if (!memory) return true;

        const health = player.getComponent("health");
        const currentHp = health ? health.currentValue : 100;
        
        // 1. Está en combate severo o muriendo
        if (currentHp < 6) return false;
        
        // 2. Acaba de reaparecer (spawn reciente)
        // Podríamos rastrearlo, pero asumimos por ahora vida completa si reapareció,
        // o mejor revisamos si hay una variable de spawn. Asumiremos combat check como suficiente.

        // 3. Verificamos actividad de construcción
        if (this.playerStates[player.id]) {
            const state = this.playerStates[player.id];
            if (Date.now() - state.lastBuildTime < 2000 && state.buildCount > 5) {
                // Construyendo rápido
                return false;
            }
        }

        return true;
    }

    trackBuild(player) {
        if (!this.playerStates[player.id]) {
            this.playerStates[player.id] = { lastBuildTime: Date.now(), buildCount: 0 };
        }
        
        const state = this.playerStates[player.id];
        if (Date.now() - state.lastBuildTime > 5000) {
            state.buildCount = 0; // Reset
        }
        
        state.buildCount++;
        state.lastBuildTime = Date.now();
    }

    // Retorna true si un bloque puede ser manipulado (no es cofre, cama, etc)
    isBlockSafeToModify(block) {
        const forbidden = ["chest", "barrel", "bed", "crafting_table", "furnace", "shulker_box", "ender_chest", "beacon"];
        for (const f of forbidden) {
            if (block.typeId.includes(f)) return false;
        }
        return true;
    }
}
