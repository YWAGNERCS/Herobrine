export class SoundSystem {
    constructor() {
        this.spookySounds = [
            "ambient.cave",
            "mob.endermen.stare",
            "mob.ghast.scream",
            "mob.zombie.say",
            "step.wood",
            "step.stone"
        ];
    }
    
    playSpookySound(player) {
        if (!player) return;
        const sound = this.spookySounds[Math.floor(Math.random() * this.spookySounds.length)];
        
        // Random offset for directionality
        const offset = {
            x: (Math.random() - 0.5) * 10,
            y: (Math.random() - 0.5) * 4,
            z: (Math.random() - 0.5) * 10
        };
        
        const loc = player.location;
        const targetLoc = { x: loc.x + offset.x, y: loc.y + offset.y, z: loc.z + offset.z };
        
        player.playSound(sound, { location: targetLoc, volume: 0.7, pitch: 0.8 + (Math.random() * 0.4) });
    }
}