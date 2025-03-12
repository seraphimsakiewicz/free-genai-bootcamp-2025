class GameUIActions extends BaseUI{
    constructor(UIManager,scene) {
        super(scene);
        this.uim = UIManager;
        this.spacing = 10;
        this.buttonWidth = 100;
        this.buttonHeight = 60;
    }

    create(x,y) {
        this.x = x;
        this.y = y;
        this.createActions([
            { text: 'Quick Save', eventHandle: 'gm-quick-save'}, 
            { text: 'Save', eventHandle: 'gm-save'},
            { text: 'Load', eventHandle: 'gm-load'}, 
            { text: 'Settings', eventHandle: 'gm-settings' }
        ]);
    }

    createActions(buttonData) {
        // horizontal container for actions
        this.container = this.uim.createContainer({
            layout: 'horizontal',
            position: [this.x,this.y],
            spacing: this.spacing,
            origin: [1,0]
        });
        this.registerElement(this.container);

        // loop through and create buttons
        for (let button of buttonData) {
            this.createButton(button.text, button.eventHandle);
        }

    }

    createButton(text, eventHandle) {
        const button = this.uim.createButton({
            position: [0,0],
            image: 'small-button',
            image_hover: 'small-button-hover',
            text: text,
            size: [this.buttonWidth,this.buttonHeight],
            eventHandle: eventHandle

        });
        this.container.addItem(button);
    }

    // Override show method to add any specific behavior
    show() {
        super.show(); // Call BaseUI's show method
    }

    // Override hide method to add any specific behavior
    hide() {
        super.hide(); // Call BaseUI's hide method
    }
}

if (typeof module !== 'undefined') {
    module.exports = GameUIActions;
}
