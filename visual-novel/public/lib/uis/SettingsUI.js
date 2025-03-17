class SettingsUI extends BaseUI {
    constructor(UIManager, scene) {
        super(scene); // Call BaseUI constructor
        this.uim = UIManager;
    }

    create() {
        this.createBg();
        this.createSettingsFields();
        this.createActions();
    }

    createSettingsFields() {
        const { width, height } = this.scene.game.canvas;

        // Create a fields container for all settings
        this.settingsFields = this.uim.createContainer({
            position: [width * 0.5, height * 0.3], // Centered horizontally
            layout: 'vertical',
            spacing: 32,
            origin: [0.5, 0]  // Center horizontally, align to top
        });

        // Register the fields container with BaseUI
        this.registerElement(this.settingsFields);

        this.createVolumeSlider({
            settingsKey: 'bgmVolume',
            label: 'BGM Volume',
            eventHandle: 'settings-bgm-volume'
        });
        this.createVolumeSlider({
            settingsKey: 'sfxVolume',
            label: 'SFX Volume',
            eventHandle: 'settings-sfx-volume'
        });
        this.createVolumeSlider({
            settingsKey: 'voiceVolume',
            label: 'Voice Volume',
            eventHandle: 'settings-voice-volume'
        });

        // Add language toggle field
        this.createLanguageToggle();

        // Add Name input field
        this.createNameTextInput();

        // Add Gemini API key input field
        this.createGeminiAPIKeyInput();

        // Future settings could be added here this.createFontSlider();
        this.registerEvents();
    }

    registerEvents() {
        this.scene.g.eventBus.on('ui:slider:settings-bgm-volume:change', this.bgmVolumeChange)
        this.scene.g.eventBus.on('ui:slider:settings-sfx-volume:change', this.sfxVolumeChange)
        this.scene.g.eventBus.on('ui:slider:settings-voice-volume:change', this.voiceVolumeChange)
    }

    bgmVolumeChange(ev) {
        const value = (ev.value / 100) * 0.2
        ev.scene.g.audio.setBgmVolume(value);
        ev.scene.g.settings.update('bgmVolume', value);
    }

    sfxVolumeChange(ev) {
        const value = (ev.value / 100) * 0.2
        ev.scene.g.audio.setSfxVolume(value);
        ev.scene.g.settings.update('sfxVolume', value);
    }

    voiceVolumeChange(ev) {
        const value = (ev.value / 100) * 0.2
        ev.scene.g.audio.setVoiceVolume(value);
        ev.scene.g.settings.update('voiceVolume', value);
    }


    // Override show method to add any specific behavior
    show() {
        super.show(); // Call BaseUI's show method
    }

    // Override hide method to add any specific behavior
    hide() {
        super.hide(); // Call BaseUI's hide method
    }

    createBg() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        const x = width / 2;
        const y = height / 2;

        // Create panel background with semi-transparency
        this.panel = this.scene.add.rectangle(x, y, width, height, 0x222222, 0.9);

        // Create title text
        this.title = this.scene.add.text(x, y - height / 2 + 30, 'Settings', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // Register these elements with BaseUI so they respond to show/hide
        this.registerElement(this.panel);
        this.registerElement(this.title);
    }

    createNameTextInput() {
        // Create a field with label and text input
        const nameInputField = this.uim.createField({
            label: 'Player Name',
            position: [0, 0],  // Position will be set by the Fields container
            inputType: 'textinput',
            inputOptions: {
                size: [300, 40],        // Size of the text input
                placeholder: 'Enter your name...',
                defaultValue: this.scene.g.settings.get('playerName') || '',
                maxLength: 20,          // Limit characters
                eventHandle: 'settings-name',
                style: {
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    color: '#000000'
                }
            }
        });

        // Add field to the container
        this.settingsFields.addItem(nameInputField);

        // Listen for value changes
        this.scene.g.eventBus.on('ui:textinput:settings-name:change', (data) => {
            console.log('Name changed:', data.value);
            // Update the setting in real-time
            this.scene.g.settings.set('playerName', data.value);
        });

        // Listen for when user completes input (blur event)
        this.scene.g.eventBus.on('ui:textinput:settings-name:blur', (data) => {
            console.log('Final name:', data.value);
            // Save the setting when input is complete
            this.scene.g.settings.save();
        });
    }

    createVolumeSlider(options) {
        // Calculate volume from settings (convert from 0-0.2 to 0-100)
        let volume = this.scene.g.settings.get(options.settingsKey)
        volume = (volume / 0.2) * 100
        // Create a field with label and volume slider
        const volumeField = this.uim.createField({
            label: options.label,
            position: [0, 0],  // Position will be set by the Fields container
            inputType: 'slider',
            inputOptions: {
                min: 0,
                max: 100,
                value: volume,
                size: [300, 30],         // Size of the slider
                eventHandle: options.eventHandle,
                padding: 10              // Add padding to ensure handle is visible
            }
        });
        this.settingsFields.addItem(volumeField);
    }

    createLanguageToggle() {
        // Create a field with label and language toggle
        const languageField = this.uim.createField({
            label: 'Language',
            position: [0, 0],  // Position will be set by the Fields container
            inputType: 'toggle',
            inputOptions: {
                values: ['English', 'Dual', 'Spanish'],  // The options to cycle through
                initialIndex: 0,                         // Start with English selected
                size: [90, 40],                          // Width, Height of each pill
                spacing: 5,                              // Space between pills
                eventHandle: 'language-setting'          // Event handle for identifying this toggle
            }
        });

        // Add field to the container
        this.settingsFields.addItem(languageField);

        // Get the toggle component from the field
        const languageToggle = languageField.getInput();

        // Listen for changes
        this.scene.g.eventBus.on('ui:toggle:language-setting:change', (data) => {
            console.log(`Language changed to: ${data.value}`);
            // Update game language based on selection updateGameLanguage(data.value);
        });
    }

    createActions() {
        // Create our actions withint horizontal fields container position in the bottom left of the
        // screen.
        const { width, height } = this.scene.game.canvas;
        const padding = 32;
        this.actionsContainer = this.uim.createContainer({
            position: [width - padding, height - padding],
            layout: 'horizontal',
            spacing: 20,
            origin: [1, 1]
        });
        this.registerElement(this.actionsContainer);
        this.createButtonClose();
    }


    createButtonClose() {
        const buttonWidth = 300;
        const buttonHeight = 80;
        const buttonField = this.uim.createButton({
            position: [0, 0],
            image: 'small-button',
            image_hover: 'small-button',
            text: "Close",
            size: [buttonWidth, buttonHeight],
            eventHandle: "settings-close"
        })
        this.actionsContainer.addItem(buttonField);


    }

    createGeminiAPIKeyInput() {
        // Create a field with label and text input for Gemini API key
        const apiKeyInputField = this.uim.createField({
            label: 'Gemini API Key',
            position: [0, 0],  // Position will be set by the Fields container
            inputType: 'textinput',
            inputOptions: {
                size: [300, 40],        // Size of the text input
                placeholder: 'Enter your Gemini API key...',
                defaultValue: window.geminiAPI ? window.geminiAPI.getApiKey() : '',
                maxLength: 100,         // Limit characters
                eventHandle: 'settings-gemini-api-key',
                style: {
                    fontFamily: 'Arial',
                    fontSize: '18px',
                    color: '#000000'
                }
            }
        });

        // Add field to the container
        this.settingsFields.addItem(apiKeyInputField);

        // Listen for value changes
        this.scene.g.eventBus.on('ui:textinput:settings-gemini-api-key:change', (data) => {
            console.log('Gemini API key changed');
            // Update the API key in real-time
            if (window.geminiAPI) {
                window.geminiAPI.setApiKey(data.value);
            }
        });
    }

}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = SettingsUI;
}

