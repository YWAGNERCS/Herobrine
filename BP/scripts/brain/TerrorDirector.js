import { world } from "@minecraft/server";

export class TerrorDirector {
    constructor(worldSystem) {
        this.worldSystem = worldSystem;
        this.ticks = 0;
        this.pacingPhase = "CALM"; // CALM, BUILD_UP, PEAK, COOLDOWN
        this.phaseTicks = 0;
        
        this.COOLDOWN_DURATION = 20 * 60 * 3; // 3 minutos de calma absoluta tras un pico
    }

    updateMetrics(player, memory) {
        let safety = 50;
        const isDay = this.worldSystem.isNight() ? false : true;
        const health = player.getComponent("health");
        const hpPercent = health ? (health.currentValue / health.defaultValue) : 1;
        
        if (isDay) safety += 20;
        else safety -= 20;
        
        if (hpPercent > 0.8) safety += 20;
        if (hpPercent < 0.4) safety -= 30;

        const loc = player.location;
        if (player.dimension.id === "minecraft:overworld" && loc.y > 50) safety += 10;
        if (player.dimension.id === "minecraft:nether") safety -= 30;
        
        memory.player.safetyLevel = Math.max(0, Math.min(100, safety));

        if (this.ticks % 100 === 0) {
            if (memory.player.stressLevel > 0) memory.player.stressLevel--;
            if (memory.player.suspenseLevel < 100) memory.player.suspenseLevel++;
        }
    }

    evaluateIntensity(memory, player) {
        this.ticks++;
        this.phaseTicks++;
        
        if (this.ticks % 20 === 0) {
            this.updateMetrics(player, memory);
        }

        switch (this.pacingPhase) {
            case "COOLDOWN":
                if (this.phaseTicks > this.COOLDOWN_DURATION) {
                    this.pacingPhase = "CALM";
                    this.phaseTicks = 0;
                    memory.player.suspenseLevel = 0;
                }
                return 0;

            case "CALM":
                if (memory.player.suspenseLevel > 30 || memory.player.safetyLevel > 80) {
                    this.pacingPhase = "BUILD_UP";
                    this.phaseTicks = 0;
                }
                return 0;

            case "BUILD_UP":
                if (this.phaseTicks - (this.lastEventTick || 0) < 20 * 60) {
                    return 0; // Al menos 1 minuto de respiro entre intentos en BUILD_UP
                }

                if (memory.player.safetyLevel > 70 && memory.player.confidenceLevel > 60) {
                    if (Math.random() < 0.01) { // 1% chance por tick (aprox cada 5 segs de chequeo, pero está limitado por el minuto anterior)
                        this.lastEventTick = this.phaseTicks;
                        if (Math.random() < 0.3) {
                            this.pacingPhase = "PEAK";
                            this.phaseTicks = 0;
                            return 4; // Chase (Nivel 4)
                        }
                        return 3; // Signs (Nivel 3)
                    }
                }

                if (memory.player.suspenseLevel > 80) {
                    this.lastEventTick = this.phaseTicks;
                    this.pacingPhase = "PEAK";
                    this.phaseTicks = 0;
                    return 5; // Combat (Nivel 5)
                }
                
                if (Math.random() < 0.001) {
                    this.lastEventTick = this.phaseTicks;
                    return 2; // Sounds
                }
                if (Math.random() < 0.005) {
                    this.lastEventTick = this.phaseTicks;
                    return 1; // Observation
                }
                
                return 0;

            case "PEAK":
                if (this.phaseTicks > 20 * 30) { 
                    this.pacingPhase = "COOLDOWN";
                    this.phaseTicks = 0;
                    memory.player.stressLevel += 50; 
                }
                return 0; // Peak intensity is handled by the state it transitioned to, we just wait
        }

        return 0;
    }
}
