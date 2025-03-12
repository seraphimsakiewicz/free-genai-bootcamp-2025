/**
 * EventBus.js
 * A simple event bus for communication between different modules
 */
class EventBus {
    constructor() {
        this.listeners = {};
    }
    
    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     * @param {object} context - Context for the callback
     */
    on(event, callback, context = null) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        
        this.listeners[event].push({
            callback,
            context
        });
        
        return this; // For chaining
    }
    
    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {function} callback - Callback function
     * @param {object} context - Context for the callback
     */
    off(event, callback, context = null) {
        if (!this.listeners[event]) {
            return this;
        }
        
        this.listeners[event] = this.listeners[event].filter(listener => {
            return listener.callback !== callback || listener.context !== context;
        });
        
        return this; // For chaining
    }
    
    /**
     * Emit an event with data
     * @param {string} event - Event name
     * @param {any} data - Event data
     */
    emit(event, data = null) {
        //console.log('emit', arguments)
        if (!this.listeners[event]) {
            return this;
        }
        
        const eventListeners = [...this.listeners[event]];
        
        for (const listener of eventListeners) {
            if (listener.context) {
                listener.callback.call(listener.context, data);
            } else {
                listener.callback(data);
            }
        }
        
        return this; // For chaining
    }
    
    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    removeAllListeners(event) {
        if (event) {
            delete this.listeners[event];
        } else {
            this.listeners = {};
        }
        
        return this; // For chaining
    }
}

// Create a singleton instance
const eventBus = new EventBus();

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = eventBus;
}
