import { world } from "@minecraft/server";
import { Memory } from "./Memory.js";

const STORAGE_KEY = "Herobrine_Memories";

export class MemoryManager {
    constructor() {
        this.memories = new Map(); // playerName -> Memory Object
    }

    loadMemories() {
        try {
            const dataStr = world.getDynamicProperty(STORAGE_KEY);
            if (dataStr) {
                const parsed = JSON.parse(dataStr);
                for (const playerName in parsed) {
                    this.memories.set(playerName, parsed[playerName]);
                }
                console.warn("[HerobrineAI] Memorias cargadas exitosamente.");
            } else {
                console.warn("[HerobrineAI] No hay memorias previas. Iniciando desde cero.");
            }
        } catch (e) {
            console.error("[HerobrineAI] Error al cargar memorias:", e);
        }
    }

    saveMemories() {
        try {
            const dataObj = {};
            this.memories.forEach((memory, playerName) => {
                dataObj[playerName] = memory;
            });
            const dataStr = JSON.stringify(dataObj);
            world.setDynamicProperty(STORAGE_KEY, dataStr);
        } catch (e) {
            console.error("[HerobrineAI] Error al guardar memorias:", e);
        }
    }

    getMemory(player) {
        if (!this.memories.has(player.name)) {
            this.memories.set(player.name, new Memory(player.id, player.name));
            this.saveMemories(); // Guardar al crear una nueva memoria
        }
        return this.memories.get(player.name);
    }
}