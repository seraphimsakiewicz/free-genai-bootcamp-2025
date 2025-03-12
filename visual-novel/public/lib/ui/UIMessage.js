// The UIMessage is the following: its message bubble that can have its colour set. it has text
// label who the speaker is. it has text for spanish dialog. it has text for english dialog
class UIMessage extends UIItem{
    constructor(scene,options) {
        super('message')

        this.scene = scene;
        this.validateOptions(options); 
        this.x = options.position[0];
        this.y = options.position[1];

        const width = this.scene.cameras.main.width;
        this.maxWidth = width / 2;
        this.spanishText = null;
        this.englishText = null;
        this.nameText = null;
        this.create();
    }

    create() {
        this.createBubble();
        this.createNameText();
        this.createSpanishText();
        this.createEnglishText();
        this.createPlayButton();
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.bubblePanel.setPosition(this.x, this.y);
    }    

    update(options){
        this.nameText.setText(options.name);
        if (options.spanishText) {
            this.spanishText.setText(options.spanishText);
            this.spanishText.setVisible(true);
        } else {
            this.spanishText.setText('');
            this.spanishText.setVisible(false);
        }
        if (options.englishText) {
            this.englishText.setText(options.englishText);
            this.englishText.setVisible(true);
        } else {
            this.englishText.setText('');
            this.englishText.setVisible(false);
        }
        this.bubblePanel.autoResizePanel();
    }

    createBubble() {
        this.bubblePanel = this.scene.g.ui.createPanel({
            position: [this.x, this.y],
            layout: 'vertical',
            spacing: 8,
            padding: 16,
            origin: [0,0],
            panelOptions: {
                backgroundImage: 'black-sq'
            }
        });
    }

    createPlayButton(){
        this.playButton = this.scene.g.ui.createButton({
            position: [0,0],
            image: 'play-button',
            image_hover: 'play-button',
            text: '',
            size: [64,64],
            eventHandle: 'dialog-play'
        })
        this.bubblePanel.addItem(this.playButton);
    }

    createNameText() {
        this.nameText = this.scene.g.ui.createLabel({
            position: [0,0],
            text: '',
            style: {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#ffffff'
            }
        });
        this.bubblePanel.addItem(this.nameText);
    }

    createSpanishText() {
        const width = this.scene.cameras.main.width * 0.8;
        this.spanishText = this.scene.g.ui.createLabel({
            position: [0,0],
            text: '',
            style: {
                fontFamily: 'Source Sans Pro',
                fontSize: '32px',
                color: '#ffffff',
                wordWrap: { width: width, useAdvancedWrap: true }
            }
        });
        this.bubblePanel.addItem(this.spanishText);
    }

    createEnglishText() {
        const width = this.scene.cameras.main.width * 0.8;
        this.englishText = this.scene.g.ui.createLabel({
            position: [0,0],
            text: '',
            style: {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#808080',
                wordWrap: { width: width, useAdvancedWrap: true }
            }
        });
        this.bubblePanel.addItem(this.englishText);
    }

    validateOptions(options) {
        // Validate position
        if (!options.position) {
            throw new Error('Position is required');
        }
        if (!Array.isArray(options.position) || options.position.length !== 2 ||
            typeof options.position[0] !== 'number' || typeof options.position[1] !== 'number') {
            throw new Error('Position must be an array of two numbers');
        }
    }

    getDimensions() {
        // TODO - if the item is not visible, show this return 0,0? What should happen in this case?
        return this.bubblePanel.getDimensions();
    }
}

if (typeof module !== 'undefined') {  
    module.exports = UIMessage;
}