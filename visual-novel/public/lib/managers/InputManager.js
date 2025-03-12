/**
 * InputManager.js
 * Handles keyboard and mouse input for the game
 */
class InputManager {
    constructor(scene) {
        this.scene = scene;
    }
    
    create() {
        this.setupInputHandlers();
        this.setupAdditionalKeyboardShortcuts()
    }
    
    setupInputHandlers() {
        // Add click/tap handler
        this.scene.input.on('pointerdown', (pointer) => {
            // All dialog advancement is now handled by the next button
            // This handler remains only for other UI interactions
            if (this.scene.uiManager.isClickingUIElement(pointer)) {
                return;
            }
            
            // No longer advance dialog by clicking anywhere
        });
        
        // Add keyboard handlers
        this.scene.input.keyboard.on('keydown-SPACE', () => {
            // Space advances dialog just like clicking the next button
            if (this.scene.dialogManager.isTyping) {
                this.scene.dialogManager.completeTypingImmediately();
            } else if (this.scene.dialogManager.dialogComplete && !this.scene.dialogManager.choosingOption) {
                this.scene.dialogManager.advanceDialog();
            }
        });
        
        // ESC key to open settings
        this.scene.input.keyboard.on('keydown-ESC', () => {
            this.scene.openSettings();
        });
        
        // Additional keyboard shortcuts
        this.setupAdditionalKeyboardShortcuts();
    }
    
    setupAdditionalKeyboardShortcuts() {
        // Auto mode toggle (A key)
        this.scene.input.keyboard.on('keydown-A', () => {
            this.scene.toggleAutoMode();
        });
        
        // Skip mode toggle (S key)
        this.scene.input.keyboard.on('keydown-S', () => {
            this.scene.toggleSkipMode();
        });
        
        // Save game (F5 key)
        this.scene.input.keyboard.on('keydown-F5', () => {
            this.scene.saveManager.saveGame();
        });
        
        // Load game (F9 key)
        this.scene.input.keyboard.on('keydown-F9', () => {
            this.scene.saveManager.loadGame();
        });
        
        // Language toggle (L key)
        this.scene.input.keyboard.on('keydown-L', () => {
            this.scene.toggleLanguage();
        });
        
        // Help screen (H key)
        this.scene.input.keyboard.on('keydown-H', () => {
            this.scene.scene.start('LanguageHelp');
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = InputManager;
}
