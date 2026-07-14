import { Conditions } from "./Conditions.js";

export class Priorities {
    static calculate(memory, personality, worldSystem, playerTracker, targetPlayer) {
        // Obtenemos los factores del entorno
        const isNight = worldSystem.isNight();
        const isAlone = playerTracker.isPlayerAlone(targetPlayer);
        const isInjured = Conditions.isPlayerInjured(targetPlayer);
        const inventoryInterest = Conditions.getInventoryInterest(targetPlayer);
        
        // Interés total combinado (memoria + inventario temporal)
        const totalInterest = memory.player.interestLevel + inventoryInterest;
        const fear = memory.player.fearLevel;
        
        // Tiempo sin aparecer
        const daysWithoutAppearing = memory.behavior.daysWithoutAppearing;
        // Si el interés sube de 10, ignoramos el cooldown para forzar acción rápida
        const cooldownFactor = (daysWithoutAppearing > 0 || totalInterest > 10) ? 1 : 0.1;

        // Ruido aleatorio para imprevisibilidad (-5 a +5)
        const noise = () => (Math.random() * 10) - 5;

        // Puntuaciones base
        let scores = {
            IdleState: 50 * personality.patience / 100, 
            WatchingState: 20 + (personality.stealth / 100 * 30) + noise(),
            SignState: 10 + (personality.curiosity / 100 * 20) + (totalInterest * 0.5) + noise(),
            StalkingState: 10 + (personality.stealth / 100 * 40) + noise(),
            ManipulateState: 5 + (personality.cruelty / 100 * 30) + noise(),
            EventState: 0 + (totalInterest * 0.8) + noise(),
            ChasingState: 0 + (personality.aggression / 100 * 20) + (fear * 0.5) + noise(),
            HuntingState: -10 + (personality.aggression / 100 * 50) + noise(),
            LeavingState: 5
        };

        // Modificadores de contexto
        if (cooldownFactor < 1) {
            scores.IdleState += 50;
            scores.WatchingState += 20;
        } else {
            if (isNight) {
                scores.StalkingState += 15;
                scores.EventState += 10;
                scores.HuntingState += 5;
            }
            if (isAlone && isInjured) {
                scores.ChasingState += 25;
                scores.HuntingState += 30;
                scores.WatchingState -= 10;
            }
            if (totalInterest > 50) {
                scores.SignState += 20;
                scores.ManipulateState += 15;
            }
            if (totalInterest > 80) {
                scores.EventState += 30;
            }
        }

        // Devolver el estado con mayor puntuación
        let bestState = 'IdleState';
        let maxScore = scores['IdleState'];

        for (const state in scores) {
            if (scores[state] > maxScore) {
                maxScore = scores[state];
                bestState = state;
            }
        }

        return { bestState, maxScore };
    }
}