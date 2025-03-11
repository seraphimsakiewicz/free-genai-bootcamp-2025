# Game Design Doc and Tech Specifications

## Overview

### Game Concept

A Japanese language learning visual novel with minimal interactivity focused on key decision points. The game structure follows a branching narrative ('if-else' tree) where player choices determine story paths, scenarios, and endings. This format efficiently delivers Japanese language content while maintaining narrative engagement.

### Target Audience

- Japanese language learners (Beginners, JLPT5)

### Platform

Web-application

## Story and Setting

### Synopsis

You are an adult in Japan going to a private language learning school for 1 month to immerse yourself in the language.

## Core Story Framework
- Linear progression through scenes
- Each scene features one character with the player
- Key decision points that lead to specific branches
- All interactions flow naturally from one to the next

> **Note**: The complete story structure is detailed in [Story-Structure.md](Story-Structure.md)


### Settings

Small Japanese town, late summer

#### Locations / Scenes

**Post Office (Interior)**  
A bright, organized Japanese post office interior with clean service counters and staff in crisp blue uniforms. Organized shelves display forms and packaging materials along one wall. Large windows let in natural light, illuminating the polished floors. A digital number display shows who's next in line. Official posters with Japanese text line the walls, and a small area with writing supplies is available for customers to fill out forms.

**Cafe (Interior)**  
A cozy, modern cafe interior with a blend of Japanese and Western aesthetics. Wooden tables and comfortable seating are arranged to create intimate conversation spaces. Large windows frame views of a small Japanese garden. The service counter displays freshly made pastries under glass, with a menu board above showing items in both Japanese and English. Local artwork decorates the warm-toned walls, and a small bookshelf with language exchange materials sits in one corner.

**Private Language Learning School (Classroom Interior)**  
A bright, modern classroom inside a converted traditional Japanese building. The room features sliding paper doors, wooden floors, and large windows with views of a small courtyard garden. Desks are arranged in a U-shape facing a digital whiteboard. Walls are covered with colorful Japanese language posters, hiragana/katakana charts, and examples of student work. A teacher's desk sits at the front with neatly organized teaching materials and a small desktop computer.

**Apartment (Interior)**  
A modest Japanese apartment interior featuring a combined living/sleeping area with traditional tatami mat flooring. A folded futon sits in one corner next to a small table. The compact kitchenette has essential appliances and minimal counter space. Sliding paper doors separate the main room from a narrow balcony visible through a window. Built-in storage cabinets line one wall. The space blends traditional Japanese elements with modern necessities like a wall-mounted air conditioner, small TV, and compact refrigerator.

**Corner Store (Interior)**  
A brightly lit Japanese konbini (convenience store) interior with immaculately organized shelves and displays. Refrigerated glass-door cases line one wall with drinks and prepared meals. Central aisles contain neatly arranged snacks, instant foods, and daily necessities. A service counter features hot food items like oden and steamed buns under warming lamps. Digital advertisements play on screens above the register area. Colorful seasonal promotions and point cards are displayed prominently. The store's bright fluorescent lighting illuminates everything in characteristic convenience store clarity.

### Characters

#### Post Office Clerk
- **Name**: Tanaka Hiroshi
- **Gender**: Male
- **Age**: 45
- **Nationality**: Japanese
- **Appearance**: Middle-aged man with short, neatly combed black hair with some gray, rectangular glasses, clean-shaven, always wearing a crisp postal uniform with perfect posture
- **Personality**: Formal, helpful, patient with language learners
- **Role**: Helps player learn postal vocabulary and formal Japanese
- **Language Level**: Speaks slowly and clearly, uses basic to intermediate Japanese
- **Key Interactions**: Teaches player how to send packages, buy stamps, fill out forms

#### Student 1
- **Name**: Kim Min-ji
- **Gender**: Female
- **Age**: 24
- **Nationality**: South Korean
- **Appearance**: Young woman with shoulder-length black hair often styled with colorful clips, round face with bright smile, fashionable casual clothes with a preference for pastel colors and cute accessories
- **Personality**: Outgoing, enthusiastic, sometimes speaks too fast
- **Role**: Fellow language student, potential friend
- **Language Level**: Intermediate, occasionally mixes up words
- **Key Interactions**: Study partner, introduces player to local spots

#### Student 2
- **Name**: Garcia Carlos
- **Gender**: Male
- **Age**: 30
- **Nationality**: Spanish
- **Appearance**: Tall man with olive skin, short dark brown hair neatly styled, trimmed beard, rectangular glasses, typically dressed in business casual attire with button-up shirts and slacks
- **Personality**: Serious, studious, competitive
- **Role**: Rival student who challenges player
- **Language Level**: Advanced beginner, very precise with grammar
- **Key Interactions**: Quiz competitions, grammar discussions

#### Teacher
- **Name**: Yamamoto Sensei
- **Gender**: Female
- **Age**: 38
- **Nationality**: Japanese
- **Appearance**: Professional woman with shoulder-length black hair usually in a neat bun, minimal makeup, elegant but conservative clothing in neutral colors, often wears a blazer and pencil skirt, carries a leather briefcase
- **Personality**: Strict but kind, encouraging
- **Role**: Main instructor at language school
- **Language Level**: Adjusts speech based on student level, models perfect Japanese
- **Key Interactions**: Daily lessons, homework assignments, cultural explanations

#### Barista
- **Name**: Nakamura Yuki
- **Gender**: Female
- **Age**: 26
- **Nationality**: Japanese
- **Appearance**: Trendy young woman with dyed purple hair in an undercut style, several ear piercings, artistic tattoo peeking from sleeve, wears the cafe uniform but personalizes it with pins and accessories
- **Personality**: Creative, chatty, interested in foreign cultures
- **Role**: Provides casual conversation practice
- **Language Level**: Uses casual Japanese with slang
- **Key Interactions**: Coffee orders, small talk about daily life

#### Corner Store Clerk
- **Name**: Suzuki Kenji
- **Gender**: Male
- **Age**: 60
- **Nationality**: Japanese
- **Appearance**: Older man with thinning gray hair, slightly hunched posture, weathered face with prominent laugh lines, wears a traditional store apron over simple clothing, reading glasses hanging from a cord around his neck
- **Personality**: Traditional, slightly grumpy but warms up over time
- **Role**: Tests player's shopping vocabulary
- **Language Level**: Uses fast, natural Japanese with local dialect
- **Key Interactions**: Purchasing items, asking for recommendations

#### Apartment Neighbour
- **Name**: Watanabe Akiko
- **Gender**: Female
- **Age**: 35
- **Nationality**: Japanese
- **Appearance**: Elegant woman with long straight black hair, minimal makeup, often seen in simple but high-quality clothing like cardigans and skirts, sometimes wears traditional Japanese clothing at home
- **Personality**: Reserved, polite, occasionally invites player for tea
- **Role**: Introduces aspects of Japanese home life
- **Language Level**: Polite form Japanese, clear pronunciation
- **Key Interactions**: Neighborhood information, cultural customs at home

#### Apartment Roommate
- **Name**: Alex Thompson
- **Gender**: Male
- **Age**: 28
- **Nationality**: Canadian
- **Appearance**: Athletic build with shaggy light brown hair, casual style with jeans and t-shirts often featuring Canadian or hockey logos, friendly smile, often carrying a camera or smartphone to document experiences
- **Personality**: Messy, fun-loving, night owl
- **Role**: Daily conversation partner, source of conflicts and resolutions
- **Language Level**: Mix of basic Japanese and English when frustrated
- **Key Interactions**: Sharing living space, planning weekend activities