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
        console.warn([HerobrineAI] Interés sobre +player.name+ cambió: +(amount > 0 ? '+' : '')+amount+ (+reason+). Total: +mem.player.interestLevel);
    }
    
    addFear(player, amount, reason) {
        if (!this.brain) return;
        const mem = this.brain.getMemory(player);
        mem.player.fearLevel += amount;
        this.brain.saveMemories();
        console.warn([HerobrineAI] Miedo de +player.name+ cambió: +(amount > 0 ? '+' : '')+amount+ (+reason+). Total: +mem.player.fearLevel);
    }

    init() {
        // Jugador entra al mundo
        world.afterEvents.playerSpawn.subscribe((event) => {
            if (event.initialSpawn) {
                this.addInterest(event.player, 1, "Entró al mundo");
            }
        });

        // Evento de poner bloque (Simulando "Construye una casa")
        world.afterEvents.blockPlace.subscribe((event) => {
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
        world.afterEvents.blockBreak.subscribe((event) => {
            const blockId = event.brokenBlockPermutation.type.id;
            if (event.player && (blockId === "minecraft:diamond_ore" || blockId === "minecraft:deepslate_diamond_ore")) {
                this.addInterest(event.player, 10, "Encontró diamantes");
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
    }
}