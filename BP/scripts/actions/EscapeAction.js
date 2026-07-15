export class EscapeAction {
    static execute(brain, targetPlayer) {
        if (targetPlayer) {
            const escapeStyle = Math.random();
            if (escapeStyle < 0.33) {
                // Classic fade out (animates during LeavingState)
                targetPlayer.playSound("mob.endermen.portal", { location: targetPlayer.location, volume: 1.0 });
            } else if (escapeStyle < 0.66) {
                // Teleport away (no sound)
            } else {
                // Walk away in the dark (handled by visual state)
            }

            const mem = brain.getMemory(targetPlayer);
            mem.behavior.lastAppearance = Date.now();
            mem.behavior.daysWithoutAppearing = 0;
            brain.saveMemories();
        }
        
        brain.systems.spawnSystem.despawn();
    }
}