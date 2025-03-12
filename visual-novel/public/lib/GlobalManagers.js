/**
 * GlobalManagers.js
 * Manages game-wide components that should persist across scene transitions
 */
class GlobalManagers {
    constructor(game) {
        this.game = game;
        
        // Managers that should be available globally
        this.audio = null;
        this.settings = null;
        this.saves = null;
        
        // Initialize EventBus if not already done
        if (!window.eventBus) {
            window.eventBus = new EventBus();
        }
        
        this.eventBus = window.eventBus;
    }
    asfafsdsfadasdfasdfasdfasdf
    /**
     * Initialize all global managers
     * @param {Phaser.Scene} initialScene - The first scene to initialize managers with
     */
    create() {
        // Before anything else need to make sure
        // we load our settings because other managers
        // rely on it
        this.settings = new SettingsManager(this);
        this.settings.load();

        this.saves = new SaveManager(this);

        this.audio = new AudioManager(this);

        this.ui = new UIManager(this);

        
        // Setup global event listeners
        this.setupEventListeners();
        
        // Store reference in the registry so all scenes can access it
        this.game.registry.set('globalManagers', this);
        
        // Also store in window for easy access
        window.globalManagers = this;
    }
    
    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Audio events
        this.eventBus.on('audio:play-bgm', data => { 
            this.audio.playBackgroundMusic(data.key, data.config); 
        });
        
        this.eventBus.on('audio:stop-bgm', () => { 
            this.audio.stopBackgroundMusic(); 
        });
        
        this.eventBus.on('audio:play-sfx', data => { 
            this.audio.playSoundEffect(data.key, data.config); 
        });
        
        // Settings events
        this.eventBus.on('settings:update', data => { 
            this.settings.updateSettings(data); 
        });
        
        // Save/Load events  
        this.eventBus.on('save:game', data => { 
            // data should contain a slot number and any additional game state to save
            const slot = data.slot || 1;
            delete data.slot; // Remove slot from the data to be saved
            
            // Save to the specified slot
            this.saves.save(slot, data);
            
            // Show notification
            if (this.scene) {
                // If we have a scene reference with a UI manager
                if (this.scene.uiManager) {
                    this.scene.uiManager.showNotification(`Game saved to slot ${slot}!`);
                } else {
                    console.log(`Game saved to slot ${slot}!`);
                }
            }
        });
        
        this.eventBus.on('load:game', data => { 
            // Load from the specified slot
            const slot = data.slot || 1;
            const saveData = this.saves.load(slot);
            
            if (!saveData) {
                console.warn(`No save found in slot ${slot}`);
                return;
            }

            // Play transition sound if we have a scene with audio
            if (this.scene && this.audio) {
                this.audio.playSoundEffect('transition');
            }
            
            // Add a visual transition if we have a scene
            if (this.scene) {
                this.scene.cameras.main.fade(500, 0, 0, 0, false, (camera, progress) => {
                    if (progress === 1) {
                        // Restart the current scene with the loaded game settings
                        this.scene.scene.restart({
                            saveData: saveData
                        });
                    }
                });
                
                // Show notification
                if (this.scene.uiManager) {
                    this.scene.uiManager.showNotification(`Game loaded from slot ${slot}!`);
                } else {
                    console.log(`Game loaded from slot ${slot}!`);
                }
            }
        });
        
        // New event to get all save slots
        this.eventBus.on('save:list', (callback) => {
            const saves = this.saves.getAllSaves();
            if (typeof callback === 'function') {
                callback(saves);
            }
        });
        
        // New event to delete a save slot
        this.eventBus.on('save:delete', (data) => {
            const slot = data.slot || 1;
            this.saves.deleteSave(slot);
            
            // Show notification
            if (this.scene && this.scene.uiManager) {
                this.scene.uiManager.showNotification(`Save in slot ${slot} deleted!`);
            } else {
                console.log(`Save in slot ${slot} deleted!`);
            }
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = GlobalManagers;
}
