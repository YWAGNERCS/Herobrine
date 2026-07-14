export class Memory {
    constructor(playerId, playerName) {
        this.player = {
            playerId: playerId,
            playerName: playerName,
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            timesSeen: 0,
            interestLevel: 0,
            fearLevel: 0,
            safetyLevel: 50,
            confidenceLevel: 50,
            stressLevel: 0,
            suspenseLevel: 0
        };
        
        this.house = {
            homeLocation: null,     // { x, y, z, dimension }
            bedLocation: null,      // { x, y, z, dimension }
            chestLocations: [],     // [{ x, y, z, dimension }]
            favoriteRoom: null      // { x, y, z, dimension }
        };
        
        this.world = {
            visitedBiomes: [],
            favoriteBiome: null,
            favoriteCave: null,     // { x, y, z, dimension }
            favoriteMountain: null, // { x, y, z, dimension }
            spawnPoint: null        // { x, y, z, dimension }
        };
        
        this.behavior = {
            lastAppearance: 0,
            lastAttack: 0,
            lastState: 'IdleState',
            daysWithoutAppearing: 0,
            timesFollowed: 0,
            timesEscaped: 0
        };
    }
}