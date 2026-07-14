export class WorldManipulation {
    static storedBlocks = []; 

    static removeTorch(player) {
        // Encontrar una antorcha cerca y quitarla
        const loc = player.location;
        const dimension = player.dimension;
        let found = false;

        for (let x = -10; x <= 10 && !found; x++) {
            for (let y = -5; y <= 5 && !found; y++) {
                for (let z = -10; z <= 10 && !found; z++) {
                    const blockLoc = { x: Math.floor(loc.x + x), y: Math.floor(loc.y + y), z: Math.floor(loc.z + z) };
                    const block = dimension.getBlock(blockLoc);
                    if (block && (block.typeId === "minecraft:torch" || block.typeId === "minecraft:soul_torch")) {
                        dimension.runCommand(`setblock ${blockLoc.x} ${blockLoc.y} ${blockLoc.z} air`);
                        player.playSound("random.fizz", { location: blockLoc, volume: 0.5 });
                        found = true;
                        console.warn("[HerobrineAI] Antorcha eliminada en " + blockLoc.x + " " + blockLoc.y + " " + blockLoc.z);
                    }
                }
            }
        }
    }

    static buildPyramid(player) {
        const viewDir = player.getViewDirection();
        const loc = player.location;
        const dimension = player.dimension;
        
        // Colocar la pirámide a 15-25 bloques de distancia
        const distance = 15 + Math.random() * 10;
        const targetLoc = {
            x: Math.floor(loc.x + (viewDir.x * distance)),
            y: Math.floor(loc.y),
            z: Math.floor(loc.z + (viewDir.z * distance))
        };

        const blockType = "minecraft:sand";
        // Construir pirámide 3x3
        dimension.runCommand(`fill ${targetLoc.x - 1} ${targetLoc.y} ${targetLoc.z - 1} ${targetLoc.x + 1} ${targetLoc.y} ${targetLoc.z + 1} ${blockType}`);
        dimension.runCommand(`setblock ${targetLoc.x} ${targetLoc.y + 1} ${targetLoc.z} ${blockType}`);
        
        console.warn("[HerobrineAI] Pirámide construida en " + targetLoc.x + " " + targetLoc.y + " " + targetLoc.z);
    }

    static createFakeEffect(player) {
        const effects = ["ambient.cave", "step.stone", "mob.endermen.stare"];
        const sound = effects[Math.floor(Math.random() * effects.length)];
        player.playSound(sound, { location: player.location, volume: 1.0 });
    }

    static openDoors(player) {
        const loc = player.location;
        const dimension = player.dimension;
        let found = false;

        for (let x = -10; x <= 10 && !found; x++) {
            for (let y = -5; y <= 5 && !found; y++) {
                for (let z = -10; z <= 10 && !found; z++) {
                    const blockLoc = { x: Math.floor(loc.x + x), y: Math.floor(loc.y + y), z: Math.floor(loc.z + z) };
                    const block = dimension.getBlock(blockLoc);
                    if (block && block.typeId.includes("door")) {
                        try {
                            // En Bedrock, las puertas tienen la propiedad "open_bit" o se pueden forzar con setblock/runCommand.
                            // La forma más fácil de "abrir" una puerta o hacer sonido de puerta es con playSound y cambiar su bloque.
                            // Pero usaremos la API de propiedades si es posible, o emitiremos sonido de abrir puerta.
                            player.playSound("random.door_open", { location: blockLoc, volume: 1.0 });
                            found = true;
                        } catch(e) {}
                    }
                }
            }
        }
    }

    static weatherEvent(player) {
        try {
            player.dimension.runCommand("weather thunder");
            console.warn("[HerobrineAI] Invocando tormenta");
        } catch(e) {}
    }

    static blindnessEvent(player) {
        try {
            player.dimension.runCommand(`effect "${player.name}" blindness 5 1 true`);
            player.playSound("mob.wither.ambient", { location: player.location, volume: 1.0 });
        } catch(e) {}
    }
}