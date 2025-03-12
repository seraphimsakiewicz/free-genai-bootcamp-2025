class UISlider extends UIItem {
    /**
     * Create a slider component with draggable handle
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {object} options - Options for the slider
     * @param {number} options.min - Minimum value of the slider
     * @param {number} options.max - Maximum value of the slider
     * @param {number} options.value - Initial value of the slider
     * @param {Array<number>} options.size - [width,height] size of the slider
     * @param {Array<number>} options.position - [x,y] position of the slider
     * @param {string} options.eventHandle - the string that is emitted in the eventbus
     * @param {boolean} options.showValue - whether to show the current value text
     */
    constructor(scene, options) {
        super('slider');

        this.scene = scene;
        this.validateOptions(options); // if anything fails it will throw an error

        // Store slider values
        this.min = options.min;
        this.max = options.max;
        this.value = options.value;
        this.eventHandle = options.eventHandle;
        this.showValue = options.showValue !== undefined ? options.showValue : true;
        // Track padding to ensure handle is fully visible
        this.padding = options.padding !== undefined ? options.padding : 5;

        // Calculate dimensions
        this.width = options.size[0];
        this.height = options.size[1];
        this.x = options.position[0];
        this.y = options.position[1];
        
        // Calculate the center position for the track (converting from top-left to center positioning)
        this.trackX = this.x + (this.width / 2);
        this.trackY = this.y + (this.height / 2);

        // Define styles
        this.textStyle = {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
        };

        // Create slider track (background)
        this.track = this.scene.add.image(this.trackX, this.trackY, 'slider-track');
        // Adjust track size to leave room for handle
        const effectiveWidth = this.width - (this.padding * 2);
        this.track.setDisplaySize(effectiveWidth, this.height);

        // Calculate handle position based on value
        const handleX = this.getHandleXFromValue(this.value);
        
        // Create slider handle
        this.handle = this.scene.add.image(handleX, this.trackY, 'slider-handle');
        // Make handle size proportional to track height but not too large
        const handleSize = Math.min(this.height * 1.5, 30);
        this.handle.setDisplaySize(handleSize, handleSize);
        this.handle.setInteractive({ useHandCursor: true });

        // Set up drag events
        this.scene.input.setDraggable(this.handle);
        
        this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject === this.handle) {
                // Constrain handle to track bounds with padding
                const leftBound = this.x + this.padding;
                const rightBound = this.x + this.width - this.padding;
                
                const constrainedX = Phaser.Math.Clamp(dragX, leftBound, rightBound);
                gameObject.x = constrainedX;
                
                // Update value based on handle position
                this.updateValueFromHandlePosition();
                
                // Update value text if needed
                if (this.valueText) {
                    this.valueText.setText(Math.round(this.value).toString());
                }
                
                // Emit event with new value
                this.scene.g.eventBus.emit(`ui:slider:${this.eventHandle}:change`, { 
                    slider: this, 
                    value: this.value, 
                    scene: this.scene 
                });
            }
        });

        // Add click event on track for quick jumps
        this.track.setInteractive({ useHandCursor: true });
        this.track.on('pointerdown', (pointer) => {
            // Move handle to click position
            const leftBound = this.x + this.padding;
            const rightBound = this.x + this.width - this.padding;
            const clickX = Phaser.Math.Clamp(pointer.x, leftBound, rightBound);
            
            this.handle.x = clickX;
            
            // Update value and emit change
            this.updateValueFromHandlePosition();
            
            // Update value text if needed
            if (this.valueText) {
                this.valueText.setText(Math.round(this.value).toString());
            }
            
            this.scene.g.eventBus.emit(`ui:slider:${this.eventHandle}:change`, { 
                slider: this, 
                value: this.value, 
                scene: this.scene 
            });
        });

        // Add value text if showValue is true
        if (this.showValue) {
            this.valueText = this.scene.add.text(
                this.x + this.width + 20, 
                this.trackY, 
                Math.round(this.value).toString(),
                this.textStyle
            );
            this.valueText.setOrigin(0, 0.5);
        }
    }

    /**
     * Validate the options passed to the constructor
     * @param {object} options 
     */
    validateOptions(options) {
        // Validate min
        if (options.min === undefined) {
            throw new Error('Min value is required');
        }
        if (typeof options.min !== 'number') {
            throw new Error('Min value must be a number');
        }

        // Validate max
        if (options.max === undefined) {
            throw new Error('Max value is required');
        }
        if (typeof options.max !== 'number') {
            throw new Error('Max value must be a number');
        }

        // Validate that max > min
        if (options.max <= options.min) {
            throw new Error('Max value must be greater than min value');
        }

        // Validate initial value
        if (options.value === undefined) {
            throw new Error('Initial value is required');
        }
        if (typeof options.value !== 'number') {
            throw new Error('Initial value must be a number');
        }
        if (options.value < options.min || options.value > options.max) {
            throw new Error('Initial value must be between min and max');
        }

        // Validate size
        if (!options.size) {
            throw new Error('Size is required');
        }
        if (!Array.isArray(options.size) || options.size.length !== 2 ||
            typeof options.size[0] !== 'number' || typeof options.size[1] !== 'number') {
            throw new Error('Size must be an array of two numbers');
        }

        // Validate position
        if (!options.position) {
            throw new Error('Position is required');
        }
        if (!Array.isArray(options.position) || options.position.length !== 2 ||
            typeof options.position[0] !== 'number' || typeof options.position[1] !== 'number') {
            throw new Error('Position must be an array of two numbers');
        }

        // Validate eventHandle
        if (!options.eventHandle) {
            throw new Error('Event handle is required');
        }
        if (typeof options.eventHandle !== 'string') {
            throw new Error('Event handle must be a string');
        }
    }

    /**
     * Calculate the x position for the handle based on the current value
     * @param {number} value 
     * @returns {number} x position
     */
    getHandleXFromValue(value) {
        const percentage = (value - this.min) / (this.max - this.min);
        const effectiveWidth = this.width - (this.padding * 2);
        return this.x + this.padding + (percentage * effectiveWidth);
    }

    /**
     * Update the value based on the handle's current position
     */
    updateValueFromHandlePosition() {
        const effectiveWidth = this.width - (this.padding * 2);
        const percentage = (this.handle.x - (this.x + this.padding)) / effectiveWidth;
        this.value = this.min + (percentage * (this.max - this.min));
    }

    /**
     * Set the slider value programmatically
     * @param {number} value 
     */
    setValue(value) {
        // Ensure value is within bounds
        this.value = Phaser.Math.Clamp(value, this.min, this.max);
        
        // Update handle position
        this.handle.x = this.getHandleXFromValue(this.value);
        
        // Update value text if needed
        if (this.valueText) {
            this.valueText.setText(Math.round(this.value).toString());
        }
        
        // Emit change event
        this.scene.g.eventBus.emit(`ui:slider:${this.eventHandle}:change`, { 
            slider: this, 
            value: this.value, 
            scene: this.scene 
        });
    }

    /**
     * Get the current value of the slider
     * @returns {number} current value
     */
    getValue() {
        return this.value;
    }

    /**
     * Set a new position for the entire slider
     * @param {number} x - X coordinate 
     * @param {number} y - Y coordinate
     */
    setPosition(x, y) {
        // Calculate the change in position
        const deltaX = x - this.x;
        const deltaY = y - this.y;
        
        // Update base position
        this.x = x;
        this.y = y;
        
        // Update track center position
        this.trackX = this.x + (this.width / 2);
        this.trackY = this.y + (this.height / 2);
        
        // Move the track
        this.track.setPosition(this.trackX, this.trackY);
        
        // Move the handle (maintaining its position relative to the track)
        this.handle.setPosition(this.handle.x + deltaX, this.trackY);
        
        // Move the value text if it exists
        if (this.valueText) {
            this.valueText.setPosition(this.x + this.width + 20, this.trackY);
        }
    }
    
    /**
     * Set visibility of this slider and all its components
     * @param {boolean} visible - Whether the slider should be visible
     * @returns {UISlider} - This slider instance for chaining
     */
    setVisible(visible) {
        // Set visibility for track and handle
        if (this.track && typeof this.track.setVisible === 'function') {
            this.track.setVisible(visible);
        }
        
        if (this.handle && typeof this.handle.setVisible === 'function') {
            this.handle.setVisible(visible);
        }
        
        // Set visibility for value text if it exists
        if (this.valueText && typeof this.valueText.setVisible === 'function') {
            this.valueText.setVisible(visible);
        }
        
        return this;
    }

    getDimensions() {
        // TODO - if the item is not visible, show this return 0,0?
        // What should happen in this case?
        // If the handle remains within the track then the track is the size
        // is accurate, if we choose to update this so you can change the handle
        // size then we need to update this code logic.
        return {
            width: this.track.displayWidth || 0,
            height: this.track.displayHeight || 0
        };
    }
}

if (typeof window !== 'undefined') {
    window.UISlider = UISlider;
}