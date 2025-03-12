class UIContainer extends UIItem {
    /**
     * Create a container for multiple UIField components with automatic spacing
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {object} options - Options for the items container
     * @param {Array<number>} options.position - [x,y] position of the container
     * @param {string} options.layout - Layout direction ('vertical' or 'horizontal')
     * @param {number} options.spacing - Spacing between items
     * @param {Array<UIField>} options.items - Initial items to add (optional)
     * @param {Array<number>} options.origin - [x,y] origin point (0-1) for the container (default: [0,0])
     */
    constructor(scene, options) {
        super('panel')
        
        this.scene = scene;
        this.validateOptions(options);
        this.visible = true
        
        this.x = options.position[0];
        this.y = options.position[1];
        this.layout = options.layout || 'vertical';
        this.spacing = options.spacing !== undefined ? options.spacing : 20;
        this.padding = options.padding || 0;
        this.items = [];
        
        // Set origin (default to top-left [0,0])
        this.originX = options.origin ? options.origin[0] : 0;
        this.originY = options.origin ? options.origin[1] : 0;
        
        // Add initial items if provided
        if (options.items && Array.isArray(options.items)) {
            options.items.forEach(item => this.addItem(item));
        }
    }
    
    /**
     * Add a item to the container
     * @param {UIField} item - The item to add
     * @returns {UIContainer} - This container instance for chaining
     */
    addItem(item) {
        this.items.push(item);
        this.updateItemPositions();
        return this;
    }
    
    /**
     * Remove a item from the container
     * @param {UIField} item - The item to remove
     * @returns {UIContainer} - This container instance for chaining
     */
    removeItem(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.updateItemPositions();
        }
        return this;
    }
    
    /**
     * Get all items in the container
     * @returns {Array<UIField>} - Array of items
     */
    getItems() {
        return this.items;
    }
    
    /**
     * Set the position of the container and all its items
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {UIContainer} - This container instance for chaining
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
        
        // Update all item positions
        this.updateItemPositions();
    }
    
    /**
     * Set the spacing between items
     * @param {number} spacing - Spacing value
     * @returns {UIContainer} - This container instance for chaining
     */
    setSpacing(spacing) {
        this.spacing = spacing;
        this.updateItemPositions();
        return this;
    }
    
    /**
     * Set visibility of this container and all its items
     * @param {boolean} visible - Whether the container and items should be visible
     * @returns {UIContainer} - This container instance for chaining
     */
    setVisible(visible) {
        // Set visibility for all items
        this.visible = visible
        this.items.forEach(item => {
            if (item && typeof item.setVisible === 'function') {
                item.setVisible(visible);
            }
        });
        
        return this;
    }
    
    /**
     * Update the positions of all items based on container position, origin, and layout
     * @private
     */
    updateItemPositions() {
        // Define positions for each item based on calculated dimensions
        if (this.layout === 'vertical') {
            this._verticalUpdateItemPositions(this.y);
        } else if (this.layout === 'horizontal') {
            this._horizontalUpdateItemPositions(this.x);
        }
        this._updateItemPositionsByOrigin();
    }

    _updateItemPositionsByOrigin() {
        const containerDimensions = this.getDimensions();
        let offsetX = (containerDimensions.width * this.originX);
        let offsetY = (containerDimensions.height * this.originY);

        this.items.forEach((item, index) => {
            item.setPosition(
                item.x - offsetX + this.padding, 
                item.y - offsetY + this.padding
            ); 
        });
    }

    _verticalUpdateItemPositions(yOffset) {
        this.items.forEach((item, index) => {
            item.setPosition(this.x, yOffset); // Position the item at the current offset
            const dimensions = item.getDimensions(); // Calculate actual dimensions for this item
            yOffset += dimensions.height + this.spacing; // Add this item's height plus spacing to the offset for the next item
        });
    }

    _horizontalUpdateItemPositions(xOffset) {
        this.items.forEach((item, index) => {
            item.setPosition(xOffset, this.y); // Position the item
            const dimensions = item.getDimensions(); // Get item dimensions
            xOffset += dimensions.width + this.spacing; // Increment X for next item
        });
    }

    
    /**
     * Set the layout direction
     * @param {string} layout - 'vertical' or 'horizontal'
     * @returns {UIContainer} - This container instance for chaining
     */
    setLayout(layout) {
        if (layout !== 'vertical' && layout !== 'horizontal') {
            throw new Error("Layout must be 'vertical' or 'horizontal'");
        }
        
        this.layout = layout;
        this.updateItemPositions();
        return this;
    }
    
    /**
     * Get a item by index
     * @param {number} index - Index of the item to get
     * @returns {UIField|null} - The item at the specified index or null
     */
    getItemAt(index) {
        if (index >= 0 && index < this.items.length) {
            return this.items[index];
        }
        return null;
    }
    
    /**
     * Get the total dimensions of the container based on items and layout
     * @returns {object} - {width, height} of the container
     */
    getDimensions() {
        // Use base dimensions if no items
        if (this.visible === false) {
            return { width: 0, height: 0 };
        }
        if (this.items.length === 0) {
            return { width: 0, height: 0 };
        }
        
        // Attempt to get actual dimensions from items
        let width = 0;
        let height = 0;
        
        if (this.layout === 'vertical') {
            this.items.forEach((item, index) => {
                const dimensions = item.getDimensions();
                height = height + dimensions.height 
                // if not the last item, add spacing
                if (index < this.items.length - 1) {
                    height = height + this.spacing;
                }
                width = Math.max(width, dimensions.width);
            });
        } else if (this.layout === 'horizontal') {
            this.items.forEach((item, index) => {
                const dimensions = item.getDimensions();
                width = width + dimensions.width 
                // if not the last item, add spacing
                if (index < this.items.length - 1) {
                    width = width + this.spacing;
                }
                height = Math.max(height, dimensions.height);
            });
        }

        
        return {
            width: width + (this.padding * 2),
            height: height + (this.padding * 2)
        };
    }
    
    /**
     * Destroy all items and clean up resources
     */
    destroy() {
        // Destroy all items
        this.items.forEach(item => {
            if (item.destroy && typeof item.destroy === 'function') {
                item.destroy();
            }
        });
        
        this.items = [];
    }
    
    /**
     * Set the origin point of the container
     * @param {number} x - X origin (0-1)
     * @param {number} y - Y origin (0-1)
     * @returns {UIContainer} - This container instance for chaining
     */
    setOrigin(x, y) {
        // Validate origin values
        if (typeof x !== 'number' || typeof y !== 'number') {
            throw new Error('Origin values must be numbers');
        }
        
        // Update origin values
        this.originX = x;
        this.originY = y;
        
        // Update item positions based on new origin
        this.updateItemPositions();
        
        return this;
    }

    
    /**
     * Validate the options passed to the constructor
     * @param {object} options 
     * @private
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
        
        // Validate layout if provided
        if (options.layout !== undefined && 
            options.layout !== 'vertical' && 
            options.layout !== 'horizontal') {
            throw new Error("Layout must be 'vertical' or 'horizontal'");
        }
        
        // Validate spacing if provided
        if (options.spacing !== undefined && typeof options.spacing !== 'number') {
            throw new Error('Spacing must be a number');
        }
        
        // Validate items if provided
        if (options.items !== undefined && !Array.isArray(options.items)) {
            throw new Error('Items must be an array');
        }
        
        // Validate origin if provided
        if (options.origin !== undefined) {
            if (!Array.isArray(options.origin) || options.origin.length !== 2 ||
                typeof options.origin[0] !== 'number' || typeof options.origin[1] !== 'number') {
                throw new Error('Origin must be an array of two numbers');
            }
        }
    }

    update(){
        this.updateItemPositions()
    }
}

if (typeof window !== 'undefined') {
    window.UIContainer = UIContainer;
}