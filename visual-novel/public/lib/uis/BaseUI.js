class BaseUI {
    constructor(scene) {
        this.scene = scene;
        this.uiElements = [];
        this.interactiveElements = [];
        this.disabledObjects = [];
        this.isVisible = false;
        this.isEnabled = false;
    }

    /**
     * Register a UI element to be managed by this class
     * @param {Phaser.GameObjects.GameObject} element - The UI element to register
     * @param {boolean} isInteractive - Whether this element receives input
     */
    registerElement(element, isInteractive = false) {
        if (!element) return;
        
        this.uiElements.push(element);
        
        if (isInteractive) {
            this.interactiveElements.push(element);
        }
    }

    /**
     * Register multiple UI elements at once
     * @param {Array<Phaser.GameObjects.GameObject>} elements - Array of UI elements
     * @param {boolean} areInteractive - Whether these elements receive input
     */
    registerElements(elements, areInteractive = false) {
        if (!elements || !Array.isArray(elements)) return;
        
        elements.forEach(element => {
            this.registerElement(element, areInteractive);
        });
    }

    /**
     * Set visibility of all registered UI elements
     * @param {boolean} visible - Whether elements should be visible
     */
    visible(visible) {
        this.isVisible = visible;
        
        // Update visibility of all registered elements
        this.uiElements.forEach(element => {
            if (element && typeof element.setVisible === 'function') {
                element.setVisible(visible);
            }
        });
        
        // If hiding UI, make sure to blur any focused text inputs
        if (!visible) {
            this.interactiveElements.forEach(element => {
                if (element && element.blur && typeof element.blur === 'function') {
                    element.blur();
                }
            });
        }
    }

    /**
     * Enable or disable input on all interactive elements in the scene
     * @param {boolean} enabled - Whether input should be enabled
     */
    enabled(enabled) {
        this.isEnabled = enabled;
        
        if (enabled) {
            // Enable our UI's interactive elements
            this.interactiveElements.forEach(element => {
                if (element && typeof element.setInteractive === 'function') {
                    element.setInteractive();
                }
            });
            
            // Re-enable previously disabled scene objects
            if (this.disabledObjects && this.disabledObjects.length > 0) {
                this.disabledObjects.forEach(item => {
                    if (item.wasEnabled && item.object && typeof item.object.setInteractive === 'function') {
                        item.object.setInteractive();
                    }
                });
                this.disabledObjects = [];
            }
        } else {
            // Disable our UI's interactive elements if we're hiding them completely
            if (!this.isVisible) {
                this.interactiveElements.forEach(element => {
                    if (element && typeof element.disableInteractive === 'function') {
                        element.disableInteractive();
                    }
                });
            }
            
            // Disable our UI's interactive elements if we're hiding them completely
            if (!this.isVisible) {
                this.interactiveElements.forEach(element => {
                    if (element && typeof element.disableInteractive === 'function') {
                        element.disableInteractive();
                    }
                });
            }
            
            // Just maintain our disabledObjects array for now
            // We're not trying to disable other objects automatically
            this.disabledObjects = [];
            
            // NOTE: In the future, to disable other scene objects we could use:
            // this.scene.children.list to get all scene objects and filter for those with input
        }
    }
    
    /**
     * Check if an object is part of this UI
     * @param {Phaser.GameObjects.GameObject} obj - The object to check
     * @returns {boolean} - Whether this object is part of our UI
     */
    isOwnUIElement(obj) {
        return this.uiElements.includes(obj);
    }
    
    /**
     * Show this UI and enable its input
     */
    show() {
        this.visible(true);
        this.enabled(true);
    }
    
    /**
     * Hide this UI and disable its input
     */
    hide() {
        this.visible(false);
        this.enabled(false);
    }
    
    /**
     * Destroy all UI elements and clean up event listeners
     */
    destroy() {
        // Re-enable any disabled scene objects
        this.enabled(true);
        
        // Destroy all registered elements
        this.uiElements.forEach(element => {
            if (element && typeof element.destroy === 'function') {
                element.destroy();
            }
        });
        
        this.uiElements = [];
        this.interactiveElements = [];
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = BaseUI;
}

