import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Rectangle;
    dialogBox: Phaser.GameObjects.Rectangle;
    characterName: Phaser.GameObjects.Text;
    dialogText: Phaser.GameObjects.Text;
    nextButton: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    character: Phaser.GameObjects.Image;

    constructor ()
    {
        super('Game');
    }

    preload()
    {
        // Load character image if not already loaded
        if (!this.textures.exists('character')) {
            this.load.image('character', 'assets/character.png');
        }
    }

    create ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        this.camera = this.cameras.main;
        
        // Add dark background
        this.background = this.add.rectangle(0, 0, width, height, 0x222222).setOrigin(0, 0);

        // Add character (if available)
        if (this.textures.exists('character')) {
            this.character = this.add.image(width/2, height/2 - 100, 'character')
                .setOrigin(0.5, 1);
        }

        // Add dialog box at the bottom
        this.dialogBox = this.add.rectangle(width / 2, height - 120, width - 40, 200, 0x000000, 0.8)
            .setOrigin(0.5, 0.5)
            .setStrokeStyle(2, 0xffffff);
            
        // Add character name
        this.characterName = this.add.text(40, height - 220, 'Character Name', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: '#aa4444',
            padding: {
                x: 10,
                y: 5
            }
        });
        
        // Add dialog text
        this.dialogText = this.add.text(40, height - 180, 'This is where the dialog text will appear. Click the Next button to continue the story.', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff',
            wordWrap: { width: width - 80 }
        });
        
        // Add next button
        this.nextButton = this.add.text(width - 100, height - 60, 'Next', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff',
            backgroundColor: '#4444aa',
            padding: {
                x: 15,
                y: 8
            }
        }).setInteractive({ useHandCursor: true });
        
        // Add back to menu button
        this.backButton = this.add.text(100, 40, 'Back to Menu', {
            fontFamily: 'Arial',
            fontSize: 18,
            color: '#ffffff',
            backgroundColor: '#aa4444',
            padding: {
                x: 15,
                y: 8
            }
        }).setInteractive({ useHandCursor: true });
        
        // Button hover effects
        [this.nextButton, this.backButton].forEach(button => {
            button.on('pointerover', () => {
                const currentColor = button.style.backgroundColor;
                button.setBackgroundColor(currentColor === '#4444aa' ? '#5555cc' : '#cc5555');
            });
            
            button.on('pointerout', () => {
                const currentColor = button.style.backgroundColor;
                button.setBackgroundColor(currentColor === '#5555cc' ? '#4444aa' : '#aa4444');
            });
        });
        
        // Button click handlers
        this.nextButton.on('pointerdown', () => {
            // Advance dialog (placeholder)
            this.dialogText.setText('This is the next piece of dialog. You can continue implementing the full dialog system.');
        });
        
        this.backButton.on('pointerdown', () => {
            this.changeScene();
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}
