// extends UIContainer to have a background.
class UIPanel extends UIContainer {
    constructor(scene, options) {
        super(scene, options);
        this.validatePanelOptions(options.panelOptions);
        this.createBackground(options.panelOptions);
    }

    createBackground(options) {
        this.background = this.scene.add.image(this.x, this.y, options.backgroundImage);
        this.background.setDisplaySize(0,0); // make it invisible for now...
        this.background.setOrigin(0,0);
    }

    validatePanelOptions(options) {
        if (!options.backgroundImage) {
            throw new Error('backgroundImage is required for UIPanel');
        }
    }

    setPosition(x, y) {
        super.setPosition(x,y);
        this.background.setPosition(x, y);
    }

    autoResizePanel(){
        const containerDimensions = this.getDimensions();
        this.background.setDisplaySize(
            containerDimensions.width, 
            containerDimensions.height
        );
    }
}

if (typeof window !== 'undefined') {
    window.UIPanel = UIPanel;
}   