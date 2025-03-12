class UIItem {
    constructor(itemType) {
        this.itemType = itemType;
    }

    // this should be implemented by each item.
    getDimensions() {
        // raise error if called.
        throw new Error('Method not implemented');
    }

    setPosition(x, y) {
        // raise error if called.
        throw new Error('Method not implemented');
    }

    getPosition() {
        // raise error if called.
        throw new Error('Method not implemented');
    }
}

if (typeof window !== 'undefined') {
    window.UIItem = UIItem;
}