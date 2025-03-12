/**
 * StoryManager.js
 * Manages story flow, chapters, branching, and narrative structure
 */
class StoryManager {
    constructor(scene) {
        this.scene = scene;
        
        // Current story state
        this.currentChapter = null;
        this.currentScene = null;
        this.storyFlags = {};
        this.storyHistory = [];
        this.storyBranches = {};
        
        // Story state storage key
        this.storyStateKey = 'visual-novel-story-state';
        
        // Story structure (loaded from external file)
        this.storyStructure = {} //
        
        // Load story state
        this.loadStoryState();
    }
    
    /**
     * Initialize the story manager
     */
    create() {
        // Subscribe to relevant events
    }
    
    /**
     * Load story state from storage
     */
    loadStoryState() {
        try {
            const savedData = localStorage.getItem(this.storyStateKey);
            
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Restore story state
                this.currentChapter = data.currentChapter;
                this.currentScene = data.currentScene;
                this.storyFlags = data.storyFlags || {};
                this.storyHistory = data.storyHistory || [];
                this.storyBranches = data.storyBranches || {};
                
                console.log('Story state loaded successfully');
            } else {
                // Initialize with default state
                this.initializeDefaultState();
            }
        } catch (error) {
            console.error('Error loading story state:', error);
            this.initializeDefaultState();
        }
    }
    
    /**
     * Initialize with default story state
     */
    initializeDefaultState() {
        // Start with first chapter
        const firstChapter = Object.keys(this.storyStructure.chapters)[0];
        this.currentChapter = firstChapter;
        
        // Start with initial scene of first chapter
        this.currentScene = this.storyStructure.chapters[firstChapter].initialScene;
        
        // Initialize empty story flags
        this.storyFlags = {};
        
        // Initialize empty history
        this.storyHistory = [];
        
        // Initialize empty branches
        this.storyBranches = {};
        
        console.log('Initialized default story state');
    }
    
    /**
     * Save story state to storage
     */
    saveStoryState() {
        try {
            const data = {
                currentChapter: this.currentChapter,
                currentScene: this.currentScene,
                storyFlags: this.storyFlags,
                storyHistory: this.storyHistory,
                storyBranches: this.storyBranches
            };
            
            localStorage.setItem(this.storyStateKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving story state:', error);
        }
    }
    
    /**
     * Start a specific chapter
     * @param {string} chapterId - Chapter ID to start
     */
    startChapter(chapterId) {
        const chapter = this.storyStructure.chapters[chapterId];
        
        if (!chapter) {
            console.error(`Chapter not found: ${chapterId}`);
            return false;
        }
        
        // Check if requirements are met
        if (chapter.requiredFlags) {
            for (const flag in chapter.requiredFlags) {
                if (this.storyFlags[flag] !== chapter.requiredFlags[flag]) {
                    console.warn(`Cannot start chapter ${chapterId}: missing required flag ${flag}`);
                    return false;
                }
            }
        }
        
        // Set current chapter
        this.currentChapter = chapterId;
        
        // Set current scene to initial scene
        this.currentScene = chapter.initialScene;
        
        // Add to history
        this.addToHistory({
            type: 'chapter_start',
            chapterId: chapterId,
            scene: chapter.initialScene,
            timestamp: new Date().toISOString()
        });
        
        // Emit chapter start event
        eventBus.emit('chapter:start', {
            chapterId: chapterId,
            chapter: chapter
        });
        
        // Save state
        this.saveStoryState();
        
        // Load scene content
        this.loadSceneContent();
        
        return true;
    }
    
    /**
     * Start a specific scene
     * @param {string} sceneId - Scene ID to start
     */
    startScene(sceneId) {
        // Check if scene is valid for current chapter
        const chapter = this.storyStructure.chapters[this.currentChapter];
        
        if (!chapter || !chapter.scenes.includes(sceneId)) {
            console.error(`Scene not found in current chapter: ${sceneId}`);
            return false;
        }
        
        // Set current scene
        this.currentScene = sceneId;
        
        // Add to history
        this.addToHistory({
            type: 'scene_start',
            chapterId: this.currentChapter,
            scene: sceneId,
            timestamp: new Date().toISOString()
        });
        
        // Emit scene start event
        eventBus.emit('scene:start', {
            sceneId: sceneId,
            chapterId: this.currentChapter
        });
        
        // Save state
        this.saveStoryState();
        
        // Load scene content
        this.loadSceneContent();
        
        return true;
    }
    
    /**
     * Load content for the current scene
     */
    loadSceneContent() {
        // In a production game, this would load dialog from external files
        // For now, we'll simulate with event emissions
        
        console.log(`Loading content for scene: ${this.currentScene} in chapter: ${this.currentChapter}`);
        
        // Emit event to load relevant content
        eventBus.emit('story:load_content', {
            chapterId: this.currentChapter,
            sceneId: this.currentScene
        });
    }
    
    /**
     * Set a story flag
     * @param {string} flag - Flag name
     * @param {any} value - Flag value
     */
    setFlag(flag, value) {
        if (!flag) return;
        
        this.storyFlags[flag] = value;
        
        // Add to history
        this.addToHistory({
            type: 'flag_set',
            flag: flag,
            value: value,
            timestamp: new Date().toISOString()
        });
        
        // Save state
        this.saveStoryState();
        
        // Emit flag change event
        eventBus.emit('story:flag_changed', {
            flag: flag,
            value: value
        });
    }
    
    /**
     * Get a story flag value
     * @param {string} flag - Flag name
     * @returns {any} Flag value or undefined if not set
     */
    getFlag(flag) {
        return this.storyFlags[flag];
    }
    
    /**
     * Check if story meets certain conditions
     * @param {object} conditions - Conditions to check
     * @returns {boolean} True if all conditions are met
     */
    checkConditions(conditions) {
        if (!conditions) return true;
        
        for (const flag in conditions) {
            if (this.storyFlags[flag] !== conditions[flag]) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Add an entry to story history
     * @param {object} entry - History entry
     */
    addToHistory(entry) {
        if (!entry || !entry.type) return;
        
        // Add entry to history
        this.storyHistory.push(entry);
        
        // Limit history size if needed
        if (this.storyHistory.length > 100) {
            this.storyHistory.shift();
        }
    }
    
    /**
     * Handle dialog completion
     * @param {object} data - Dialog completion data
     */
    onDialogComplete(data) {
        // In a real game, this would determine what happens after dialog ends
        console.log('Dialog completed:', data);
        
        // Add to history
        this.addToHistory({
            type: 'dialog_complete',
            dialogId: data.dialogId,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Handle choice selection
     * @param {object} data - Choice data
     */
    onChoiceMade(data) {
        if (!data || !data.choiceId) return;
        
        console.log('Choice made:', data);
        
        // Add to history
        this.addToHistory({
            type: 'choice_made',
            choiceId: data.choiceId,
            option: data.option,
            timestamp: new Date().toISOString()
        });
        
        // Record branch if this is a branching choice
        if (data.branch) {
            this.storyBranches[data.branch] = data.option;
        }
        
        // Set any flags associated with this choice
        if (data.flags) {
            for (const flag in data.flags) {
                this.setFlag(flag, data.flags[flag]);
            }
        }
        
        // Change scene if needed
        if (data.nextScene) {
            this.startScene(data.nextScene);
        }
        
        // Save state
        this.saveStoryState();
    }
    
    /**
     * Complete the current chapter
     */
    completeCurrentChapter() {
        // Set completion flag
        this.setFlag(`completed${this.currentChapter.charAt(0).toUpperCase() + this.currentChapter.slice(1)}`, true);
        
        // Add to history
        this.addToHistory({
            type: 'chapter_complete',
            chapterId: this.currentChapter,
            timestamp: new Date().toISOString()
        });
        
        // Emit chapter complete event
        eventBus.emit('chapter:complete', {
            chapterId: this.currentChapter,
            timeSpent: this.calculateChapterTimeSpent(this.currentChapter)
        });
        
        // Check for next chapter
        const chapters = Object.keys(this.storyStructure.chapters);
        const currentIndex = chapters.indexOf(this.currentChapter);
        
        if (currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            
            // Try to start next chapter
            const nextChapterStarted = this.startChapter(nextChapter);
            
            if (!nextChapterStarted) {
                // If can't start next chapter, emit event
                eventBus.emit('story:chapter_locked', {
                    chapterId: nextChapter,
                    requiredFlags: this.storyStructure.chapters[nextChapter].requiredFlags
                });
            }
        } else {
            // End of story
            eventBus.emit('story:complete');
        }
        
        // Save state
        this.saveStoryState();
    }
    
    /**
     * Calculate time spent in a chapter
     * @param {string} chapterId - Chapter ID
     * @returns {number} Time spent in seconds
     */
    calculateChapterTimeSpent(chapterId) {
        const chapterStart = this.storyHistory.find(entry => 
            entry.type === 'chapter_start' && entry.chapterId === chapterId
        );
        
        if (!chapterStart) return 0;
        
        const startTime = new Date(chapterStart.timestamp);
        const endTime = new Date();
        
        return Math.floor((endTime - startTime) / 1000);
    }
    
    /**
     * Get available chapters
     * @returns {object[]} Array of available chapters
     */
    getAvailableChapters() {
        const chapters = [];
        
        for (const chapterId in this.storyStructure.chapters) {
            const chapter = this.storyStructure.chapters[chapterId];
            const available = this.checkConditions(chapter.requiredFlags);
            
            chapters.push({
                id: chapterId,
                title: chapter.title,
                description: chapter.description,
                available: available,
                completed: !!this.storyFlags[`completed${chapterId.charAt(0).toUpperCase() + chapterId.slice(1)}`]
            });
        }
        
        return chapters;
    }
    
    /**
     * Get story completion percentage
     * @returns {number} Percentage of story completed
     */
    getCompletionPercentage() {
        const totalChapters = Object.keys(this.storyStructure.chapters).length;
        if (totalChapters === 0) return 0;
        
        let completedChapters = 0;
        
        for (const chapterId in this.storyStructure.chapters) {
            const completionFlag = `completed${chapterId.charAt(0).toUpperCase() + chapterId.slice(1)}`;
            if (this.storyFlags[completionFlag]) {
                completedChapters++;
            }
        }
        
        return Math.round((completedChapters / totalChapters) * 100);
    }
    
    /**
     * Show story map/overview
     */
    showStoryMap() {
        // This would create a UI showing chapter progress, branches, etc.
        console.log('Showing story map');
        
        // Emit event for UI manager to handle
        eventBus.emit('ui:show:story_map', {
            chapters: this.getAvailableChapters(),
            currentChapter: this.currentChapter,
            currentScene: this.currentScene,
            completion: this.getCompletionPercentage()
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = StoryManager;
}
