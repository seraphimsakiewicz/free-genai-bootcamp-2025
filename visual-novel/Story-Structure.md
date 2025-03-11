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
    title: "Welcome to Japan",
    location_id: "apartment",
    character_id: "alex",
    dialog: {
        "000": {
            speaker: "player",
            japanese: "あなたは新しいアパートにおり、朝日の光が窓の中を流すように、あなたは起きた。",
            english: "You wake up in your new apartment in Japan. The morning sunlight streams through the blinds as you hear someone in the kitchen.",
            default_next_id: "001"
        },
        "001": {
            speaker: "alex",
            japanese: "おはよう！起きた？",
            english: "Oh, you're up! Good morning!",
            choices: [
                {
                    english: "Good morning. You must be Alex?",
                    japanese: "おはようございます。アレックスさんですか？"
                    next_id: "002"
                },
                ...
            ]
        }
        ...
        "030": {
            speaker: "alex",
            japanese: "...",
            english: "See you later, remember to visit the post office!"
            next_scene_id: "scene003"
        }
    }
}
```

- speaker is always the player or another character
 - there is no narrator, the player's inner monologue would act like narration when needed.
- if there is no choices that the default_next_id will transition to the next scene
- choices are always from the perspective of the player

Sometimes you want to have a response for a specific choice but the choice always leads to the next default is so there there is a nested response eg.
```json
{
    "id": "scene002",
    "dialog": {
        "000": {
            "speaker": "alex",
            "japanese": "おはよう！起きた？",
            "english": "Oh, you're up! Good morning!",
            "default_next_id": "001",
            "choices": [
                {
                    "english": "Good morning. You must be Alex?",
                    "japanese": "おはようございます。アレックスさんですか？",
                    "response": {
                        "speaker": "alex",
                        "japanese": "そうだよ！アレックスです。",
                        "english": "That's right! I'm Alex. "
                    }
                },
                {
                    "english": "Hello. Nice to meet you.",
                    "japanese": "こんにちは。はじめまして。",
                    "response": {
                        "speaker": "alex",
                        "japanese": "はじめまして！アレックスです。日本に来たばかりだね？",
                        "english": "Nice to meet you! I'm Alex. You just arrived in Japan"
                    }
                }
            ]
        }
    }
}


## Story Structure

### Chapter 1: First Day in Japan
1. **Scene 1**: Player wakes up in their apartment, Alex (roommate) welcomes them to Japan
2. **Scene 2**: Alex gives basic information about the neighborhood and language school
3. **Scene 3**: Player arrives at language school, meets Yamamoto Sensei
4. **Scene 4**: First basic Japanese lesson with Yamamoto
5. **Scene 5**: Yamamoto assigns homework - visit the post office to mail a form

### Chapter 2: Getting Oriented
1. **Scene 1**: Visit to post office, meeting Tanaka Hiroshi
2. **Scene 2**: Language challenge with forms (player practices formal Japanese)
3. **Scene 3**: Return to apartment, Alex suggests visiting café for practice
4. **Scene 4**: Visit to café, meeting Nakamura Yuki

**BRANCH POINT 1**: How you respond to Yuki's question about what you want to focus on
- Option A: Academic language focus → Study Path
- Option B: Cultural understanding → Culture Path
- Option C: Daily conversation skills → Practical Path

### Study Path (Branch A)
1. **Scene 1**: Yuki introduces you to Carlos at the café
2. **Scene 2**: Study session with Carlos at the language school
3. **Scene 3**: Advanced lesson with Yamamoto Sensei
4. **Scene 4**: Meeting Min-ji at the language school library
5. **Scene 5**: Grammar challenge with Min-ji

**BRANCH POINT 2A**: Your approach to language learning
- Option A1: Text-focused study → Reading/Writing Ending
- Option A2: Conversation practice → Speaking/Listening Ending

### Culture Path (Branch B)
1. **Scene 1**: Yuki shares cultural insights during café break
2. **Scene 2**: Meeting Akiko at her apartment for tea
3. **Scene 3**: Cultural lesson with Akiko
4. **Scene 4**: Visit to corner store, discussion with Kenji about traditions
5. **Scene 5**: Cultural practice exercises with Yamamoto

**BRANCH POINT 2B**: How you engage with Japanese culture
- Option B1: Traditional customs → Traditional Ending 
- Option B2: Modern youth culture → Contemporary Ending

### Practical Path (Branch C)
1. **Scene 1**: Alex shows practical Japanese phrases at apartment
2. **Scene 2**: Shopping practice at Kenji's corner store
3. **Scene 3**: Practical conversation at café with Yuki
4. **Scene 4**: Real-life application exercises with Yamamoto
5. **Scene 5**: Final practical challenge at post office with Hiroshi

**BRANCH POINT 2C**: Your approach to daily communication
- Option C1: Independent problem-solving → Self-Reliance Ending
- Option C2: Community assistance → Social Connection Ending

### Final Chapter: Language Assessment
Each path concludes with a final assessment at the language school with Yamamoto Sensei, with content varying based on chosen path.

## Endings Overview

### Study Path Endings:
- **Reading/Writing Ending**: Player excels at written Japanese and passes JLPT N4 with high marks in reading comprehension
- **Speaking/Listening Ending**: Player develops excellent conversation skills and can navigate complex discussions

### Culture Path Endings:
- **Traditional Ending**: Player gains deep appreciation for Japanese traditions and cultural nuances
- **Contemporary Ending**: Player becomes fluent in modern Japanese expressions and pop culture references

### Practical Path Endings:
- **Self-Reliance Ending**: Player develops confidence handling daily situations independently in Japanese
- **Social Connection Ending**: Player builds a network of local connections and support through language skills

## Language Learning Integration

Each scene includes:
- **Relevant Vocabulary**: Words specific to the location and situation
- **Grammar Points**: New structures introduced through character dialog
- **Cultural Notes**: Insights into Japanese customs and practices
- **Practice Exercises**: Interactive language challenges with feedback

## Character-Specific Language Focus

- **Yamamoto Sensei**: Formal Japanese, proper grammar, academic vocabulary
- **Nakamura Yuki**: Casual conversation, youth slang, service industry terms
- **Tanaka Hiroshi**: Business Japanese, formal requests, written forms
- **Garcia Carlos**: Grammar structure, language learning techniques
- **Kim Min-ji**: Vocabulary expansion, memorization strategies
- **Suzuki Kenji**: Traditional expressions, shopping vocabulary, numbers
- **Watanabe Akiko**: Polite Japanese, cultural terminology, traditional phrases
- **Alex Thompson**: Daily life conversation, roommate terminology, basic needs
