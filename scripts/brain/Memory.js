export class Memory {
    constructor(playerName) {
        this.playerName = playerName;
        this.houseLocation = null;
        this.visitedPlaces = [];
        this.timesSeen = 0;
        this.lastAttack = 0;
        this.lastAppearance = 0;
        this.favoriteBiome = null;
        this.fearLevel = 0;
        
        // Seguimiento de tiempo de juego
        this.joinDay = 0; // Día en el que entró por primera vez (se actualizará)
    }
}