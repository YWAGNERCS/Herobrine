import { WitnessSystem } from "../brain/WitnessSystem.js";
import { EvidenceSystem } from "../brain/EvidenceSystem.js";

export class WorldManipulation {
    static stripLeaves(player, realityManager) {
        if (!realityManager.isRealitySafe(player)) return;
        
        // Solo de noche y muy lejos de casa. Asumiremos que el GoalPlanner filtró esto, pero WitnessSystem lo confirma.
        const hiddenLoc = WitnessSystem.getHiddenLocation(player, 10, 20);
        if (WitnessSystem.isLookingAt(player, hiddenLoc)) return; // Failsafe

        const dimension = player.dimension;
        let foundTree = false;

        for (let x = -5; x <= 5 && !foundTree; x++) {
            for (let y = 0; y <= 10 && !foundTree; y++) {
                for (let z = -5; z <= 5 && !foundTree; z++) {
                    const blockLoc = { x: hiddenLoc.x + x, y: hiddenLoc.y + y, z: hiddenLoc.z + z };
                    const block = dimension.getBlock(blockLoc);
                    if (block && block.typeId.includes("leaves")) {
                        dimension.runCommand(`setblock ${blockLoc.x} ${blockLoc.y} ${blockLoc.z} air`);
                        foundTree = true;
                        EvidenceSystem.fallingLeaves(player, blockLoc);
                    }
                }
            }
        }
    }

    static removeTorch(player, realityManager) {
        if (!realityManager.isRealitySafe(player)) return;
        
        const loc = player.location;
        const dimension = player.dimension;
        let found = false;

        for (let x = -10; x <= 10 && !found; x++) {
            for (let y = -5; y <= 5 && !found; y++) {
                for (let z = -10; z <= 10 && !found; z++) {
                    const blockLoc = { x: Math.floor(loc.x + x), y: Math.floor(loc.y + y), z: Math.floor(loc.z + z) };
                    const block = dimension.getBlock(blockLoc);
                    if (block && (block.typeId === "minecraft:torch" || block.typeId === "minecraft:soul_torch")) {
                        // Flashing effect before dying
                        player.dimension.runCommand(`particle "minecraft:smoke_particle" ${blockLoc.x} ${blockLoc.y + 1} ${blockLoc.z}`);
                        player.playSound("random.fizz", { location: blockLoc, volume: 0.5 });
                        dimension.runCommand(`setblock ${blockLoc.x} ${blockLoc.y} ${blockLoc.z} air`);
                        found = true;
                    }
                }
            }
        }
    }

    static subtleSounds(player) {
        const sounds = [
            "step.grass",
            "step.wood",
            "random.bow",
            "mob.creeper.say",
            "mob.endermen.idle"
        ];
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        const hiddenLoc = WitnessSystem.getHiddenLocation(player, 2, 4); // Just behind the player
        
        player.playSound(sound, { location: hiddenLoc, volume: 1.0 });
        EvidenceSystem.leaveFootprints(player, hiddenLoc);
    }

    static openDoors(player, realityManager) {
        if (!realityManager.isRealitySafe(player)) return;

        const hiddenLoc = WitnessSystem.getHiddenLocation(player, 5, 15);
        if (WitnessSystem.isLookingAt(player, hiddenLoc)) return;

        const dimension = player.dimension;
        let found = false;

        for (let x = -10; x <= 10 && !found; x++) {
            for (let y = -5; y <= 5 && !found; y++) {
                for (let z = -10; z <= 10 && !found; z++) {
                    const blockLoc = { x: hiddenLoc.x + x, y: hiddenLoc.y + y, z: hiddenLoc.z + z };
                    const block = dimension.getBlock(blockLoc);
                    if (block && block.typeId.includes("door")) {
                        try {
                            player.playSound("random.door_open", { location: blockLoc, volume: 0.8 });
                            EvidenceSystem.leaveDirt(player, blockLoc);
                            found = true;
                        } catch(e) {}
                    }
                }
            }
        }
    }

    static buildPyramid(player, realityManager) {
        if (!realityManager.isRealitySafe(player)) return;

        const hiddenLoc = WitnessSystem.getHiddenLocation(player, 15, 30);
        if (WitnessSystem.isLookingAt(player, hiddenLoc)) return;

        const dimension = player.dimension;
        const blockType = "minecraft:sand"; // Podría ser cristal, pero dejaremos arena
        
        // Verifica si la zona es segura
        const centerBlock = dimension.getBlock(hiddenLoc);
        if (centerBlock && realityManager.isBlockSafeToModify(centerBlock)) {
            dimension.runCommand(`fill ${hiddenLoc.x - 1} ${hiddenLoc.y} ${hiddenLoc.z - 1} ${hiddenLoc.x + 1} ${hiddenLoc.y} ${hiddenLoc.z + 1} ${blockType}`);
            dimension.runCommand(`setblock ${hiddenLoc.x} ${hiddenLoc.y + 1} ${hiddenLoc.z} ${blockType}`);
        }
    }

    static digTunnel(player, realityManager) {
        if (!realityManager.isRealitySafe(player)) return;
        
        const hiddenLoc = WitnessSystem.getHiddenLocation(player, 10, 20);
        if (WitnessSystem.isLookingAt(player, hiddenLoc)) return;

        // Simplificado: excava un túnel corto en una dirección aleatoria
        const dimension = player.dimension;
        const length = 5 + Math.floor(Math.random() * 10);
        try {
            dimension.runCommand(`fill ${hiddenLoc.x} ${hiddenLoc.y} ${hiddenLoc.z} ${hiddenLoc.x + 1} ${hiddenLoc.y + 1} ${hiddenLoc.z + length} air replace stone`);
            if (Math.random() > 0.5) {
                dimension.runCommand(`setblock ${hiddenLoc.x} ${hiddenLoc.y} ${hiddenLoc.z + length} redstone_torch`);
            }
        } catch(e) {}
    }

    static localFog(player) {
        // Usa partículas para crear niebla, no ceguera
        const hiddenLoc = WitnessSystem.getHiddenLocation(player, 5, 10);
        try {
            player.dimension.runCommand(`particle "minecraft:campfire_smoke_particle" ${hiddenLoc.x} ${hiddenLoc.y + 1} ${hiddenLoc.z}`);
        } catch(e) {}
    }
}