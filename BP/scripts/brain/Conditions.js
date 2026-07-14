export class Conditions {
    static getInventoryInterest(player) {
        let extraInterest = 0;
        try {
            const inventory = player.getComponent("minecraft:inventory").container;
            for (let i = 0; i < inventory.size; i++) {
                const item = inventory.getItem(i);
                if (!item) continue;
                
                const id = item.typeId;
                if (id.includes("iron_")) extraInterest = Math.max(extraInterest, 5);
                if (id.includes("gold_")) extraInterest = Math.max(extraInterest, 8);
                if (id.includes("diamond_")) extraInterest = Math.max(extraInterest, 20);
                if (id.includes("netherite_")) extraInterest = Math.max(extraInterest, 35);
                if (id.includes("elytra")) extraInterest = Math.max(extraInterest, 40);
                if (id.includes("totem_of_undying")) extraInterest = Math.max(extraInterest, 30);
            }
        } catch (e) {}
        return extraInterest;
    }

    static isPlayerInjured(player) {
        try {
            const health = player.getComponent("minecraft:health");
            return health.currentValue < health.defaultValue * 0.5; // Menos del 50% de vida
        } catch (e) { return false; }
    }
}