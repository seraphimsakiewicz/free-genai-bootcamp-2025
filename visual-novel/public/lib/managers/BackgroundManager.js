class BackgroundManager {
    constructor(globalManagers,dialougeManager,scene) {
        this.g = globalManagers;
        this.d = dialougeManager;
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;

        this.background = null;

        this.backgroundData = {
            'apartment': { name: 'Apartment Interior' },
            'classroom': { name: 'Language School Classroom' },
            'cafe': { name: 'Cafe Interior' },
            'post-office': { name: 'Post Office Interior' },
            'store': { name: 'Corner Store Interior' }
        };
    }

    create() {
        this.createBackground();
    }

    createBackground() {
        // Default background
        this.background = this.scene.add.image(0, 0, 'apartment')
        this.background.setOrigin(0, 0);
        this.background.setDisplaySize(this.width, this.height);
    }

    updateBackground(locationId) {
        if (!locationId || !this.backgroundData[locationId]) {
            console.warn(`Background not found for location: ${locationId}`);
            return;
        }
        
        try {
            // Fade out current background
            this.scene.tweens.add({
                targets: this.background,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    // Change texture and fade in
                    this.background.setTexture(locationId);
                    this.scene.tweens.add({
                        targets: this.background,
                        alpha: 1,
                        duration: 300
                    });
                }
            });
        } catch (error) {
            console.error(`Error updating background to ${locationId}:`, error);
            // Fallback: just change the texture
            this.background.setTexture(locationId);
        }
    }


}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = BackgroundManager;
}
