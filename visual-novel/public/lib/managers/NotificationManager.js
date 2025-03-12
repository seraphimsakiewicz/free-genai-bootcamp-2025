/**
 * NotificationManager.js
 * Handles in-game notifications and messages
 */
class NotificationManager {
    constructor(scene) {
        this.scene = scene;
        this.notifications = [];
        this.maxNotifications = 3; // Maximum number of notifications visible at once
        this.notificationDuration = 3000; // Duration in ms
        this.notificationSpacing = 60; // Vertical spacing between notifications
    }
    
    /**
     * Initialize notification manager
     */
    create() {
        // Nothing to initialize
    }
    
    /**
     * Show a notification message
     * @param {string} message - Notification text
     * @param {object} options - Options for the notification
     */
    showNotification(message, options = {}) {
        const defaultOptions = {
            duration: this.notificationDuration,
            background: 0x000000,
            alpha: 0.7,
            textColor: '#ffffff',
            fontSize: '18px',
            fontFamily: 'Arial',
            sound: 'notification',
            position: 'top-right' // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'
        };
        
        const settings = { ...defaultOptions, ...options };
        
        // Play notification sound if available
        try {
            if (settings.sound) {
                this.scene.sound.play(settings.sound, { volume: 0.2 });
            }
        } catch (e) {
            console.warn('Notification sound not available');
        }
        
        // Create notification container
        const notification = this.createNotification(message, settings);
        
        // Add to list of active notifications
        this.notifications.push(notification);
        
        // If we have too many notifications, remove the oldest one
        if (this.notifications.length > this.maxNotifications) {
            const oldestNotification = this.notifications.shift();
            this.removeNotification(oldestNotification);
        }
        
        // Position all notifications
        this.updateNotificationPositions();
        
        // Set up auto removal
        this.scene.time.delayedCall(settings.duration, () => {
            this.removeNotification(notification);
        });
        
        return notification;
    }
    
    /**
     * Create a notification UI
     * @param {string} message - Notification text
     * @param {object} settings - Notification settings
     * @returns {object} Notification objects
     */
    createNotification(message, settings) {
        const width = 300;
        const padding = 10;
        
        // Create text object to measure height
        const textObject = this.scene.add.text(0, 0, message, {
            fontFamily: settings.fontFamily,
            fontSize: settings.fontSize,
            color: settings.textColor,
            wordWrap: { width: width - (padding * 2) }
        });
        
        const textHeight = textObject.height;
        const height = textHeight + (padding * 2);
        
        // Set starting position based on settings
        let x, y;
        const cameraWidth = this.scene.cameras.main.width;
        const cameraHeight = this.scene.cameras.main.height;
        
        switch (settings.position) {
            case 'top-left':
                x = width / 2 + 20;
                y = height / 2 + 20;
                break;
            case 'top-right':
                x = cameraWidth - width / 2 - 20;
                y = height / 2 + 20;
                break;
            case 'bottom-left':
                x = width / 2 + 20;
                y = cameraHeight - height / 2 - 20;
                break;
            case 'bottom-right':
                x = cameraWidth - width / 2 - 20;
                y = cameraHeight - height / 2 - 20;
                break;
            case 'center':
                x = cameraWidth / 2;
                y = cameraHeight / 2;
                break;
            default:
                x = cameraWidth - width / 2 - 20;
                y = height / 2 + 20;
        }
        
        // Create background rectangle
        const background = this.scene.add.rectangle(x, y, width, height, settings.background, settings.alpha)
            .setOrigin(0.5, 0.5);
        
        // Position the text on the background
        textObject.setPosition(x - width / 2 + padding, y - textHeight / 2);
        
        // Group background and text
        const container = { background, text: textObject, width, height, settings };
        
        // Start with alpha 0 and fade in
        background.alpha = 0;
        textObject.alpha = 0;
        
        this.scene.tweens.add({
            targets: [background, textObject],
            alpha: settings.alpha,
            duration: 200,
            ease: 'Cubic.easeOut'
        });
        
        return container;
    }
    
    /**
     * Remove a notification
     * @param {object} notification - Notification object to remove
     */
    removeNotification(notification) {
        const index = this.notifications.indexOf(notification);
        
        if (index !== -1) {
            this.notifications.splice(index, 1);
        }
        
        // Fade out and destroy
        this.scene.tweens.add({
            targets: [notification.background, notification.text],
            alpha: 0,
            duration: 200,
            onComplete: () => {
                notification.background.destroy();
                notification.text.destroy();
                this.updateNotificationPositions();
            }
        });
    }
    
    /**
     * Update the positions of all notifications
     */
    updateNotificationPositions() {
        if (this.notifications.length === 0) return;
        
        // Get first notification position info
        const firstNotification = this.notifications[0];
        const { x } = firstNotification.background;
        let y = firstNotification.background.y;
        
        // Update all notification positions
        for (let i = 0; i < this.notifications.length; i++) {
            const notification = this.notifications[i];
            
            if (i > 0) {
                // Adjust y position based on previous notifications
                const prevNotification = this.notifications[i - 1];
                y = prevNotification.background.y + prevNotification.height / 2 + this.notificationSpacing + notification.height / 2;
            }
            
            // Move notification to new position
            this.scene.tweens.add({
                targets: [notification.background],
                y: y,
                duration: 200,
                ease: 'Cubic.easeOut'
            });
            
            // Move text along with background
            this.scene.tweens.add({
                targets: [notification.text],
                y: y - notification.height / 2 + 10, // Adjust text position
                duration: 200,
                ease: 'Cubic.easeOut'
            });
        }
    }
    
    /**
     * Clear all notifications
     */
    clearAllNotifications() {
        while (this.notifications.length > 0) {
            const notification = this.notifications.pop();
            notification.background.destroy();
            notification.text.destroy();
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = NotificationManager;
}
