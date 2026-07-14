export class EscapeAction {
    static execute(brain, targetPlayer) {
        if (targetPlayer) {
            targetPlayer.playSound("mob.endermen.portal", { location: targetPlayer.location, volume: 1.0 });
            const mem = brain.getMemory(targetPlayer);
            mem.behavior.lastAppearance = Date.now();
            mem.behavior.daysWithoutAppearing = 0;
            brain.saveMemories();
        }
        
        brain.systems.spawnSystem.despawn();
    }
}