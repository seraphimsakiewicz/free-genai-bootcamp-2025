/**
 * AudioManager.js
 * Handles background music and sound effects
 */
class AudioManager {
    constructor(globalManagers) {
        this.g = globalManagers;
        this.scene = null; // Initialize scene to null
        this.bgMusic = null;
        this.soundEffects = {
            click: null,
            transition: null
        };
    }

    createBgm () {
        try {
            const volume = this.g.settings.get('bgmVolume');
            this.bgMusic = this.scene.sound.add('bg-music', {
                volume,
                loop: true
            });
        } catch (error) {
            console.error('Error setting up background music:', error);
        }
    }
    
    
    /**
     * Update the scene reference
     * @param {Phaser.Scene} scene - The new scene
     */
    updateScene(scene) {
        this.scene = scene;
    }
    
    
    playSoundEffect(key, config = {}) {
        try {
            const volume = this.g.settings.get('sfxVolume');
            
            // Play the sound effect
            this.scene.sound.play(key, {
                volume,
                ...config
            });
        } catch (error) {
            console.warn(`Error playing sound effect ${key}:`, error);
        }
    }
    
    playBgm () {
        if (this.bgMusic && !this.bgMusic.isPlaying) {
            this.bgMusic.play();
        }
    }

    stopBgm() {
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.stop();
        }
    }
    
    pauseBgm() {
        if (this.bgMusic && this.bgMusic.isPlaying) {
            this.bgMusic.pause();
        }
    }
    
    resumeBgm() {
        if (this.bgMusic && this.bgMusic.isPaused) {
            this.bgMusic.resume();
        }
    }
    
    setBgmVolume(volume) {
        const adjustedVolume = Math.max(0, Math.min(1, volume));
        this.bgMusic.setVolume(adjustedVolume);
    }
    
    setSfxVolume(volume) {
        const adjustedVolume = Math.max(0, Math.min(1, volume));
        //this.sfxSound.setVolume(adjustedVolume);
    }

    setVoiceVolume(volume){
        const adjustedVolume = Math.max(0, Math.min(1, volume));
        //this.voiceSound.setVolume(adjustedVolume);

    }
    
    // Method to play a click sound with error handling
    playClickSound() {
        try {
            this.playSoundEffect('click');
        } catch (e) {
            console.warn('Click sound not available');
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = AudioManager;
}
