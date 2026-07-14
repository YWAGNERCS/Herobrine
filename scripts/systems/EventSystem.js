import { world } from "@minecraft/server";

export class EventSystem {
    constructor() {
        this.brain = null;
    }

    setBrain(brain) {
        this.brain = brain;
    }

    addInterest(player, amount, reason) {
        if (!this.brain) return;
        const mem = this.brain.getMemory(player);
        mem.player.interestLevel += amount;
        this.brain.saveMemories();
        console.warn("[HerobrineAI] Interés sobre " + player.name + " cambió: " + (amount > 0 ? '+' : '') + amount + " (" + reason + "). Total: " + mem.player.interestLevel);
    }
    
    addFear(player, amount, reason) {
        if (!this.brain) return;
        const mem = this.brain.getMemory(player);
        mem.player.fearLevel += amount;
        this.brain.saveMemories();
        console.warn("[HerobrineAI] Miedo de " + player.name + " cambió: " + (amount > 0 ? '+' : '') + amount + " (" + reason + "). Total: " + mem.player.fearLevel);
    }

    init() {
        // Jugador entra al mundo
        world.afterEvents.playerSpawn.subscribe((event) => {
            if (event.initialSpawn) {
                this.addInterest(event.player, 1, "Entró al mundo");
            }
        });

        // Evento de poner bloque (Simulando "Construye una casa")
        world.afterEvents.playerPlaceBlock.subscribe((event) => {
            if (event.player) {
                if (Math.random() < 0.05) {
                    this.addInterest(event.player, 1, "Construyendo (bloque colocado)");
                    
                    // Guardar posible ubicación de casa (con dimensión)
                    if (this.brain) {
                        const mem = this.brain.getMemory(event.player);
                        mem.house.homeLocation = {
                            x: event.block.location.x,
                            y: event.block.location.y,
                            z: event.block.location.z,
                            dimension: event.dimension.id
                        };
                        this.brain.saveMemories();
                    }
                }
            }
        });

        // Encontrar diamantes (romper mineral de diamante)
        world.afterEvents.playerBreakBlock.subscribe((event) => {
            const blockId = event.brokenBlockPermutation.type.id;
            if (event.player && (blockId === "minecraft:diamond_ore" || blockId === "minecraft:deepslate_diamond_ore")) {
                this.addInterest(event.player, 10, "Encontró diamantes");
                if (this.brain) {
                    const mem = this.brain.getMemory(event.player);
                    mem.player.confidenceLevel = Math.min(100, mem.player.confidenceLevel + 20);
                    this.brain.saveMemories();
                }
            }
        });

        // Jugador muere
        world.afterEvents.entityDie.subscribe((event) => {
            if (event.deadEntity.typeId === "minecraft:player") {
                const player = world.getAllPlayers().find(p => p.id === event.deadEntity.id);
                if (player) {
                    this.addInterest(player, -5, "Murió");
                }
            }
        });

        // Jugador recibe daño de monstruos
        world.afterEvents.entityHurt.subscribe((event) => {
            if (event.hurtEntity.typeId === "minecraft:player") {
                if (this.brain) {
                    const player = world.getAllPlayers().find(p => p.id === event.hurtEntity.id);
                    if (player) {
                        const mem = this.brain.getMemory(player);
                        mem.player.stressLevel = Math.min(100, mem.player.stressLevel + 15);
                        this.brain.saveMemories();
                    }
                }
            }
            
            if (event.hurtEntity.typeId === "antigravity:herobrine") {
                if (this.brain) {
                    console.warn("[HerobrineAI] ¡Herobrine recibió daño! Iniciando retirada táctica...");
                    let attacker = null;
                    if (event.damageSource && event.damageSource.damagingEntity && event.damageSource.damagingEntity.typeId === "minecraft:player") {
                        attacker = world.getAllPlayers().find(p => p.id === event.damageSource.damagingEntity.id);
                    }
                    this.brain.forceEscape(attacker);
                }
            }
        });
    }
}