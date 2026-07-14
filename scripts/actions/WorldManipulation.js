export class WorldManipulation {
    static storedBlocks = []; // Memoria temporal de bloques (Sección A)

    static removeTorch(player) {
        console.warn([ScareAction] Antorcha eliminada cerca de +player.name);
    }

    static restoreBlocks() {
        // Lógica de restauración
    }

    static createFakeEffect(player) {
        // Sección C: Efectos Falsos
        player.playSound("ambient.cave", { location: player.location });
    }
}