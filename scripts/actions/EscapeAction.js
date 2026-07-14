export class EscapeAction {
    static execute(brain) {
        brain.systems.spawnSystem.despawn();
    }
}