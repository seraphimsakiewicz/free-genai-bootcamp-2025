
class BaseScene extends Phaser.Scene {
    constructor(config) {
        super(config);
    }

    init() {
        this.g = this.game.registry.get('globalManagers');
    }

    create() {
        this.registerEvents();
    }

    changeScene(sceneKey, data = {}) {
        this.deregisterEvents();
        this.scene.start(sceneKey, data);
    }

    
    registerEvents() {
        //override with your implementation
    }
    
    deregisterEvents() {
        //override with your implementation
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = BaseScene;
}
