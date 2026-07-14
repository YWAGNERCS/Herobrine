export class StalkAction {
    static execute(brain, targetPlayer) {
        // Encontrar una posición DETRÁS del jugador (fuera de la vista)
        const viewDir = targetPlayer.getViewDirection();
        const distance = 15 + (Math.random() * 5);
        
        const loc = targetPlayer.location;
        const targetLoc = {
            x: loc.x - (viewDir.x * distance),
            y: loc.y + 2,
            z: loc.z - (viewDir.z * distance)
        };

        const entity = brain.systems.spawnSystem.spawnTestEntity(targetPlayer, targetLoc);
        if (entity) {
            entity.triggerEvent("antigravity:start_stalking");
        }
    }
}