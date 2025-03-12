// Import AssetLoader if needed, but we'll assume it's globally available
// through a script tag in the HTML file

class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        // Initialize AssetLoader
        this.assetLoader = new AssetLoader(this);
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.image(0,0, 'loading-bg')
        .setDisplaySize(width, height)
        .setOrigin(0,0);

        // Create loading bar
        this.loadingBar = this.assetLoader.createLoadingBar(
            width / 2 - 200, 
            height / 2 - 20, 
            400, 
            40, 
            2
        );
        
        // Load all assets using AssetLoader
        this.loadAllAssets();
    }
    
    loadAllAssets() {
        this.loadUIAssets(); // Load UI assets
        this.loadCharacterAssets(); // Load character images
        this.loadBackgroundAssets(); // Load background images
        this.loadAudioAssets(); // Load audio assets
        this.loadDialogAudioAssets(); // Load audio assets for dialog
        this.loadStoryData();  // Load story data
    }

    create() {
        // Complete initialization of global managers now that all assets are loaded
        this.finalizeGlobalManagers();
        
        // Start the menu scene
        this.scene.start('Menu');
    }
    
    /**
     * Complete initialization of global managers after all assets are loaded
     */
    finalizeGlobalManagers() {
        const isPending = this.game.registry.get('globalManagersPending');
        
        if (isPending) {
            // Get the existing GlobalManagers instance from registry
            const globalManagers = this.game.registry.get('globalManagers');
            
            // Now initialize it with all assets loaded
            globalManagers.create(this);

            // Remove the pending flag
            this.game.registry.remove('globalManagersPending');
        }
    }
    

    
    loadUIAssets() {
        // Load UI assets using AssetLoader
        this.assetLoader.preloadImages([
            { id: 'menu-bg', path: 'ui/menu-background.png' },
            { id: 'black-sq', path: 'ui/black-sq.png' },
            { id: 'play-button', path: 'ui/play-button2.png' },
            { id: 'button', path: 'ui/button.png' },
            { id: 'button-hover', path: 'ui/button-hover.png' },
            { id: 'small-button', path: 'ui/small-button.png' },
            { id: 'small-button-hover', path: 'ui/small-button.png' },
        ]);
        
        // Create placeholder UI elements if they don't exist
        this.createPlaceholderUI();
    }
    
    loadCharacterAssets() {
        // Load character sprites
        const characters = [
            { id: 'alex', path: 'characters/alex.png', name: 'Alex Thompson' },
            { id: 'yamamoto', path: 'characters/yamamoto.png', name: 'Yamamoto Sensei' },
            { id: 'minji', path: 'characters/minji.png', name: 'Kim Min-ji' },
            { id: 'carlos', path: 'characters/carlos.png', name: 'Garcia Carlos' },
            { id: 'hiroshi', path: 'characters/hiroshi.png', name: 'Tanaka Hiroshi' },
            { id: 'yuki', path: 'characters/yuki.png', name: 'Nakamura Yuki' },
            { id: 'kenji', path: 'characters/kenji.png', name: 'Suzuki Kenji' },
            { id: 'akiko', path: 'characters/akiko.png', name: 'Watanabe Akiko' }
        ];
        
        // Load character assets using AssetLoader
        this.assetLoader.preloadImages(characters);
    }
    
    loadBackgroundAssets() {
        // Load background images
        const backgrounds = [
            { id: 'apartment', path: 'scenes/apartment.jpg', name: 'Apartment Interior' },
            { id: 'classroom', path: 'scenes/classroom.jpg', name: 'Language School Classroom' },
            { id: 'cafe', path: 'scenes/cafe.jpg', name: 'Cafe Interior' },
            { id: 'post-office', path: 'scenes/post-office.jpg', name: 'Post Office Interior' },
            { id: 'store', path: 'scenes/corner-store.jpg', name: 'Corner Store Interior' }
        ];
        
        // Load background assets using AssetLoader
        this.assetLoader.preloadImages(backgrounds);
    }
    
    loadAudioAssets() {
        // Define audio assets to load
        const audioAssets = [
            { id: 'click', path: 'click.wav' },
            { id: 'transition', path: 'transition.wav' },
            { id: 'bg-music', path: 'bg.wav' }
        ];
        
        // Load audio assets using AssetLoader
        this.assetLoader.preloadAudio(audioAssets);
    }

    loadDialogAudioAssets() {
        // Define audio assets to load
        const audioAssets = [
            { id: 'dialog-wake-up', path: 'dialog/wake-up.mp3' },
        ];
        
        // Load audio assets using AssetLoader
        this.assetLoader.preloadAudio(audioAssets);
    }
    
    loadStoryData() {
        // Define data files to load
        const dataFiles = [
            { id: 'mappings', path: 'mappings.json' },
            { id: 'story-main', path: 'stories/main.json' },
            { id: 'scene-scene001', path: 'scenes/scene001.json' }
            // In a full game, you would load all scenes here
        ];
        
        // Load data files using AssetLoader
        this.assetLoader.preloadData(dataFiles);
    }
    
    createPlaceholderUI() {
        // This function would generate placeholder UI elements if they don't exist
        // Similar to what we did in the BootScene
        
        // In a real implementation, you would check if files exist and create them if not
        // For this demo, we'll assume they don't exist and create basic placeholders
        
        // For example, creating a dialog box placeholder:
        const dialogBox = document.createElement('canvas');
        dialogBox.width = 1000;
        dialogBox.height = 200;
        const dialogCtx = dialogBox.getContext('2d');
        dialogCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        dialogCtx.fillRect(0, 0, 1000, 200);
        dialogCtx.strokeStyle = '#ffffff';
        dialogCtx.lineWidth = 2;
        dialogCtx.strokeRect(2, 2, 996, 196);
        
        // Add the dialog box to the texture manager
        this.textures.addCanvas('dialog-box', dialogBox);
        
        // Create next button placeholder
        const nextButton = document.createElement('canvas');
        nextButton.width = 80;
        nextButton.height = 50;
        const nextButtonCtx = nextButton.getContext('2d');
        nextButtonCtx.fillStyle = '#0077cc';
        nextButtonCtx.fillRect(0, 0, 80, 50);
        nextButtonCtx.strokeStyle = '#ffffff';
        nextButtonCtx.lineWidth = 2;
        nextButtonCtx.strokeRect(2, 2, 76, 46);
        nextButtonCtx.fillStyle = '#ffffff';
        nextButtonCtx.font = '18px Arial';
        nextButtonCtx.textAlign = 'center';
        nextButtonCtx.textBaseline = 'middle';
        nextButtonCtx.fillText('Next', 40, 25);
        this.textures.addCanvas('next-button', nextButton);

        // Create next button hover placeholder
        const nextButtonHover = document.createElement('canvas');
        nextButtonHover.width = 80;
        nextButtonHover.height = 50;
        const nextButtonHoverCtx = nextButtonHover.getContext('2d');
        nextButtonHoverCtx.fillStyle = '#00aaff';
        nextButtonHoverCtx.fillRect(0, 0, 80, 50);
        nextButtonHoverCtx.strokeStyle = '#ffffff';
        nextButtonHoverCtx.lineWidth = 2;
        nextButtonHoverCtx.strokeRect(2, 2, 76, 46);
        nextButtonHoverCtx.fillStyle = '#ffffff';
        nextButtonHoverCtx.font = '18px Arial';
        nextButtonHoverCtx.textAlign = 'center';
        nextButtonHoverCtx.textBaseline = 'middle';
        nextButtonHoverCtx.fillText('Next', 40, 25);
        this.textures.addCanvas('next-button-hover', nextButtonHover);
        
        // Similarly for other UI elements...
    }
}
