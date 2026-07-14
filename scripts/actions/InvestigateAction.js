export class InvestigateAction {
    static execute(brain, targetPlayer) {
        const mem = brain.getMemory(targetPlayer);
        
        // Si tiene casa, ir a la casa, si no, acercarse de forma aleatoria
        let targetLoc = targetPlayer.location;
        if (mem.house.homeLocation) {
            targetLoc = mem.house.homeLocation;
        } else {
            const viewDir = targetPlayer.getViewDirection();
            targetLoc = {
                x: targetLoc.x + (viewDir.x * 20),
                y: targetLoc.y,
                z: targetLoc.z + (viewDir.z * 20)
            };
        }

        const entity = brain.systems.spawnSystem.spawnTestEntity(targetPlayer, targetLoc);
        if (entity) {
            entity.triggerEvent("antigravity:stop_action");
        }
    }
}
