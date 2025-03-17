import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;
    subtitle: GameObjects.Text;
    newGameButton: GameObjects.Rectangle;
    newGameText: GameObjects.Text;
    continueButton: GameObjects.Rectangle;
    continueText: GameObjects.Text;
    loadButton: GameObjects.Rectangle;
    loadText: GameObjects.Text;
    settingsButton: GameObjects.Rectangle;
    settingsText: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    preload()
    {
        // Load city background if not already loaded
        if (!this.textures.exists('menu-background')) {
            this.load.image('menu-background', 'assets/menu-background.jpg');
        }
    }

    create ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Add background image (black and white city) If the image isn't loaded yet, use a black
        // background as fallback
        if (this.textures.exists('menu-background')) {
            this.background = this.add.image(width/2, height/2, 'menu-background')
                .setDisplaySize(width, height);
        } else {
            // Fallback to black background
            this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0, 0);
        }

        // Add semi-transparent overlay to darken the background
        this.add.rectangle(0, 0, width, height, 0x000000, 0.5).setOrigin(0, 0);

        // Add Spanish title
        this.title = this.add.text(width / 2, height * 0.2, 'Novela visual para aprender español', {
            fontFamily: 'Arial', 
            fontSize: 48, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Add English subtitle
        this.subtitle = this.add.text(width / 2, height * 0.28, 'Spanish Language Learning Visual Novel', {
            fontFamily: 'Arial', 
            fontSize: 24, 
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Create menu buttons
        const buttonWidth = 400;
        const buttonHeight = 60;
        const buttonSpacing = 20;
        const startY = height * 0.4;
        const buttonColor = 0xaaaaaa;
        const buttonAlpha = 0.8;
        const textColor = '#000000';
        const hoverColor = 0xcccccc;

        // New Game button
        this.newGameButton = this.add.rectangle(width/2, startY, buttonWidth, buttonHeight, buttonColor, buttonAlpha)
            .setInteractive({ useHandCursor: true });
        this.newGameText = this.add.text(width/2, startY, 'New Game', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: textColor
        }).setOrigin(0.5);

        // Continue button
        this.continueButton = this.add.rectangle(width/2, startY + buttonHeight + buttonSpacing, buttonWidth, buttonHeight, buttonColor, buttonAlpha)
            .setInteractive({ useHandCursor: true });
        this.continueText = this.add.text(width/2, startY + buttonHeight + buttonSpacing, 'Continue', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: textColor
        }).setOrigin(0.5);

        // Load button
        this.loadButton = this.add.rectangle(width/2, startY + (buttonHeight + buttonSpacing) * 2, buttonWidth, buttonHeight, buttonColor, buttonAlpha)
            .setInteractive({ useHandCursor: true });
        this.loadText = this.add.text(width/2, startY + (buttonHeight + buttonSpacing) * 2, 'Load', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: textColor
        }).setOrigin(0.5);

        // Settings button
        this.settingsButton = this.add.rectangle(width/2, startY + (buttonHeight + buttonSpacing) * 3, buttonWidth, buttonHeight, buttonColor, buttonAlpha)
            .setInteractive({ useHandCursor: true });
        this.settingsText = this.add.text(width/2, startY + (buttonHeight + buttonSpacing) * 3, 'Settings', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: textColor
        }).setOrigin(0.5);

        // Button hover effects
        const buttons = [this.newGameButton, this.continueButton, this.loadButton, this.settingsButton];
        
        buttons.forEach(button => {
            button.on('pointerover', () => {
                button.setFillStyle(hoverColor);
            });
            
            button.on('pointerout', () => {
                button.setFillStyle(buttonColor);
            });
        });
        
        // Button click handlers
        this.newGameButton.on('pointerdown', () => {
            this.changeScene();
        });
        
        this.continueButton.on('pointerdown', () => {
            // Continue game functionality would go here
            console.log('Continue game');
        });
        
        this.loadButton.on('pointerdown', () => {
            // Load game functionality would go here
            console.log('Load game');
        });
        
        this.settingsButton.on('pointerdown', () => {
            // Open settings scene
            this.scene.start('GameOver'); // Using GameOver as a placeholder for Settings
        });

        EventBus.emit('current-scene-ready', this);
    }
    
    changeScene ()
    {
        this.scene.start('Game');
    }
}
