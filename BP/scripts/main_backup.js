import { world, system } from "@minecraft/server";
import { HerobrineBrain } from "./brain/HerobrineBrain.js";
import { WorldSystem } from "./systems/WorldSystem.js";
import { PlayerTracker } from "./systems/PlayerTracker.js";
import { SpawnSystem } from "./systems/SpawnSystem.js";
import { SoundSystem } from "./systems/SoundSystem.js";
import { EventSystem } from "./systems/EventSystem.js";

// Inicialización de Sistemas
const systems = {
    worldSystem: new WorldSystem(),
    playerTracker: new PlayerTracker(),
    spawnSystem: new SpawnSystem(),
    soundSystem: new SoundSystem(),
    eventSystem: new EventSystem()
};

systems.eventSystem.init();

// Inicialización del Cerebro
const globalBrain = new HerobrineBrain(systems);

system.runInterval(() => {
    const players = world.getAllPlayers();
    globalBrain.tick(players);
}, 20); // 1 vez por segundo

// Módulo de pruebas manuales para confirmar que el script carga
world.beforeEvents.chatSend.subscribe((event) => {
    if (event.message === "prueba") {
        event.cancel = true;
        system.run(() => {
            world.sendMessage("§aEjecutando prueba forzada...");
            const viewDir = event.sender.getViewDirection();
            const loc = event.sender.location;
            const targetLoc = {
                x: loc.x + (viewDir.x * 15),
                y: loc.y,
                z: loc.z + (viewDir.z * 15)
            };
            systems.spawnSystem.spawnTestEntity(event.sender, targetLoc);
        });
    }
});