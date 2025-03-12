
class MenuUI extends BaseUI {
    constructor(UIManager, scene) {
        super(scene); // Call BaseUI constructor
        this.uim = UIManager;
        this.spacing = 16;
        this.buttonWidth = 500;
        this.buttonHeight = 80;
    }

    create(x,y) {
        this.x = x;
        this.y = y;

        this.createButtons([
            {text: 'New Game',eventHandle: 'new-game'},
            {text: 'Continue',eventHandle: 'continue'},
            {text: 'Load',eventHandle: 'load'},
            {text: 'Settings',eventHandle: 'settings'}
        ]);
    }

    createButtons(buttonData) {
        // contain the buttons within a UIContainer that is vertical       
        this.menuContainer = this.uim.createContainer({
            layout: 'vertical',
            position: [this.x,this.y],
            spacing: this.spacing,
            origin: [0.5,0.5]
        });
        this.registerElement(this.menuContainer);
        // iterate over the buttonData and create button
        for (let t of buttonData) {
            this.createButton(t.text, t.eventHandle)
        }
    }

    createButton(text, eventHandle){
        const button = this.uim.createButton({
            position: [0,0],
            text: text,
            size: [this.buttonWidth,this.buttonHeight],
            eventHandle: eventHandle
        });
        this.menuContainer.addItem(button);
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

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = MenuUI;
}
