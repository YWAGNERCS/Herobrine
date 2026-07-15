import * as States from "../states/index.js";

export class PlanExecutor {
    constructor(worldSystem, playerTracker, terrorDirector, goalPlanner, interruptManager) {
        this.worldSystem = worldSystem;
        this.playerTracker = playerTracker;
        this.terrorDirector = terrorDirector;
        this.goalPlanner = goalPlanner;
        this.interruptManager = interruptManager;
        
        this.activeMetaGoal = null;
        this.currentSubGoalIndex = 0;
        this.subGoalTicks = 0;
    }

    executePlan(memory, personality, brain) {
        const targetPlayer = brain.targetPlayer;
        if (!targetPlayer) return new States.IdleState(brain);

        // Check Interrupts
        if (this.interruptManager.checkInterrupts(targetPlayer, this.activeMetaGoal)) {
            // If interrupted, abort plan
            this.activeMetaGoal = null;
            return new States.LeavingState(brain);
        }

        // If we have an active plan, execute the current Sub Goal
        if (this.activeMetaGoal) {
            this.subGoalTicks++;
            const currentSubGoal = this.activeMetaGoal.subGoals[this.currentSubGoalIndex];

            if (this.subGoalTicks > currentSubGoal.duration) {
                // Success! Move to next Sub Goal
                this.currentSubGoalIndex++;
                this.subGoalTicks = 0;
                
                if (this.currentSubGoalIndex >= this.activeMetaGoal.subGoals.length) {
                    console.warn(`[PlanExecutor] Meta Goal completado: ${this.activeMetaGoal.name}`);
                    this.activeMetaGoal = null; // Finished plan
                    return new States.LeavingState(brain); // Final exit
                } else {
                    return this.mapSubGoalToState(this.activeMetaGoal.subGoals[this.currentSubGoalIndex], brain);
                }
            }
            // State is continuing its duration
            return null;
        }

        // Si no hay plan activo, preguntamos al TerrorDirector si podemos iniciar uno
        const shouldStartEvent = this.terrorDirector.evaluateIntensity(memory, targetPlayer);
        
        if (shouldStartEvent > 0) { // Director aproves an event
            const tensionBudget = 100; // Podría calcularse desde TerrorDirector
            this.activeMetaGoal = this.goalPlanner.planGoal(memory, targetPlayer, tensionBudget, this.terrorDirector.ticks);
            this.currentSubGoalIndex = 0;
            this.subGoalTicks = 0;
            
            return this.mapSubGoalToState(this.activeMetaGoal.subGoals[this.currentSubGoalIndex], brain);
        }

        return new States.IdleState(brain);
    }

    mapSubGoalToState(subGoal, brain) {
        console.warn(`[PlanExecutor] Iniciando Sub Goal: ${subGoal.type}`);
        // Map abstract subgoal types to concrete States
        switch(subGoal.type) {
            case "FindObservationPoint": return new States.IdleState(brain); // Invisible while finding
            case "LookAtPlayer": return new States.WatchingState(brain);
            case "Disappear": return new States.LeavingState(brain);
            case "SpawnSounds": return new States.ManipulateState(brain);
            case "ApplyBlindness": return new States.ManipulateState(brain);
            case "AggressiveStalk": return new States.ChasingState(brain);
            case "ManipulateEnvironment": return new States.ManipulateState(brain);
            case "DistantAppearance": return new States.WatchingState(brain);
            case "SpawnSecuaces": return new States.ManipulateState(brain);
            case "LightningStrike": return new States.ManipulateState(brain);
            case "MeleeAttack": return new States.HuntingState(brain);
            case "WaitInvisible": return new States.IdleState(brain);
            default: return new States.IdleState(brain);
        }
    }
}