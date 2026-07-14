import { world } from "@minecraft/server";

export class SpawnSystem {
    constructor() {
        this.activeEntity = null;
    }

    spawnTestEntity(player, location) {
        this.despawn(); // Solo uno activo
        try {
            const entity = player.dimension.spawnEntity("minecraft:ender_dragon", location);
            entity.nameTag = "Herobrine";
            entity.addTag("herobrine_test");
            // Efectos visuales de protección para prueba
            entity.runCommand("effect @s resistance 999999 255 true");
            entity.runCommand("effect @s slowness 999999 10 true");
            this.activeEntity = entity;
            console.warn("[SpawnSystem] Entidad invocada en " + location.x + ", " + location.y + ", " + location.z);
            return entity;
        } catch (e) {
            console.error("[SpawnSystem] Error invocando:", e);
        }
        return null;
    }

    despawn() {
        if (this.activeEntity && this.activeEntity.isValid()) {
            this.activeEntity.dimension.spawnParticle("minecraft:huge_explosion_emitter", this.activeEntity.location);
            this.activeEntity.runCommand("playsound mob.endermen.portal @a ~ ~ ~");
            this.activeEntity.remove();
        }
        this.activeEntity = null;
    }
}