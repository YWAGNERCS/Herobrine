import { world } from "@minecraft/server";

export class SpawnSystem {
    constructor() {
        this.activeEntity = null;
    }

    spawnTestEntity(player, location) {
        this.despawn(); // Solo uno activo
        try {
            const entity = player.dimension.spawnEntity("antigravity:herobrine", location);
            entity.nameTag = "Herobrine";
            entity.addTag("herobrine");
            // Efectos eliminados para que pueda moverse libremente
            this.activeEntity = entity;
            console.warn("[SpawnSystem] Entidad invocada en " + location.x + ", " + location.y + ", " + location.z);
            return entity;
        } catch (e) {
            world.sendMessage("§c[SpawnSystem] Error invocando: " + String(e) + " " + String(e.stack));
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