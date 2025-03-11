// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#ffffff',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080,
        parent: 'game-container',
        expandParent: true
    },
    scene: [], // Scenes will be added in main.js
    //physics: {
    //    default: 'arcade',
    //    arcade: {
    //        gravity: { y: 0 },
    //        debug: false
    //    }
    //},
    dom: {
        createContainer: true
    }
};
