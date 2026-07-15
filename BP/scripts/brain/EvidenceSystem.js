export class EvidenceSystem {
    static leaveFootprints(player, location) {
        // En Bedrock JS API 1.1.0, se generan partículas con runCommand.
        // En lugar de iterar con timeout que es complicado sin system.runTimeout, 
        // usaremos un comando para dejar una estela.
        try {
            player.dimension.runCommand(`particle "minecraft:falling_dust_gravel_particle" ${location.x} ${location.y + 0.1} ${location.z}`);
        } catch(e) {}
    }

    static leaveDirt(player, location) {
        // Dejar un rastro de tierra o barro sutilmente cerca de una puerta
        try {
            const block = player.dimension.getBlock({x: location.x, y: location.y - 1, z: location.z});
            if (block && block.typeId !== "minecraft:dirt" && block.typeId !== "minecraft:grass_block") {
                // Muy arriesgado cambiar bloques base, mejor partículas de tierra
                player.dimension.runCommand(`particle "minecraft:dirt_poof" ${location.x} ${location.y + 0.1} ${location.z}`);
            }
        } catch(e) {}
    }

    static fallingLeaves(player, location) {
        try {
            player.dimension.runCommand(`particle "minecraft:crop_growth_area_emitter" ${location.x} ${location.y + 2} ${location.z}`);
        } catch(e) {}
    }
}
