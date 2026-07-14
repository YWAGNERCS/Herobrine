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

let lastStickUse = 0;
try {
    world.afterEvents.itemUse.subscribe((event) => {
        if (event.itemStack.typeId === "minecraft:stick") {
            const now = Date.now();
            if (now - lastStickUse < 2000) return; // 2 segundos de cooldown
            lastStickUse = now;
            
            world.sendMessage("§a[Debug] Forzando AttackAction directo...");
            try {
                if (globalBrain) {
                    AttackAction.execute(globalBrain, event.source);
                } else {
                    world.sendMessage("§c[Debug] globalBrain es NULL! Error de inicio: " + String(errorMsg_backup));
                }
            } catch (e) {
                world.sendMessage("Error spawn: " + String(e) + " " + String(e.stack));
            }
        }
    });
} catch(e) {
    world.sendMessage("§cError registrando item: " + String(e));
}
