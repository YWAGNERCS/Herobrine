import { Priorities } from "./Priorities.js";
import * as States from "../states/index.js";

export class DecisionEngine {
    constructor(worldSystem, playerTracker) {
        this.worldSystem = worldSystem;
        this.playerTracker = playerTracker;
        
        this.currentGoal = null;
        this.ticks = 0;
    }

    evaluate(memory, personality, brain) {
        this.ticks++;

        if (this.currentGoal) {
            const timeElapsed = this.ticks - this.currentGoal.startTime;
            
            // Condiciones de interrupción
            // Ejemplo: El día interrumpe ataques o persecuciones
            if (!this.worldSystem.isNight() && (this.currentGoal.stateName === 'HuntingState' || this.currentGoal.stateName === 'ChasingState')) {
                this.currentGoal = null;
                memory.behavior.daysWithoutAppearing = 0;
                return new States.LeavingState(brain);
            }

            if (timeElapsed > this.currentGoal.maxDurationTicks) {
                this.currentGoal = null;
                memory.behavior.daysWithoutAppearing = 0; 
                return new States.LeavingState(brain);
            } else {
                return null; 
            }
        }

        // Decision loop (cada 5 seg)
        if (this.ticks % 100 !== 0) return null;

        const result = Priorities.calculate(memory, personality, this.worldSystem, this.playerTracker, brain.targetPlayer);
        
        if (result.bestState !== 'IdleState') {
            let maxDuration = 20 * 60 * 3;
            if (result.bestState === 'WatchingState') maxDuration = 20 * 60 * 5;
            if (result.bestState === 'ChasingState') maxDuration = 20 * 60 * 2;
            if (result.bestState === 'HuntingState') maxDuration = 20 * 60 * 1;
            
            this.currentGoal = {
                stateName: result.bestState,
                startTime: this.ticks,
                maxDurationTicks: maxDuration
            };
            
            return new States[result.bestState](brain);
        }

        return new States.IdleState(brain);
    }
}