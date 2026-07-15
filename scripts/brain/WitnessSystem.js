export class WitnessSystem {
    // Retorna un bloque/coordenada detrás del jugador, fuera de su FOV.
    static getHiddenLocation(player, minDistance = 5, maxDistance = 15) {
        const loc = player.location;
        const viewDir = player.getViewDirection();
        
        // El vector inverso a donde mira (hacia atrás)
        const backDir = {
            x: -viewDir.x,
            z: -viewDir.z
        };

        const dist = minDistance + Math.random() * (maxDistance - minDistance);
        
        // Añadimos algo de desviación aleatoria lateral
        const offsetX = (Math.random() - 0.5) * 5;
        const offsetZ = (Math.random() - 0.5) * 5;

        const targetX = Math.floor(loc.x + (backDir.x * dist) + offsetX);
        const targetZ = Math.floor(loc.z + (backDir.z * dist) + offsetZ);

        return { x: targetX, y: Math.floor(loc.y), z: targetZ };
    }

    // Calcula si una coordenada está dentro del cono visual frontal del jugador
    static isLookingAt(player, targetLoc) {
        const loc = player.location;
        const viewDir = player.getViewDirection();
        
        const toTarget = {
            x: targetLoc.x - loc.x,
            y: targetLoc.y - loc.y,
            z: targetLoc.z - loc.z
        };

        const magnitude = Math.sqrt(toTarget.x**2 + toTarget.y**2 + toTarget.z**2);
        if (magnitude === 0) return true;

        const normToTarget = {
            x: toTarget.x / magnitude,
            y: toTarget.y / magnitude,
            z: toTarget.z / magnitude
        };

        // Producto escalar (Dot Product)
        const dot = (viewDir.x * normToTarget.x) + (viewDir.y * normToTarget.y) + (viewDir.z * normToTarget.z);

        // Si dot > 0.5 (aprox 60 grados), está en su campo de visión.
        return dot > 0.5;
    }
}
