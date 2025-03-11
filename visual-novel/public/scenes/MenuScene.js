class MenuScene extends BaseScene {
    constructor() {
        super({ key: 'Menu' });
    }

    create() {
        // Set up audio
        this.g.audio.updateScene(this);
        this.g.audio.createBgm();
        this.g.audio.playBgm();

        // Set up UI
        this.g.ui.updateScene(this);

        // Get screen dimensions
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add background image
        this.add.image(width / 2, height / 2, 'menu-bg')
            .setDisplaySize(width, height);
        
        // Add title text
        const mainTitle = this.add.text(width / 2, 0, '日本語学習ビジュアルノベル', {
            fontFamily: 'Noto Sans JP',
            fontSize: '80px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 12,
            align: 'center'
        }).setOrigin(0.5);

        const subTitle = this.add.text(width / 2, height / 4 + 80, 'Japanese Language Learning Visual Novel', {
            fontFamily: 'Arial',
            fontSize: '40px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        subTitle.alpha = 0;

        const tweenMainTitle = this.tweens.add({
            targets: mainTitle,
            y: height / 4,
            duration: 1000,
            ease: 'Power3',
            repeat: 0
        });
        tweenMainTitle.on('complete', function(tween, targets){
            const tweenSubTitle = this.tweens.add({
                targets: subTitle,
                alpha: 1,
                duration: 1000,
                ease: 'Power3',
                repeat: 0
            });
        }, this);
        //tween.play();

        
        // Create menu UI with buttons
        this.ui = new MenuUI(this.g.ui, this);
        this.ui.create(width/2, height/2 + 60); // Center the menu in the scene
        this.ui.show();

        this.uiSettings = null
        this.uiSettings = new SettingsUI(this.g.ui, this);
        this.uiSettings.create();
        this.uiSettings.hide();
        super.create();
    }

    registerEvents() {
        this.g.eventBus.on('ui:button:new-game:pointdown',this.startGame);
        this.g.eventBus.on('ui:button:continue:pointdown',this.continueGame);
        this.g.eventBus.on('ui:button:load:pointdown',this.loadGame);
        this.g.eventBus.on('ui:button:settings:pointdown',this.openSettings);
        this.g.eventBus.on('ui:button:settings-close:pointdown',this.closeSettings);
    }

    deregisterEvents() {
        this.g.eventBus.off('ui:button:new-game:pointdown',this.startGame);
        this.g.eventBus.off('ui:button:continue:pointdown',this.continueGame);
        this.g.eventBus.off('ui:button:load:pointdown',this.loadGame);
        this.g.eventBus.off('ui:button:settings:pointdown',this.openSettings);
        this.g.eventBus.off('ui:button:settings-close:pointdown',this.closeSettings);
    }


    startGame(ev) {
        ev.scene.g.audio.playSoundEffect('click')
        ev.scene.cameras.main.fadeOut(300, 0, 0, 0)
        ev.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            ev.scene.time.delayedCall(600, () => {
                ev.scene.changeScene('Game', { slot: 'new' });
            })
        })
    }

    loadGame(ev){
        ev.scene.g.audio.playSoundEffect('click')
    }

    continueGame(ev){
        ev.scene.g.audio.playSoundEffect('click')
        ev.scene.changeScene('Game');
    }

    openSettings(ev) {
        console.log('MenuScene:open settings')
        ev.scene.g.audio.playSoundEffect('click')
        ev.scene.ui.hide();
        ev.scene.uiSettings.show();
    }

    closeSettings(ev){
        console.log('MenuScene:close settings')
        ev.scene.g.audio.playSoundEffect('click')
        ev.scene.ui.show();
        ev.scene.uiSettings.hide();
    }
}
