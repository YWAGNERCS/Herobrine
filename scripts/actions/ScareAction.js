import { WorldManipulation } from "./WorldManipulation.js";

export class ScareAction {
    static execute(brain, targetPlayer) {
        // Ejecutar un evento de miedo aleatorio
        const rand = Math.random();
        
        if (rand < 0.33) {
            WorldManipulation.removeTorch(targetPlayer);
        } else if (rand < 0.66) {
            WorldManipulation.createFakeEffect(targetPlayer);
        } else {
            // Sonido de puerta
            targetPlayer.playSound("random.door_open", { location: targetPlayer.location, volume: 1.0 });
            targetPlayer.playSound("random.door_close", { location: targetPlayer.location, volume: 1.0 });
        }
        
        // Aumenta el miedo
        brain.systems.eventSystem.addFear(targetPlayer, 5, "Sufrió un ScareAction");
    }
}
