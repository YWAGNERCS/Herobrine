export class Personality {
    constructor() {
        this.patience = 80;    // 0-100: Alta paciencia = espera más entre ataques
        this.aggression = 50;  // 0-100: Cuánto daño/ataque directo hace
        this.curiosity = 70;   // 0-100: Probabilidad de Investigating
        this.stealth = 90;     // 0-100: Probabilidad de Stalking / desaparecer rápido
        this.cruelty = 40;     // 0-100: Interacción con el entorno (quitar antorchas, matar mascotas)
    }
}