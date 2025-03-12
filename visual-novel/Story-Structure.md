# Visual Novel Story Structure

## Core Framework
- Linear progression through scenes
- Each scene features one character with the player
- Key decision points that lead to specific branches
- All interactions flow naturally from one to the next
## NodeState

When a current dialog node is set it a state.
- speaker
- response

## Story Data Structure Example

This is an example of a story scene in JSON format that is stored in the outputs/scenes/ directory.
```json
{
    id: "scene001",
    title: "Welcome to Madrid",
    location_id: "apartment",
    character_id: "brian",
    dialog: {
        "000": {
            speaker: "player",
            spanish: "Te despiertas en tu nuevo apartamento en Madrid. La luz del sol de la mañana entra por las persianas mientras escuchas a alguien en la cocina.",
            english: "You wake up in your new apartment in Madrid. The morning sunlight streams through the blinds as you hear someone in the kitchen.",
            default_next_id: "001"
        },
        "001": {
            speaker: "brian",
            spanish: "¡Buenos días! ¿Ya te has despertado?",
            english: "Oh, you're up! Good morning!",
            choices: [
                {
                    english: "Good morning. You must be Brian?",
                    spanish: "Buenos días. ¿Tú debes ser Brian?"
                    next_id: "002"
                },
                ...
            ]
        }
        ...
        "030": {
            speaker: "brian",
            spanish: "...",
            english: "See you later, don't forget to get some groceries at Mercadona!"
            next_scene_id: "scene003"
        }
    }
}
```

- speaker is always the player or another character
 - there is no narrator, the player's inner monologue would act like narration when needed.
- if there is no choices that the default_next_id will transition to the next scene
- choices are always from the perspective of the player

Sometimes you want to have a response for a specific choice but the choice always leads to the next
default is so there is a nested response eg.
```json
{
    "id": "scene002",
    "dialog": {
        "000": {
            "speaker": "brian",
            "spanish": "¡Buenos días! ¿Ya te has despertado?",
            "english": "Oh, you're up! Good morning!",
            "default_next_id": "001",
            "choices": [
                {
                    "english": "Good morning. You must be Brian?",
                    "spanish": "Buenos días. ¿Tú debes ser Brian?",
                    "response": {
                        "speaker": "brian",
                        "spanish": "¡Exacto! Soy Brian.",
                        "english": "That's right! I'm Brian."
                    }
                },
                {
                    "english": "Hello. Nice to meet you.",
                    "spanish": "Hola. Encantado de conocerte.",
                    "response": {
                        "speaker": "brian",
                        "spanish": "¡Encantado! Soy Brian. ¿Acabas de llegar a Madrid?",
                        "english": "Nice to meet you! I'm Brian. You just arrived in Madrid?"
                    }
                }
            ]
        }
    }
}


## Story Structure

### Chapter 1: First Day in Madrid
1. **Scene 1**: Player wakes up in their apartment, Brian (roommate) welcomes them to Madrid
2. **Scene 2**: Brian gives basic information about the neighborhood and language school
3. **Scene 3**: Player arrives at language school, meets Lucía Sánchez
4. **Scene 4**: First basic Spanish lesson with Lucía
5. **Scene 5**: Lucía assigns homework - visit Mercadona to buy groceries

### Chapter 2: Getting Oriented
1. **Scene 1**: Visit to Mercadona, shopping for groceries
2. **Scene 2**: Language challenge with shopping list (player practices everyday Spanish)
3. **Scene 3**: Return to apartment, Brian suggests visiting café for practice
4. **Scene 4**: Visit to café, meeting Carmen the barista

**BRANCH POINT 1**: How you respond to Carmen's question about what you want to focus on
- Option A: Academic language focus → Study Path
- Option B: Cultural understanding → Culture Path
- Option C: Daily conversation skills → Practical Path

### Study Path (Branch A)
1. **Scene 1**: Carmen introduces you to Carlos at the café
2. **Scene 2**: Study session with Carlos at the language school
3. **Scene 3**: Advanced lesson with Lucía Sánchez
4. **Scene 4**: Meeting Mariana at the language school library
5. **Scene 5**: Grammar challenge with Mariana

**BRANCH POINT 2A**: Your approach to language learning
- Option A1: Text-focused study → Reading/Writing Ending
- Option A2: Conversation practice → Speaking/Listening Ending

### Culture Path (Branch B)
1. **Scene 1**: Carmen shares cultural insights during café break
2. **Scene 2**: Meeting Elena at her apartment for tapas
3. **Scene 3**: Cultural lesson with Elena
4. **Scene 4**: Visit to Mercadona, discussion with Javier about Spanish food traditions
5. **Scene 5**: Cultural practice exercises with Lucía

**BRANCH POINT 2B**: How you engage with Spanish culture
- Option B1: Traditional customs → Traditional Ending 
- Option B2: Modern youth culture → Contemporary Ending

### Practical Path (Branch C)
1. **Scene 1**: Brian shows practical Spanish phrases at apartment
2. **Scene 2**: Shopping practice at Mercadona
3. **Scene 3**: Practical conversation at café with Carmen
4. **Scene 4**: Real-life application exercises with Lucía
5. **Scene 5**: Final practical challenge at Madrid Metro with Martín

**BRANCH POINT 2C**: Your approach to daily communication
- Option C1: Independent problem-solving → Self-Reliance Ending
- Option C2: Community assistance → Social Connection Ending

### Final Chapter: Language Assessment
Each path concludes with a final assessment at the language school with Lucía Sánchez, with content varying based on chosen path.

## Endings Overview

### Study Path Endings:
- **Reading/Writing Ending**: Player excels at written Spanish and passes DELE B2 with high marks in reading comprehension
- **Speaking/Listening Ending**: Player develops excellent conversation skills and can navigate complex discussions

### Culture Path Endings:
- **Traditional Ending**: Player gains deep appreciation for Spanish traditions and cultural nuances
- **Contemporary Ending**: Player becomes fluent in modern Spanish expressions and pop culture references

### Practical Path Endings:
- **Self-Reliance Ending**: Player develops confidence handling daily situations independently in Spanish
- **Social Connection Ending**: Player builds a network of local connections and support through language skills

## Language Learning Integration

Each scene includes:
- **Relevant Vocabulary**: Words specific to the location and situation
- **Grammar Points**: New structures introduced through character dialog
- **Cultural Notes**: Insights into Spanish customs and practices
- **Practice Exercises**: Interactive language challenges with feedback

## Character-Specific Language Focus

- **Lucía Sánchez**: Formal Spanish, proper grammar, academic vocabulary
- **Carmen Gómez**: Casual conversation, youth slang, service industry terms
- **Martín López**: Business Spanish, formal requests, transportation vocabulary
- **Carlos García**: Grammar structure, language learning techniques
- **Mariana Rivera**: Vocabulary expansion, memorization strategies
- **Javier Ruiz**: Traditional expressions, shopping vocabulary, numbers
- **Elena Martínez**: Polite Spanish, cultural terminology, traditional phrases
- **Brian Johnson**: Daily life conversation, roommate terminology, basic needs
