export class StalkAction {
    static execute(brain, targetPlayer) {
        // Encontrar una posición DETRÁS del jugador
        const viewDir = targetPlayer.getViewDirection();
        const distance = 15;
        
        const loc = targetPlayer.location;
        const targetLoc = {
            x: loc.x - (viewDir.x * distance),
            y: loc.y,
            z: loc.z - (viewDir.z * distance)
        };

        brain.systems.spawnSystem.spawnTestEntity(targetPlayer, targetLoc);
    }
}