export class WatchAction {
    static execute(brain, targetPlayer) {
        // Encontrar una posición lejana (20-30 bloques) en la dirección donde mira el jugador
        const viewDir = targetPlayer.getViewDirection();
        const distance = 25;
        
        const loc = targetPlayer.location;
        const targetLoc = {
            x: loc.x + (viewDir.x * distance),
            y: loc.y, // Ajustable a la altura real del suelo mediante raycast en futuro
            z: loc.z + (viewDir.z * distance)
        };

        brain.systems.spawnSystem.spawnTestEntity(targetPlayer, targetLoc);
    }
}