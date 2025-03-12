/**
 * SettingsManager.js
 * Handles game settings and preferences
 */
class SettingsManager {
    constructor(globalManagers) {
        this.g = globalManagers;
        this.settingsKey = 'visual-novel-settings';
        
        // Default settings
        this.defaultSettings = {
            language: 'dual',   // english, japanese, dual
            textSpeed: 30,         // ms per character
            autoAdvanced: false,   // auto-advance dialog
            autoSpeed: 2000,       // ms to wait before advancing in auto mode
            bgmVolume: 0.01,       // 0-1
            sfxVolume: 0.1,        // 0-1
            voiceVolume: 0.1,      // 0-1
            fontSize: 24,          // base font size
            typewriterEffect: true // use typewriter effect for text
        };
    }
    
    /**
     * Update the scene reference
     * @param {Phaser.Scene} scene - The new scene
     */
    updateScene(scene) {
        this.scene = scene;
        
        // Apply current settings to the new scene if it has gameSettings
        if (scene.gameSettings) {
            Object.assign(scene.gameSettings, this.settings);
        }
    }
    
    /**
     * Load settings from local storage
     */
    load() {
        try {
            const savedSettings = localStorage.getItem(this.settingsKey);
            
            if (savedSettings) {
                this.settings = { ...this.defaultSettings, ...JSON.parse(savedSettings) };
                console.log('Settings loaded successfully');
            } else {
                console.log('No saved settings found, using defaults');
                this.settings = { ...this.defaultSettings };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = { ...this.defaultSettings };
        }
        
        return this.settings;
    }
    
    /**
     * Save settings to local storage
     */
    save() {
        try {
            localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
            console.log('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }
    
    
    /**
     * Reset settings to defaults
     */
    resetSettings() {
        this.settings = { ...this.defaultSettings };
        this.save();
    }
    
    /**
     * Get a specific setting
     * @param {string} key - Setting key
     * @returns {any} Setting value
     */
    get(key) {
        return this.settings[key];
    }
    
    /**
     * Update a specific setting
     * @param {string} key - Setting key
     * @param {any} value - New setting value
     */
    update(key, value) {
        if (key in this.settings) {
            this.settings[key] = value;
            this.save();
        }
    }
    
 
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = SettingsManager;
}
