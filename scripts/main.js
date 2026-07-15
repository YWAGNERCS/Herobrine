import { world, system } from "@minecraft/server";
import { HerobrineBrain } from "./brain/HerobrineBrain.js";
import { WorldSystem } from "./systems/WorldSystem.js";
import { PlayerTracker } from "./systems/PlayerTracker.js";
import { SpawnSystem } from "./systems/SpawnSystem.js";
import { SoundSystem } from "./systems/SoundSystem.js";
import { EventSystem } from "./systems/EventSystem.js";
import { HuntingState } from "./states/HuntingState.js";

let errorMsg = null;
let globalBrain = null;
let testSystem = null;

let errorMsg_backup = null;
try {
    const systems = {
        worldSystem: new WorldSystem(),
        playerTracker: new PlayerTracker(),
        spawnSystem: new SpawnSystem(),
        soundSystem: new SoundSystem(),
        eventSystem: new EventSystem()
    };
    testSystem = systems.spawnSystem;
    systems.eventSystem.init();
    globalBrain = new HerobrineBrain(systems);
} catch(e) {
    errorMsg = String(e) + " | " + String(e.stack);
    errorMsg_backup = errorMsg;
}

system.runInterval(() => {
    if (errorMsg) {
        world.sendMessage("§c[CRASH] " + errorMsg);
        errorMsg = null; // Enviar solo una vez
    }
    
    if (globalBrain) {
        try {
            const players = world.getAllPlayers();
            globalBrain.tick(players);
        } catch(e) {
            world.sendMessage("§c[TICK ERROR] " + String(e));
        }
    }
}, 20);

import { AttackAction } from "./actions/AttackAction.js";

if (system.afterEvents && system.afterEvents.scriptEventReceive) {
    system.afterEvents.scriptEventReceive.subscribe((event) => {
        if (!globalBrain) return;
        
        // Obtener al jugador que envió el comando
        const sourceEntity = event.sourceEntity;
        if (!sourceEntity || sourceEntity.typeId !== "minecraft:player") return;

        if (event.id === "hb:set") {
            const parts = event.message.split(" ");
            const stat = parts[0];
            const val = parseInt(parts[1]);
            
            const mem = globalBrain.getMemory(sourceEntity);
            if (mem.player[stat] !== undefined) {
                mem.player[stat] = val;
                mem.player.debugLock = 1200; // 1 minuto de bloqueo para que updateMetrics no lo sobreescriba
                globalBrain.saveMemories();
                
                if (stat === "suspenseLevel" && val < 30) {
                    globalBrain.terrorDirector.pacingPhase = "CALM";
                }
                
                // Forzar que el director ignore los enfriamientos al debugear
                globalBrain.terrorDirector.lastEventTick = 0;
                globalBrain.terrorDirector.phaseTicks = 100000;
                mem.behavior.goalHistory = {}; // Limpiar todos los cooldowns de los eventos
                globalBrain.planExecutor.activeMetaGoal = null; // Abortar plan actual (ej. DoNothing) para que evalúe de inmediato
                
                sourceEntity.sendMessage(`§a[Debug AI] ${stat} actualizado a ${val}`);
            } else {
                sourceEntity.sendMessage(`§c[Debug AI] Estadística '${stat}' no existe. Usa: suspenseLevel, fearLevel, safetyLevel, stressLevel, confidenceLevel`);
            }
        } else if (event.id === "hb:info") {
            const mem = globalBrain.getMemory(sourceEntity);
            const stats = mem.player;
            sourceEntity.sendMessage(`§b--- Herobrine AI Stats ---`);
            sourceEntity.sendMessage(`§7Suspense: §f${stats.suspenseLevel}`);
            sourceEntity.sendMessage(`§7Safety: §f${stats.safetyLevel}`);
            sourceEntity.sendMessage(`§7Confidence: §f${stats.confidenceLevel}`);
            sourceEntity.sendMessage(`§7Fear: §f${stats.fearLevel}`);
            sourceEntity.sendMessage(`§7Stress: §f${stats.stressLevel}`);
            sourceEntity.sendMessage(`§7Fase Director: §e${globalBrain.terrorDirector.pacingPhase}`);
        }
    });
}

// Código de debug con el palo removido. El mod ahora es 100% autónomo.
