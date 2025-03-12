class UIField extends UIItem{
    /**
     * Create a field with a label and input component
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {object} options - Options for the field
     * @param {string} options.label - Label text
     * @param {Array<number>} options.position - [x,y] position of the field
     * @param {string} options.inputType - Type of input ('slider', 'toggle', etc.)
     * @param {object} options.inputOptions - Options for the input component
     * @param {object} options.labelStyle - Optional custom style for the label
     * @param {number} options.spacing - Spacing between label and input (default: 10)
     */
    constructor(scene, options) {
        super('field')

        this.scene = scene;
        this.validateOptions(options);
        
        this.labelText = options.label || ''; // Default to empty string if no label provided
        this.x = options.position[0];
        this.y = options.position[1];
        this.inputType = options.inputType;
        this.inputOptions = options.inputOptions || {};
        
        // Use provided spacing or set defaults based on input type
        if (options.spacing !== undefined) {
            this.spacing = options.spacing;
        } else {
            this.spacing = 12;
        }
        
        // Create the label
        this.createLabel(options.labelStyle);
        
        // Create the input component
        this.createInputComponent();
    }
    
    /**
     * Create the label for this field
     * @param {object} style - Optional custom style for the label
     */
    createLabel(style) {
        // Always create a UILabel instance, even if labelText is empty
        this.label = new UILabel(this.scene, {
            text: this.labelText,
            position: [this.x, this.y],
            style: style,
            field: this
        });
    }
    
    _getInputPositionY(){
        return this.y + this.label.getDimensions().height + this.spacing;
    }
    
    createInputComponent() {
        // Position the input BELOW the label with spacing
        const inputX = this.x;
        const inputY = this._getInputPositionY();
        
        // Add position to input options
        this.inputOptions.position = [inputX, inputY];
        
        // Create the input based on type
        switch(this.inputType.toLowerCase()) {
            case 'slider':
                this.input = new UISlider(this.scene, this.inputOptions);
                break;
            case 'toggle':
                this.input = new UIToggle(this.scene, this.inputOptions);
                break;
            case 'textinput':
                this.input = new UITextInput(this.scene, this.inputOptions);
                break;
            case 'button':
                this.input = new UIButton(this.scene, this.inputOptions);
                break;
            case 'message':
                this.input = new UIMessage(this.scene, this.inputOptions);
                break;
            default:
                console.warn(`Input type '${this.inputType}' not supported`);
                break;
        }
    }
    
    /**
     * Get the input component
     * @returns {object} The input component (UISlider, UIToggle, etc.)
     */
    getInput() {
        return this.input;
    }
    
    /**
     * Get the label component
     * @returns {UILabel} The label component
     */
    getLabel() {
        return this.label;
    }
    
    /**
     * Set a new position for the entire field
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    setPosition(x, y) {
        // Update the field's base position
        this.x = x;
        this.y = y;
        
        // Update the label position
        this.label.setPosition(x, y);
        
        // Position input BELOW the label with spacing
        const inputX = x;
        const inputY = this._getInputPositionY();
        
        // Update the input position
        if (this.input && this.input.setPosition) {
            this.input.setPosition(inputX, inputY);
            
            // Update stored position in options for future reference
            this.inputOptions.position = [inputX, inputY];
        }
    }
    
    /**
     * Set visibility of this field and its components
     * @param {boolean} visible - Whether the field should be visible
     * @returns {UIField} - This field instance for chaining
     */
    setVisible(visible) {
        // Set visibility for label
        if (this.label && typeof this.label.setVisible === 'function') {
            this.label.setVisible(visible);
        }
        
        // Set visibility for input component
        if (this.input && typeof this.input.setVisible === 'function') {
            this.input.setVisible(visible);
        }
        
        return this;
    }
    
    /**
     * Validate the options passed to the constructor
     * @param {object} options - The options object
     */
    validateOptions(options) {
        // Validate label if provided
        if (options.label !== undefined && typeof options.label !== 'string') {
            throw new Error('Label text must be a string');
        }
        
        // Validate position
        if (!options.position) {
            throw new Error('Position is required');
        }
        if (!Array.isArray(options.position) || options.position.length !== 2 ||
            typeof options.position[0] !== 'number' || typeof options.position[1] !== 'number') {
            throw new Error('Position must be an array of two numbers');
        }
        
        // Validate input type
        if (!options.inputType) {
            throw new Error('Input type is required');
        }
        if (typeof options.inputType !== 'string') {
            throw new Error('Input type must be a string');
        }
    }

    getDimensions() {
        // TODO - if the item is not visible, show this return 0,0?
        // What should happen in this case?
        const labelDimensions = this.label.getDimensions();
        const inputDimensions = this.input.getDimensions();
        const width = Math.max(labelDimensions.width, inputDimensions.width);
        let height = labelDimensions.height + inputDimensions.height;
        //console.log(
        //    'UIField:getDimensions',
        //    this.label,
        //    this.input,
        //    labelDimensions,
        //    inputDimensions,
        //    width,
        //    height
        //)
        if (labelDimensions.height > 0) { // if there is no label, there is no gap between the two..
            height += this.spacing;
        }
        return { width: width, height: height };
    }
}

if (typeof window !== 'undefined') {
    window.UIField = UIField;
}