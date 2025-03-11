// Initialize the game when the window loads
window.onload = function() {
    // Create a new Phaser game instance with the configuration
    const game = new Phaser.Game(config);
    
    // Add all scenes to the game
    game.scene.add('Boot', BootScene);
    game.scene.add('Preload', PreloadScene);
    game.scene.add('Menu', MenuScene);
    game.scene.add('Game', GameScene);
    
    // Start with the Boot scene
    game.scene.start('Boot');
};
