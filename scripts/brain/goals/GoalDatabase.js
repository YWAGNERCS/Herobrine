export const GoalDatabase = {
    "ObserveHome": {
        baseProbability: 40,
        cost: 15,
        cooldownTicks: 20 * 60 * 10, // 10 minutos
        checkRequirements: (memory, player, worldSystem) => {
            return memory.player.safetyLevel > 60 && memory.house.homeLocation != null;
        },
        getSubGoals: () => [
            { type: "FindObservationPoint", duration: 20 * 3, priority: "High" },
            { type: "LookAtPlayer", duration: 20 * 15, priority: "Medium" },
            { type: "Disappear", duration: 20 * 1, priority: "High" }
        ]
    },
    "ControlTerritory": {
        baseProbability: 30,
        cost: 35,
        cooldownTicks: 20 * 60 * 15, // 15 minutos
        checkRequirements: (memory, player, worldSystem) => {
            // Mejor en minas o biomas oscuros
            return player.dimension.id !== "minecraft:overworld" || player.location.y < 50;
        },
        getSubGoals: () => [
            { type: "SpawnSounds", duration: 20 * 5, priority: "Medium" },
            { type: "ApplyBlindness", duration: 20 * 2, priority: "Medium" },
            { type: "AggressiveStalk", duration: 20 * 10, priority: "Low" },
            { type: "Disappear", duration: 20 * 1, priority: "High" }
        ]
    },
    "PsychologicalPressure": {
        baseProbability: 25,
        cost: 25,
        cooldownTicks: 20 * 60 * 5, // 5 minutos
        checkRequirements: (memory, player, worldSystem) => {
            return true; // Puede ocurrir en cualquier momento
        },
        getSubGoals: () => [
            { type: "ManipulateEnvironment", duration: 20 * 2, priority: "High" },
            { type: "DistantAppearance", duration: 20 * 5, priority: "Medium" },
            { type: "Disappear", duration: 20 * 1, priority: "High" }
        ]
    },
    "EliminateTarget": {
        baseProbability: 5,
        cost: 90,
        cooldownTicks: 20 * 60 * 60, // 1 hora
        checkRequirements: (memory, player, worldSystem) => {
            return memory.player.confidenceLevel > 80 && memory.player.safetyLevel < 50;
        },
        getSubGoals: () => [
            { type: "SpawnSecuaces", duration: 20 * 2, priority: "Low" },
            { type: "LightningStrike", duration: 20 * 1, priority: "High" },
            { type: "MeleeAttack", duration: 20 * 30, priority: "High" },
            { type: "Disappear", duration: 20 * 1, priority: "High" }
        ]
    },
    "DoNothing": {
        baseProbability: 20,
        cost: 0,
        cooldownTicks: 0,
        checkRequirements: (memory, player, worldSystem) => {
            return true;
        },
        getSubGoals: () => [
            { type: "WaitInvisible", duration: 20 * 10, priority: "High" }
        ]
    }
};
