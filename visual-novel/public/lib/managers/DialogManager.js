/**
 * DialogManager.js Handles dialog display, progression, and choices
 */
class DialogManager {
    constructor(globalManagers,scene) {
        this.g = globalManagers;
        this.scene = scene;
        
        this.sceneId = null; // this is the current scene
        
        // dialogData[dialogId] = dialogNode
        this.dialogData = null; // contains all dialog data for the current scene.
        this.dialogId = null; // this is the current dialog
        this.dialogNode = null; // this is the current dialog node

        this.dialogState = null; // contains the current dialog state

        this.mappings = null; // contains character names and IDs
    }
    
    create() {
        // This will be called after the UI is created const language =
        //this.g.settings.get('language'); const textSpedd = this.g.settings.get('textSpeed'); const
        //autoAdvanced = this.g.settings.get('autoAdvanced'); const autoSpeed =
        //this.g.settings.get('autoSpeed'); const typewriterEffect =
        //this.g.settings.get('typewriterEffect');
        this.loadMappings();
        this.loadSceneData();
        this.loadDialogNode();
    }
    
    // checks if the dialog is loaded for rendering.
    isLoaded(){
        return this.dialogData && this.dialogNode && this.mappings;
    }

    loadMappings(){
        this.mappings = this.scene.cache.json.get('mappings');
    }

    loadSceneData() {
        const sceneId = this.g.saves.get('sceneId');
        
        try {
            const cacheKey = `scene-${sceneId}`;
            this.dialogData = this.scene.cache.json.get(cacheKey);
            if (!this.dialogData) {
                console.error(`No dialog data found for scene: ${cacheKey}`);
                return;
            }
            
            // Start from the beginning or from the saved position
            this.dialogId = this.g.saves.get('dialogId') || this.dialogData.startAt;
        } catch (error) {
            console.error(`Error loading scene data for ${sceneId}:`, error);
        }
    }
    
    loadDialogNode() {
        this.dialogNode = this.dialogData.dialog[this.dialogId];
        this.dialogState = 'speaker'
        if (!this.dialogNode) {
            console.error(`Dialog node not found for ID: ${this.dialogId}`);
            return;
        }
    }
   
    isChoices(){
        return this.dialogNode.choices && this.dialogNode.choices.length > 0;
    }    

    // next choice response
    advance(action,value=null) {
        // console.log('advance',arguments)
        if (action == 'next') {
            // check if default_next_id exists if not throw an error.
            if (!this.dialogNode.default_next_id){
                console.error('No default_next_id found for dialog node:', this.dialogNode);
                return;
            }

            this.dialogId = this.dialogNode.default_next_id;
            this.dialogNode = this.dialogData.dialog[this.dialogId];
        } else if (action == 'choice') {
            // we are assuming the choice is an integer
            const choice = this.dialogData.dialog[this.dialogId].choices[value];
            if (choice.next_id){
                this.dialogId = choice.next_id
                this.dialogNode = this.dialogData.dialog[this.dialogId];
            } else {
                this.dialogId = this.dialogNode.default_next_id
                this.dialogNode = this.dialogData.dialog[this.dialogId];
            }
            // console.log(choice)
            // if there is a response we need to show it. if we are advancing from response lets
            // check for next_id otherwise fallback to default_next_id
        }
    }
    
    goToNextScene(sceneId) {
        // Update game settings
        this.scene.gameSettings.currentScene = sceneId;
        this.scene.gameSettings.currentDialogId = null; // Reset dialog ID for new scene
        
        // Save the game state before changing scenes
        this.scene.saveManager.saveGameState();
        
        // Start transition to the new scene
        try {
            this.scene.sound.play('transition');
        } catch (e) {
            console.warn('Transition sound not available');
        }
        
        // Add a visual transition
        this.scene.cameras.main.fade(500, 0, 0, 0, false, (camera, progress) => {
            if (progress === 1) {
                // Restart the current scene with the new scene data
                this.scene.scene.restart({
                    gameSettings: this.scene.gameSettings
                });
            }
        });
    }

    getChoices(){
        return this.dialogNode.choices;
    }

    getSpanishText(){
        return this.dialogNode.spanish;
    }

    getEnglishText(){
        return this.dialogNode.english;
    }

    getSpeakerName() {
        // get speakerId from dialog node
        const speakerId = this.dialogNode.speakerId;       

        if (speakerId == 'player') {
            return 'Player';
        }

        if (!this.mappings) {
            console.error('Mappings not loaded');
            return speakerId;
        }
        
        return this.mappings.characterNames[speakerId] || speakerId;
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = DialogManager;
}
