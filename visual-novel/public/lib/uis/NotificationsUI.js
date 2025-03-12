
 class NotificationsUI extends BaseUI {
    constructor(UIManager,scene) {
        super(scene);
        this.uim = UIManager;
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;
        this.create();
    }

    create() {  
        this.createNotification('Welcome to the Notifications UI!');
    }

    createNotification(message, duration = 2000) {
        // Create notification text
        const notification = this.scene.add.text(this.width / 2, 100, message, {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5, 0.5)
        .setAlpha(0);
        
    }

    animate() {
        // Animation for notification
        this.scene.tweens.add({
            targets: notification,
            alpha: 1,
            duration: 300,
            ease: 'Power2',
            yoyo: true,
            hold: duration - 600,
            onComplete: () => {
                notification.destroy();
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationsUI;
}