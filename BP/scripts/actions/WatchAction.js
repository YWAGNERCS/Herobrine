export class WatchAction {
    static execute(brain, targetPlayer) {
        // Encontrar una posición lejana (35-45 bloques) en la dirección donde mira el jugador
        const viewDir = targetPlayer.getViewDirection();
        const distance = 35 + (Math.random() * 10);
        
        const loc = targetPlayer.location;
        let targetLoc = {
            x: Math.floor(loc.x + (viewDir.x * distance)),
            y: Math.floor(loc.y),
            z: Math.floor(loc.z + (viewDir.z * distance))
        };

        // Buscar el bloque más alto en esa coordenada X,Z
        try {
            const dimension = targetPlayer.dimension;
            let highestY = targetLoc.y + 20; // Buscar hasta 20 bloques arriba
            let foundGround = false;
            
            for (let y = highestY; y >= targetLoc.y - 10; y--) {
                const block = dimension.getBlock({ x: targetLoc.x, y: y, z: targetLoc.z });
                if (block && !block.isAir) {
                    targetLoc.y = y + 1; // Spawnear encima del bloque (ej. hojas o montaña)
                    foundGround = true;
                    break;
                }
            }
            if (!foundGround) {
                targetLoc.y = loc.y + 2; // Fallback
            }
        } catch(e) {
            targetLoc.y = loc.y + 5;
        }

        const entity = brain.systems.spawnSystem.spawnTestEntity(targetPlayer, targetLoc);
        if (entity) {
            // Se asegura de que esté en estado "idle" (no caminando)
            entity.triggerEvent("antigravity:stop_action");
        }
    }
}