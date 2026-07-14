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