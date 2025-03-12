/**
 * CharacterManager.js
 * Handles character and background display and updates
 */
class CharacterManager {
    constructor(globalManagers,dialogManager,scene) {
        this.d = dialogManager;
        this.g = globalManagers;
        this.scene = scene;
        
        this.character = null;
        
        this.characterData = {
            'alex': { name: 'Alex Thompson', expression: 'neutral' },
            'yamamoto': { name: 'Yamamoto Sensei', expression: 'neutral' },
            'minji': { name: 'Kim Min-ji', expression: 'neutral' },
            'carlos': { name: 'Carlos Garcia', expression: 'neutral' },
            'hiroshi': { name: 'Tanaka Hiroshi', expression: 'neutral' },
            'yuki': { name: 'Nakamura Yuki', expression: 'neutral' },
            'kenji': { name: 'Suzuki Kenji', expression: 'neutral' },
            'akiko': { name: 'Watanabe Akiko', expression: 'neutral' }
        };
    }
    
    create() {
        this.createCharacter();
    }
    
    createCharacter() {
        this.g.saves.get('characterId')
        // Add a default character sprite if needed
        this.character = this.scene.add.image(0, 0, 'alex')
        this.character.setOrigin(0, 0);
    }
    
    updateCharacter(characterId) {
        if (!characterId) {
            // Hide character if no ID provided
            if (this.character) {
                this.character.setVisible(false);
            }
            return;
        }
        
        if (!this.characterData[characterId]) {
            console.warn(`Character not found: ${characterId}`);
            return;
        }
        
        try {
            // If character is already visible, fade out first
            if (this.character.visible) {
                this.scene.tweens.add({
                    targets: this.character,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => {
                        this.showCharacter(characterId);
                    }
                });
            } else {
                this.showCharacter(characterId);
            }
        } catch (error) {
            console.error(`Error updating character to ${characterId}:`, error);
            // Fallback: just change the texture
            this.character.setTexture(characterId).setVisible(true);
        }
    }
    
    showCharacter(characterId) {
        // Update texture and fade in
        this.character.setTexture(characterId);
        this.character.setVisible(true);
        this.character.alpha = 0;
        
        this.scene.tweens.add({
            targets: this.character,
            alpha: 1,
            duration: 200
        });
    }
    
    // Method to handle character expressions if implemented
    setCharacterExpression(characterId, expression) {
        if (!characterId || !this.characterData[characterId]) {
            return;
        }
        
        // If we have different expression sprites, this is where we'd change them
        // For now, we'll just log it
        console.log(`Setting ${characterId} expression to ${expression}`);
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = CharacterManager;
}
