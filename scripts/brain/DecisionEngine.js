import * as States from "../states/index.js";

export class DecisionEngine {
    constructor(worldSystem, playerTracker, terrorDirector) {
        this.worldSystem = worldSystem;
        this.playerTracker = playerTracker;
        this.terrorDirector = terrorDirector;
        
        this.currentGoal = null;
        this.ticks = 0;
    }

    evaluate(memory, personality, brain) {
        this.ticks++;

        // Si tenemos un objetivo activo, lo continuamos hasta que decida acabar
        if (this.currentGoal) {
            const timeElapsed = this.ticks - this.currentGoal.startTime;
            if (timeElapsed > this.currentGoal.maxDurationTicks) {
                this.currentGoal = null;
                return new States.LeavingState(brain);
            }
            // Devolvemos null para indicar que el estado actual puede seguir ejecutándose
            return null;
        }

        // Consultamos al Director de Terror qué nivel de intensidad toca
        const targetPlayer = brain.targetPlayer;
        if (!targetPlayer) return new States.IdleState(brain);

        const intensity = this.terrorDirector.evaluateIntensity(memory, targetPlayer);

        let newStateName = 'IdleState';
        let maxDuration = 20 * 60; // Default 1 minuto

        if (intensity === 1) {
            newStateName = 'WatchingState';
            maxDuration = 20 * 30; // 30 segundos observando
        } else if (intensity === 2) {
            newStateName = 'ManipulateState';
            maxDuration = 20 * 10;
        } else if (intensity === 3) {
            newStateName = 'ManipulateState';
            maxDuration = 20 * 10;
        } else if (intensity === 4) {
            newStateName = 'ChasingState';
            maxDuration = 20 * 15;
        } else if (intensity === 5) {
            newStateName = 'HuntingState';
            maxDuration = 20 * 45;
        }

        if (newStateName !== 'IdleState') {
            this.currentGoal = {
                stateName: newStateName,
                startTime: this.ticks,
                maxDurationTicks: maxDuration
            };
            return new States[newStateName](brain);
        }

        return new States.IdleState(brain);
    }
}