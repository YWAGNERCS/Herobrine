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

const chatEvent = (world.beforeEvents && world.beforeEvents.chatSend) ? world.beforeEvents.chatSend : (world.afterEvents && world.afterEvents.chatSend ? world.afterEvents.chatSend : null);

if (chatEvent) {
    chatEvent.subscribe((event) => {
        const msg = event.message;
        if (msg.startsWith("!hb")) {
            if (event.cancel !== undefined) event.cancel = true; // Ocultar si es beforeEvent
        const parts = msg.split(" ");
        if (parts[1] === "set" && parts[2] && parts[3]) {
            const stat = parts[2];
            const val = parseInt(parts[3]);
            
            if (globalBrain) {
                // Obtener memoria del jugador que envió el mensaje
                const mem = globalBrain.getMemory(event.sender);
                if (mem.player[stat] !== undefined) {
                    mem.player[stat] = val;
                    globalBrain.saveMemories();
                    
                    // Si cambiamos suspense a 0, forzamos al director a volver a fase CALM
                    if (stat === "suspenseLevel" && val < 30) {
                        globalBrain.terrorDirector.pacingPhase = "CALM";
                    }
                    
                    event.sender.sendMessage(`§a[Debug AI] ${stat} actualizado a ${val}`);
                } else {
                    event.sender.sendMessage(`§c[Debug AI] Estadística '${stat}' no existe. Usa: suspenseLevel, fearLevel, safetyLevel, stressLevel, confidenceLevel`);
                }
            } else {
                event.sender.sendMessage("§c[Debug AI] Cerebro no inicializado aún.");
            }
        } else if (parts[1] === "info") {
            if (globalBrain) {
                const mem = globalBrain.getMemory(event.sender);
                const stats = mem.player;
                event.sender.sendMessage(`§b--- Herobrine AI Stats ---`);
                event.sender.sendMessage(`§7Suspense: §f${stats.suspenseLevel}`);
                event.sender.sendMessage(`§7Safety: §f${stats.safetyLevel}`);
                event.sender.sendMessage(`§7Confidence: §f${stats.confidenceLevel}`);
                event.sender.sendMessage(`§7Fear: §f${stats.fearLevel}`);
                event.sender.sendMessage(`§7Stress: §f${stats.stressLevel}`);
                event.sender.sendMessage(`§7Fase Director: §e${globalBrain.terrorDirector.pacingPhase}`);
            }
        } else {
            event.sender.sendMessage("§e[Debug AI] Comandos: '!hb info' o '!hb set <estat> <valor>'");
        }
        }
    });
}

// Código de debug con el palo removido. El mod ahora es 100% autónomo.
