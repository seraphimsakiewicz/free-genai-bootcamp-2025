// Import AssetLoader if needed, but we'll assume it's globally available
// through a script tag in the HTML file

// https://github.com/jdotrjs/phaser-guides/blob/master/Basics/Part3.md

class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Initialize AssetLoader
        this.assetLoader = new AssetLoader(this);
        
        // Load minimal assets needed for the loading screen
        this.assetLoader.preloadImages([
            { id: 'loading-bg', path: 'ui/loading-background.png' },
            { id: 'loading-bar', path: 'ui/loading-bar.png' }
        ]);
        
        // Create loading bar placeholder images if they don't exist yet
        this.createPlaceholderImages();
        
        // Initialize global managers
        this.initializeGlobalManagers();
    }
    
    /**
     * Initialize global managers that should persist across scenes
     */
    initializeGlobalManagers() {
        // Create global managers instance once and store it in registry
        const globalManagers = new GlobalManagers(this.game);
        
        // Store the instance in registry for later initialization
        this.game.registry.set('globalManagers', globalManagers);
        
        // Set flag to indicate initialization is pending
        this.game.registry.set('globalManagersPending', true);
    }

    create() {
        // TODO: Should use settinsManager to initialize game settings
        // Does this here?
        //this.initializeGameSettings();
        
        // Transition to the preload scene
        this.scene.start('Preload');
    }
    
    createPlaceholderImages() {
        
        // Generate simple loading background if it doesn't exist
        const loadingBgPath = 'assets/ui/loading-background.png';
        if (!this.textures.exists('loading-bg')) {
            const bgCanvas = document.createElement('canvas');
            bgCanvas.width = 400;
            bgCanvas.height = 40;
            const bgCtx = bgCanvas.getContext('2d');
            bgCtx.fillStyle = '#333333';
            bgCtx.fillRect(0, 0, 400, 40);
            
            // Save the canvas as a data URL
            const bgDataURL = bgCanvas.toDataURL();
            
            // Preload the generated image
            this.textures.addBase64('loading-bg', bgDataURL);
            
            // We'll log that we created a placeholder, but in a real game
            // you would save this file to disk
        }
        
        // Generate simple loading bar if it doesn't exist
        const loadingBarPath = 'assets/ui/loading-bar.png';
        if (!this.textures.exists('loading-bar')) {
            const barCanvas = document.createElement('canvas');
            barCanvas.width = 398;
            barCanvas.height = 38;
            const barCtx = barCanvas.getContext('2d');
            barCtx.fillStyle = '#7289DA'; // Discord-like blue color
            barCtx.fillRect(0, 0, 398, 38);
            
            // Save the canvas as a data URL
            const barDataURL = barCanvas.toDataURL();
            
            // Preload the generated image
            this.textures.addBase64('loading-bar', barDataURL);
            
            // We'll log that we created a placeholder
        }
    }
}
