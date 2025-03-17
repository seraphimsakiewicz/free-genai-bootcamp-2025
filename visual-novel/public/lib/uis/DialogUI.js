/**
 * UIManager.js Manages all UI components in the game
 */
class DialogUI extends BaseUI {
    constructor(UIManager, dialogManager, scene) {
        super(scene);
        this.uim = UIManager;
        this.d = dialogManager;
        this.scene = scene;
        this.width = scene.cameras.main.width;
        this.height = scene.cameras.main.height;

        this.choices = []

        this.spacing = 12;

        // Get reference to the event bus from the scene
        this.eventBus = window.eventBus;

        this.margin = 32;
        this.padding = 32;

        // UI components
        this.nextButton = null;
        this.genAIButton = null;
        this.aiTextLabel = null;
        this.isGeneratingAI = false;
    }

    create(x, y) {
        this.x = x;
        this.y = y;
        this.createMessagesContainer();
        this.createMessage();
        this.createChoices();
        this.createNextButton();
        this.createGenAIButton();
        this.registerEvents();
    }

    updateMessageText() {
        const attrs = {}
        attrs.name = this.d.getSpeakerName();
        switch (this.scene.g.settings.get('language')) {
            case 'spanish':
                attrs.spanishText = this.d.getSpanishText();
                break;
            case 'english':
                attrs.englishText = this.d.getEnglishText();
                break;
            case 'dual':
                attrs.spanishText = this.d.getSpanishText();
                attrs.englishText = this.d.getEnglishText();
                break;
            default:
                // raise error
                console.error('Invalid language setting:', this.scene.g.settings.get('language'));
                break;
        }
        this.message.input.update(attrs);
    }

    updateChoicesText() {
        for (let i = 0; i < 7; i++) {
            const choices = this.d.getChoices()
            if (choices[i] === undefined) {
                this.choices[i].setText('')
                this.choices[i].setVisible(false)
            } else {
                this.choices[i].setText(choices[i].spanish)
                this.choices[i].setVisible(true)
            }
        }
    }

    update() {
        if (!this.d.isLoaded()) { return }
        this.updateMessageText()

        if (this.d.isChoices()) {
            this.choicesContainer.setVisible(true)
            this.nextButton.setVisible(false)
            this.updateChoicesText()
        } else {
            this.choicesContainer.setVisible(false)
            this.nextButton.setVisible(true)
        }
        this.messagesContainer.update();
    }

    createMessagesContainer() {
        this.messagesContainer = this.uim.createContainer({
            layout: 'vertical',
            position: [this.x, this.y],
            spacing: this.spacing,
            origin: [0, 1]
        });
        this.registerElement(this.messagesContainer);
    }

    createChoices() {
        this.choicesContainer = this.uim.createContainer({
            layout: 'vertical',
            position: [this.x, this.y],
            spacing: this.spacing,
            origin: [0, 0]
        });

        for (let i = 0; i < 7; i++) {
            this.choices[i] = this.uim.createButton({
                position: [0, 0],
                text: `Choice ${i}`,
                size: [80, 50],
                textAlign: 'left',
                image: 'small-button',
                image_hover: 'small-button-hover',
                eventHandle: `dialog-choice-${i}`
            })
            this.choicesContainer.addItem(this.choices[i])
        }
        this.messagesContainer.addItem(this.choicesContainer);
    }

    createMessage() {
        this.message = this.uim.createField({
            inputType: 'message',
            position: [0, 0], // the container is will override the position
            inputOptions: {}
        });
        this.messagesContainer.addItem(this.message);
    }

    createNextButton() {
        this.nextButton = this.uim.createButton({
            position: [0, 0], // the container is will override the position
            text: 'Next',
            size: [80, 50],
            image: 'small-button',
            image_hover: 'small-button-hover',
            eventHandle: 'dialog-next'
        })
        this.messagesContainer.addItem(this.nextButton);
    }

    createGenAIButton() {
        // Create a container for the button and AI text
        this.aiContainer = this.uim.createContainer({
            layout: 'horizontal',
            position: [this.x + 100, this.y - 60], // Position to the right of the Next button
            spacing: 10,
            origin: [0, 1]
        });

        // Create the Gen AI button
        this.genAIButton = this.uim.createButton({
            position: [0, 0],
            text: 'Gen AI',
            size: [80, 50],
            image: 'small-button',
            image_hover: 'small-button-hover',
            eventHandle: 'dialog-gen-ai'
        });

        // Create the AI text label
        this.aiTextLabel = this.uim.createLabel({
            text: 'AI text will appear here...',
            position: [90, 0], // Position to the right of the button
            style: {
                fontFamily: 'Arial',
                fontSize: '14px',
                color: '#ffffff',
                backgroundColor: '#333333',
                padding: {
                    x: 10,
                    y: 5
                },
                wordWrap: { width: this.width - 220 }
            }
        });

        // Add elements to the container
        this.aiContainer.addItem(this.genAIButton);
        this.aiContainer.addItem(this.aiTextLabel);

        // Register the container with the UI manager
        this.registerElement(this.aiContainer);
    }

    registerEvents() {
        this.scene.g.eventBus.on('ui:button:dialog-gen-ai:pointdown', this.generateAIText);
    }

    generateAIText = async (ev) => {
        // Prevent multiple simultaneous generations
        if (this.isGeneratingAI) return;

        this.isGeneratingAI = true;

        // Play click sound
        ev.scene.g.audio.playSoundEffect('click');

        // Update button text to show loading state
        this.genAIButton.setText('Loading...');

        // Update text label to show loading state
        this.aiTextLabel.setText('Generating AI text...');

        try {
            // Check if Gemini API is available
            if (!window.geminiAPI) {
                throw new Error('Gemini API not initialized');
            }

            // Generate text about Spain
            const generatedText = await window.geminiAPI.generateSpainFact();

            // Update the AI text label with the generated text
            this.aiTextLabel.setText(generatedText);
        } catch (error) {
            console.error('Error generating AI text:', error);
            this.aiTextLabel.setText('Failed to generate AI text. Please check your API key and try again.');
        } finally {
            // Reset button text
            this.genAIButton.setText('Gen AI');
            this.isGeneratingAI = false;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = UIManager;
}
