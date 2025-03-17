class UITextInput extends UIItem {
    /**
     * Create a text input field for user text entry
     * @param {Phaser.Scene} scene - The Phaser scene @param {object} options - Options for the text
     * input @param {Array<number>} options.position - [x,y] position of the input @param
     * {Array<number>} options.size - [width,height] size of the input field @param {string}
     * options.placeholder - Placeholder text to display when empty @param {string}
     * options.defaultValue - Initial value for the input @param {number} options.maxLength -
     * Maximum character length (default: 20) @param {object} options.style - Text style object
     * @param {string} options.eventHandle - The string that is emitted in the eventbus
     */
    constructor(scene, options) {
        super('textinput');

        this.scene = scene;
        this.validateOptions(options);

        // Store input values
        this.value = options.defaultValue || '';
        this.placeholder = options.placeholder || 'Enter text...';
        this.maxLength = options.maxLength || 20;
        this.eventHandle = options.eventHandle;
        this.focused = false;

        // Calculate dimensions
        this.width = options.size[0];
        this.height = options.size[1];
        this.x = options.position[0];
        this.y = options.position[1];

        // Define styles
        this.textStyle = options.style || {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#000000'
        };
        this.placeholderStyle = {
            ...this.textStyle,
            color: '#888888'
        };

        // Create the input field
        this.createInputField();

        // Set up keyboard input handling
        this.setupKeyboardInput();
    }

    /**
     * Create the visual elements of the input field
     */
    createInputField() {
        // Create background
        this.background = this.scene.add.rectangle(
            this.x,
            this.y,
            this.width,
            this.height,
            0xFFFFFF
        );
        this.background.setOrigin(0, 0); // Set origin to top-left

        // Create border
        this.border = this.scene.add.rectangle(
            this.x,
            this.y,
            this.width,
            this.height,
            0x000000
        );
        this.border.setOrigin(0, 0); // Set origin to top-left
        this.border.setStrokeStyle(2, 0x000000);
        this.border.setFillStyle();

        // Create text
        if (this.value) {
            this.text = this.scene.add.text(
                this.x + 10, // Add padding
                this.y + (this.height / 2), // Center text vertically
                this.value,
                this.textStyle
            );
        } else {
            this.text = this.scene.add.text(
                this.x + 10, // Add padding
                this.y + (this.height / 2), // Center text vertically
                this.placeholder,
                this.placeholderStyle
            );
        }
        this.text.setOrigin(0, 0.5); // Left aligned, vertically centered

        // Create cursor for text editing
        this.cursor = this.scene.add.rectangle(
            this.text.x + (this.value ? this.text.width : 0) + 2,
            this.y + (this.height / 2), // Match text vertical position
            2,
            this.height * 0.7,
            0x000000
        );
        this.cursor.setOrigin(0, 0.5);
        this.cursor.visible = false;

        // Make all components of the input field interactive
        this.background.setInteractive({ useHandCursor: true });
        this.border.setInteractive({ useHandCursor: true });
        this.text.setInteractive({ useHandCursor: true });

        // Handle clicks on any part of the input field
        const focusHandler = (pointer) => {
            // Update cursor position based on click location relative to text
            if (this.value) {
                // Place cursor at end of text by default
                this.cursor.x = this.text.x + this.text.width + 2;
            } else {
                // Place cursor at beginning for empty input
                this.cursor.x = this.text.x;
            }
            this.focus();
        };

        // Add the focus handler to all components
        this.background.on('pointerdown', focusHandler);
        this.border.on('pointerdown', focusHandler);
        this.text.on('pointerdown', focusHandler);

        // Handle clicking outside the input with improved hit testing
        this.scene.input.on('pointerdown', (pointer) => {
            if (!this.focused) return; // Skip if not focused

            // Create a proper hit area rectangle for more accurate testing
            const inputBounds = {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height
            };

            // Check if click is outside the bounds
            if (pointer.x < inputBounds.x ||
                pointer.x > inputBounds.x + inputBounds.width ||
                pointer.y < inputBounds.y ||
                pointer.y > inputBounds.y + inputBounds.height) {
                this.blur();
            }
        });

        // Set up blinking cursor animation
        this.cursorTween = this.scene.tweens.add({
            targets: this.cursor,
            alpha: { from: 1, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            paused: true
        });
    }

    getDimensions() {
        // TODO - if the item is not visible, show this return 0,0? What should happen in this case?
        return {
            width: this.background.width || 0,
            height: this.background.height || 0
        };
    }
    /**
     * Set up keyboard input handling
     */
    setupKeyboardInput() {
        // We need to ensure the keyboard exists
        this.scene.input.keyboard = this.scene.input.keyboard || this.scene.input.plugin.keyboard;

        // Listen for keyboard input
        this.keyboardInput = (event) => {
            if (!this.focused) return;

            // Handle backspace
            if (event.keyCode === 8) {
                if (this.value.length > 0) {
                    this.value = this.value.slice(0, -1);
                    this.updateText();
                }
                return;
            }

            // Handle enter/return key
            if (event.keyCode === 13) {
                this.blur();
                return;
            }

            // Only add printable characters
            if (event.keyCode >= 32 && event.keyCode <= 126) {
                // Check max length
                if (this.value.length < this.maxLength) {
                    this.value += event.key;
                    this.updateText();
                }
            }
        };
    }

    /**
     * Update the displayed text based on current value
     */
    updateText() {
        if (this.value) {
            this.text.setText(this.value);
            this.text.setStyle(this.textStyle);
        } else {
            this.text.setText(this.placeholder);
            this.text.setStyle(this.placeholderStyle);
        }

        // Update cursor position - maintain vertical position
        this.cursor.x = this.text.x + this.text.width + 2;
        this.cursor.y = this.y + (this.height / 2); // Keep cursor vertically centered

        // Make sure text doesn't overflow the field
        this.clipTextIfNeeded();

        // Emit change event
        this.scene.g.eventBus.emit(`ui:textinput:${this.eventHandle}:change`, {
            input: this,
            value: this.value,
            scene: this.scene
        });
    }

    /**
     * Clip text if it exceeds the input field width
     */
    clipTextIfNeeded() {
        const maxVisibleWidth = this.width - 20; // Account for padding

        if (this.text.width > maxVisibleWidth) {
            // Simple approach: just show the end of the text
            let visibleText = this.value;
            while (this.scene.make.text({ text: visibleText, style: this.textStyle }).width > maxVisibleWidth && visibleText.length > 0) {
                visibleText = visibleText.substring(1);
            }

            if (visibleText !== this.value) {
                // Show ellipsis at start
                visibleText = '...' + visibleText;
                while (this.scene.make.text({ text: visibleText, style: this.textStyle }).width > maxVisibleWidth && visibleText.length > 3) {
                    visibleText = '...' + visibleText.substring(4);
                }
            }

            this.text.setText(visibleText);
        }
    }

    /**
     * Give focus to this input field
     */
    focus() {
        // Prevent double focus
        if (this.focused) return this;

        // Set focus state
        this.focused = true;

        // Ensure cursor is properly positioned (if not set during click)
        if (this.value && this.value.length > 0) {
            // Move cursor to the end of the text
            this.cursor.x = this.text.x + this.text.width + 2;
        } else {
            // Move cursor to the start of the text input area
            this.cursor.x = this.text.x;
        }

        // Show cursor and start blinking
        this.cursor.visible = true;
        this.cursorTween.restart();

        // Highlight border
        this.border.setStrokeStyle(2, 0x3366ff);

        // Add keyboard event listener
        this.scene.input.keyboard.off('keydown', this.keyboardInput); // Remove any existing listeners
        this.scene.input.keyboard.on('keydown', this.keyboardInput);

        // Emit focus event
        this.scene.g.eventBus.emit(`ui:textinput:${this.eventHandle}:focus`, {
            input: this,
            value: this.value,
            scene: this.scene
        });

        return this;
    }

    /**
     * Remove focus from this input field
     */
    blur() {
        // Prevent unnecessary blur
        if (!this.focused) return this;

        // Set unfocused state
        this.focused = false;

        // Hide cursor and stop blinking
        this.cursor.visible = false;
        this.cursorTween.pause();

        // Reset border
        this.border.setStrokeStyle(2, 0x000000);

        // Remove keyboard event listener
        this.scene.input.keyboard.off('keydown', this.keyboardInput);

        // Emit blur event
        this.scene.g.eventBus.emit(`ui:textinput:${this.eventHandle}:blur`, {
            input: this,
            value: this.value,
            scene: this.scene
        });

        return this;
    }

    /**
     * Set the value of the text input programmatically
     * @param {string} value - New value for the input
     */
    setValue(value) {
        if (value !== undefined) {
            this.value = value.toString().substring(0, this.maxLength);
            this.updateText();
        }
    }

    /**
     * Get the current value of the text input
     * @returns {string} Current value
     */
    getValue() {
        return this.value;
    }

    /**
     * Set a new position for the entire text input
     * @param {number} x - X coordinate @param {number} y - Y coordinate 
     */
    setPosition(x, y) {
        // Update base position
        this.x = x;
        this.y = y;

        // Move all visual elements
        this.background.setPosition(x, y);
        this.border.setPosition(x, y);

        // Position text with padding and proper vertical centering
        this.text.setPosition(x + 10, y + (this.height / 2));

        // Position cursor next to text and properly centered
        this.cursor.setPosition(
            this.text.x + this.text.width + 2,
            y + (this.height / 2)
        );
    }

    /**
     * Validate the options passed to the constructor
     * @param {object} options
     */
    validateOptions(options) {
        // Validate position
        if (!options.position) {
            throw new Error('Position is required');
        }
        if (!Array.isArray(options.position) || options.position.length !== 2 ||
            typeof options.position[0] !== 'number' || typeof options.position[1] !== 'number') {
            throw new Error('Position must be an array of two numbers');
        }

        // Validate size
        if (!options.size) {
            throw new Error('Size is required');
        }
        if (!Array.isArray(options.size) || options.size.length !== 2 ||
            typeof options.size[0] !== 'number' || typeof options.size[1] !== 'number') {
            throw new Error('Size must be an array of two numbers');
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
     * Set visibility of this text input and all its components
     * @param {boolean} visible - Whether the text input should be visible @returns {UITextInput} -
     * This text input instance for chaining
     */
    setVisible(visible) {
        // Set visibility for background and border
        if (this.background && typeof this.background.setVisible === 'function') {
            this.background.setVisible(visible);
        }

        if (this.border && typeof this.border.setVisible === 'function') {
            this.border.setVisible(visible);
        }

        // Set visibility for text
        if (this.text && typeof this.text.setVisible === 'function') {
            this.text.setVisible(visible);
        }

        // Set visibility for cursor (only if focused and input should be visible)
        if (this.cursor && typeof this.cursor.setVisible === 'function') {
            this.cursor.setVisible(visible && this.focused);
        }

        return this;
    }
}

if (typeof window !== 'undefined') {
    window.UITextInput = UITextInput;
}