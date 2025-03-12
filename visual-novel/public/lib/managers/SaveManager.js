/**
 * SaveManager.js
 * Handles saving and loading game data with multiple save slots
 */
class SaveManager {
    constructor(globalManagers) {
        this.g = globalManagers;
        this.saveKeyPrefix = 'visual-novel-save-';
        this.maxSlots = 6; // Maximum number of save slots
        this.currentSave = null;
        this.defaultSave = {
            sceneId: 'scene001',
            chapterId: 1,
            dialogId: '000',
            timestamp: null
        };
    }
    
    new(){
        this.currentSave = { ...this.defaultSave };
    }

    load(slot = null) {
        this.currentSave = this._load(slot);
    }

    get(key){
        return this.currentSave[key]
    }

    set(key, value){
        if (key in this.currentSave){
            this.currentSave[key]= value
        }
    }
    
    /**
     * Load save data from a specific slot
     * @param {number} slot - The save slot to load from (1-based index)
     * @returns {Object} The loaded save data
     */
    _load(slot = null) {
        // if slot null that it should try to load the slot data that was saved last.

        try {
            const saveKey = this.getSaveKey(slot);
            const savedData = localStorage.getItem(saveKey);
            
            if (savedData) {
                this.currentSave = { ...this.defaultSave, ...JSON.parse(savedData) };
                console.log(`Save loaded successfully from slot ${slot}`);
            } else {
                console.log(`No saved data found in slot ${slot}, using defaults`);
                this.currentSave = { ...this.defaultSave };
            }
            
            return this.currentSave;
        } catch (error) {
            console.error('Error loading save:', error);
            this.currentSave = { ...this.defaultSave };
            return this.currentSave;
        }
    }
    
    /**
     * Save data to a specific slot
     * @param {number} slot - The save slot to save to (1-based index)
     * @param {Object} data - Additional data to include in the save
     * @returns {boolean} Whether the save was successful
     */
    save(slot = 1, data = {}) {
        try {
            // Create save data with timestamp
            const saveData = { 
                ...this.currentSave, 
                ...data,
                timestamp: new Date().toISOString() 
            };
            
            // Save to localStorage with the appropriate key
            const saveKey = this.getSaveKey(slot);
            localStorage.setItem(saveKey, JSON.stringify(saveData));
            
            // Update the current save
            this.currentSave = saveData;
            
            console.log(`Save saved successfully to slot ${slot}`);
            return true;
        } catch (error) {
            console.error('Error saving save:', error);
            return false;
        }
    }
    

    /**
     * Get the localStorage key for a specific save slot
     * @param {number} slot - The save slot (1-based index)
     * @returns {string} The localStorage key
     */
    getSaveKey(slot) {
        // Ensure slot is within valid range
        slot = Math.max(1, Math.min(this.maxSlots, slot));
        return `${this.saveKeyPrefix}${slot}`;
    }
    
    /**
     * Check if a save exists in a specific slot
     * @param {number} slot - The save slot to check
     * @returns {boolean} Whether a save exists in the slot
     */
    hasSave(slot) {
        return localStorage.getItem(this.getSaveKey(slot)) !== null;
    }
    
    /**
     * Get a list of all available saves
     * @returns {Array} Array of save metadata objects
     */
    getAllSaves() {
        const saves = [];
        
        for (let slot = 1; slot <= this.maxSlots; slot++) {
            const saveKey = this.getSaveKey(slot);
            const savedData = localStorage.getItem(saveKey);
            
            if (savedData) {
                try {
                    const saveData = JSON.parse(savedData);
                    saves.push({
                        slot,
                        timestamp: saveData.timestamp,
                        chapter: saveData.currentChapter,
                        scene: saveData.currentScene,
                        // Add any other metadata you want to display
                    });
                } catch (e) {
                    console.error(`Error parsing save in slot ${slot}:`, e);
                }
            }
        }
        
        return saves;
    }
    
    /**
     * Delete a save from a specific slot
     * @param {number} slot - The save slot to delete
     */
    deleteSave(slot) {
        const saveKey = this.getSaveKey(slot);
        localStorage.removeItem(saveKey);
        console.log(`Save in slot ${slot} deleted`);
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = SaveManager;
}
