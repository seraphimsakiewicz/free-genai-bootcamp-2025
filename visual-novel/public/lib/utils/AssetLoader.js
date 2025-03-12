/**
 * AssetLoader.js
 * Helper methods for loading assets
 */
class AssetLoader {
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * Preload a list of images
     * @param {Array} images - Array of image objects with id and path properties
     * @param {string} basePath - Base path to prepend to all image paths
     */
    preloadImages(images, basePath = 'assets/') {
        if (!images || !Array.isArray(images)) {
            console.error('Invalid images array provided to AssetLoader.preloadImages');
            return;
        }
        
        for (const image of images) {
            if (!image.id || !image.path) {
                console.warn('Invalid image object in preloadImages, skipping', image);
                continue;
            }
            
            this.scene.load.image(image.id, basePath + image.path);
        }
    }
    
    /**
     * Preload a list of audio files
     * @param {Array} audioFiles - Array of audio objects with id and path properties
     * @param {string} basePath - Base path to prepend to all audio paths
     */
    preloadAudio(audioFiles, basePath = 'assets/audio/') {
        if (!audioFiles || !Array.isArray(audioFiles)) {
            console.error('Invalid audio array provided to AssetLoader.preloadAudio');
            return;
        }
        
        for (const audio of audioFiles) {
            if (!audio.id || !audio.path) {
                console.warn('Invalid audio object in preloadAudio, skipping', audio);
                continue;
            }
            
            const extension = audio.path.split('.').pop().toLowerCase();
            
            if (['mp3', 'ogg', 'wav'].includes(extension)) {
                this.scene.load.audio(audio.id, basePath + audio.path);
            } else {
                console.warn(`Unsupported audio format for file: ${audio.path}`);
            }
        }
    }
    
    /**
     * Preload a list of sprite sheets
     * @param {Array} spriteSheets - Array of sprite sheet objects
     * @param {string} basePath - Base path to prepend to all sprite sheet paths
     */
    preloadSpriteSheets(spriteSheets, basePath = 'assets/') {
        if (!spriteSheets || !Array.isArray(spriteSheets)) {
            console.error('Invalid spriteSheets array provided to AssetLoader.preloadSpriteSheets');
            return;
        }
        
        for (const sheet of spriteSheets) {
            if (!sheet.id || !sheet.path || !sheet.frameWidth || !sheet.frameHeight) {
                console.warn('Invalid sprite sheet object in preloadSpriteSheets, skipping', sheet);
                continue;
            }
            
            this.scene.load.spritesheet(
                sheet.id,
                basePath + sheet.path,
                {
                    frameWidth: sheet.frameWidth,
                    frameHeight: sheet.frameHeight,
                    margin: sheet.margin || 0,
                    spacing: sheet.spacing || 0
                }
            );
        }
    }
    
    /**
     * Preload JSON data files
     * @param {Array} dataFiles - Array of data file objects with id and path properties
     * @param {string} basePath - Base path to prepend to all data paths
     */
    preloadData(dataFiles, basePath = 'data/') {
        if (!dataFiles || !Array.isArray(dataFiles)) {
            console.error('Invalid data files array provided to AssetLoader.preloadData');
            return;
        }
        
        for (const data of dataFiles) {
            if (!data.id || !data.path) {
                console.warn('Invalid data object in preloadData, skipping', data);
                continue;
            }
            
            this.scene.load.json(data.id, basePath + data.path);
        }
    }
    
    /**
     * Create a loading bar
     * @param {number} x - X position of the loading bar
     * @param {number} y - Y position of the loading bar
     * @param {number} width - Width of the loading bar
     * @param {number} height - Height of the loading bar
     * @param {number} padding - Padding around the loading bar
     */
    createLoadingBar(x, y, width = 400, height = 40, padding = 2) {
        const progressBox = this.scene.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(x - padding, y - padding, width + (padding * 2), height + (padding * 2));
        
        const progressBar = this.scene.add.graphics();
        
        // Loading text
        const loadingText = this.scene.add.text(x + (width / 2), y - 30, 'Loading...', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5);
        
        // Percentage text
        const percentText = this.scene.add.text(x + (width / 2), y + height + 20, '0%', {
            fontFamily: 'Arial',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5);
        
        // Update the loading bar as assets are loaded
        this.scene.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x7289DA, 1);
            progressBar.fillRect(x, y, width * value, height);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        // Clean up when loading is complete
        this.scene.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        return { progressBar, progressBox, loadingText, percentText };
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = AssetLoader;
}
