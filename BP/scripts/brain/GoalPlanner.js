import { GoalDatabase } from "./goals/GoalDatabase.js";

export class GoalPlanner {
    constructor(worldSystem) {
        this.worldSystem = worldSystem;
    }

    planGoal(memory, player, tensionBudget, currentTick) {
        // Filter valid goals
        const validGoals = [];
        
        for (const [goalName, goalData] of Object.entries(GoalDatabase)) {
            // Check budget
            if (goalData.cost > tensionBudget) continue;
            
            // Check cooldown
            const lastUsed = memory.behavior.goalHistory[goalName] || 0;
            if (currentTick - lastUsed < goalData.cooldownTicks) continue;
            
            // Check contextual requirements
            if (goalData.checkRequirements(memory, player, this.worldSystem)) {
                validGoals.push({ name: goalName, data: goalData });
            }
        }
        
        if (validGoals.length === 0) {
            return { name: "DoNothing", subGoals: GoalDatabase["DoNothing"].getSubGoals(), cost: 0 };
        }
        
        // Roulette selection
        let totalWeight = 0;
        validGoals.forEach(g => totalWeight += g.data.baseProbability);
        
        let randomValue = Math.random() * totalWeight;
        let selectedGoal = validGoals[0];
        
        for (const goal of validGoals) {
            randomValue -= goal.data.baseProbability;
            if (randomValue <= 0) {
                selectedGoal = goal;
                break;
            }
        }
        
        // Update history
        memory.behavior.goalHistory[selectedGoal.name] = currentTick;
        
        console.warn(`[GoalPlanner] Meta Goal seleccionado: ${selectedGoal.name} (Coste: ${selectedGoal.data.cost})`);
        
        return {
            name: selectedGoal.name,
            subGoals: selectedGoal.data.getSubGoals(),
            cost: selectedGoal.data.cost
        };
    }
}
