export class AttackAction {
    static execute(brain, targetPlayer) {
        // Spawnear a Herobrine cerca del jugador
        const loc = targetPlayer.location;
        const viewDir = targetPlayer.getViewDirection();
        
        // Spawnear a 5 bloques de distancia
        const targetLoc = {
            x: loc.x + (viewDir.x * 5),
            y: loc.y + 1,
            z: loc.z + (viewDir.z * 5)
        };

        const entity = brain.systems.spawnSystem.spawnTestEntity(targetPlayer, targetLoc);
        
        if (entity) {
            // targetPlayer.sendMessage("§a[Debug] Entidad invocada con éxito en AttackAction.");
            
            // Evaluación de Riesgo
            let armorScore = 0;
            try {
                const equipment = targetPlayer.getComponent("equippable");
                if (equipment) {
                    if (equipment.getEquipment("Head")) armorScore++;
                    if (equipment.getEquipment("Chest")) armorScore++;
                    if (equipment.getEquipment("Legs")) armorScore++;
                    if (equipment.getEquipment("Feet")) armorScore++;
                }
            } catch(e) {}

            if (armorScore >= 3 || Math.random() < 0.2) {
                // Jugador muy peligroso: Invocación de ilusiones / Zombis
                console.warn("[HerobrineAI] Jugador peligroso. Herobrine invoca secuaces.");
                try {
                    targetPlayer.dimension.spawnEntity("minecraft:zombie", targetLoc);
                    targetPlayer.dimension.spawnEntity("minecraft:zombie", { x: targetLoc.x + 2, y: targetLoc.y, z: targetLoc.z });
                    targetPlayer.playSound("mob.zombie.say", { location: targetLoc });
                    // Herobrine desaparece
                    brain.forceEscape();
                    return; // No atacar directamente
                } catch(e) {}
            }

            // Activar estado de ataque en el BP (provoca que corra hacia el jugador)
            entity.triggerEvent("antigravity:start_attack");
            
            try {
                // Efectos de trueno (sin destruir terreno)
                targetPlayer.dimension.runCommand(`summon lightning_bolt ${targetLoc.x} ${targetLoc.y} ${targetLoc.z}`);
            } catch (e) {}
            targetPlayer.sendMessage("§a[Debug] AttackAction finalizado.");
        } else {
            targetPlayer.sendMessage("§c[Debug] Falló la invocación de la entidad.");
        }
    }
}
