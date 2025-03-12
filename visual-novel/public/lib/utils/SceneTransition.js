/**
 * SceneTransition.js
 * Handles transitions between game scenes
 */
class SceneTransition {
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * Fade out the current scene and start a new one
     * @param {string} targetScene - Name of the scene to transition to
     * @param {object} data - Data to pass to the new scene
     * @param {number} duration - Duration of the transition in ms
     */
    fadeToScene(targetScene, data = {}, duration = 500) {
        this.scene.cameras.main.fade(duration, 0, 0, 0, false, (camera, progress) => {
            if (progress === 1) {
                this.scene.scene.start(targetScene, data);
            }
        });
        
        // Play transition sound if available
        try {
            this.scene.sound.play('transition');
        } catch (e) {
            console.warn('Transition sound not available');
        }
    }
    
    /**
     * Slide out the current scene and start a new one
     * @param {string} targetScene - Name of the scene to transition to
     * @param {object} data - Data to pass to the new scene
     * @param {string} direction - Direction to slide out ('left', 'right', 'up', 'down')
     * @param {number} duration - Duration of the transition in ms
     */
    slideToScene(targetScene, data = {}, direction = 'left', duration = 500) {
        const camera = this.scene.cameras.main;
        const width = camera.width;
        const height = camera.height;
        
        let x = 0;
        let y = 0;
        
        switch (direction) {
            case 'left':
                x = -width;
                break;
            case 'right':
                x = width;
                break;
            case 'up':
                y = -height;
                break;
            case 'down':
                y = height;
                break;
        }
        
        this.scene.tweens.add({
            targets: camera,
            x: x,
            y: y,
            ease: 'Cubic.easeInOut',
            duration: duration,
            onComplete: () => {
                this.scene.scene.start(targetScene, data);
            }
        });
        
        // Play transition sound if available
        try {
            this.scene.sound.play('transition');
        } catch (e) {
            console.warn('Transition sound not available');
        }
    }
    
    /**
     * Zoom out the current scene and start a new one
     * @param {string} targetScene - Name of the scene to transition to
     * @param {object} data - Data to pass to the new scene
     * @param {number} duration - Duration of the transition in ms
     */
    zoomToScene(targetScene, data = {}, duration = 500) {
        const camera = this.scene.cameras.main;
        
        this.scene.tweens.add({
            targets: camera,
            zoom: 0.001,
            ease: 'Cubic.easeIn',
            duration: duration,
            onComplete: () => {
                this.scene.scene.start(targetScene, data);
            }
        });
        
        // Play transition sound if available
        try {
            this.scene.sound.play('transition');
        } catch (e) {
            console.warn('Transition sound not available');
        }
    }
    
    /**
     * Fade to black and restart the current scene
     * @param {object} data - Data to pass to the restarted scene
     * @param {number} duration - Duration of the transition in ms
     */
    restartScene(data = {}, duration = 500) {
        this.scene.cameras.main.fade(duration, 0, 0, 0, false, (camera, progress) => {
            if (progress === 1) {
                this.scene.scene.restart(data);
            }
        });
        
        // Play transition sound if available
        try {
            this.scene.sound.play('transition');
        } catch (e) {
            console.warn('Transition sound not available');
        }
    }
    
    /**
     * Add a scene to run on top of the current one
     * @param {string} targetScene - Name of the scene to add
     * @param {object} data - Data to pass to the new scene
     */
    addScene(targetScene, data = {}) {
        this.scene.scene.add(targetScene, data);
    }
    
    /**
     * Pause the current scene and start a new one
     * @param {string} targetScene - Name of the scene to launch
     * @param {object} data - Data to pass to the new scene
     */
    launchScene(targetScene, data = {}) {
        this.scene.scene.launch(targetScene, data);
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = SceneTransition;
}
