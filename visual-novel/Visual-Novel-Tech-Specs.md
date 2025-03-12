# Game Design Doc and Tech Specifications

## Overview

### Game Concept

A Castilian Spanish language learning visual novel with minimal interactivity focused on key
decision points. The game structure follows a branching narrative ("if-else" tree) where player
choices determine story paths, scenarios, and endings. This format efficiently delivers Spanish
language content for intermediate (B2) learners while maintaining narrative engagement.

### Target Audience

- Intermediate Spanish language learners (B2 level)

### Platform

Web-application

## Story and Setting

### Synopsis

You are an adult living in Madrid, Spain, immersing yourself in the language by attending a local
language school and exploring the city over one month.

## Core Story Framework

- Linear progression through scenes
- Each scene features one character interacting with the player
- Key decision points lead to specific narrative branches
- All interactions flow naturally from one to the next

> **Note**: The complete story structure is detailed in [Story-Structure.md](Story-Structure.md)

### Settings

Vibrant Madrid in early autumn

#### Locations / Scenes

**Cafe (Interior)**  
A warm, inviting Madrid cafe with a blend of modern and traditional Spanish decor. Wooden tables and
comfortable chairs create intimate spaces for conversation. Large windows allow natural light to
pour in, accentuating local artwork on the walls and a chalkboard menu listing daily specials in
Spanish. Soft background music and the aroma of freshly brewed coffee set a relaxed atmosphere for
language practice.

**Parque del Retiro (Exterior)**  
The iconic Parque del Retiro, a lush urban oasis in the heart of Madrid. Meandering pathways wind
past manicured gardens, shimmering ponds, and scattered sculptures. Benches under century-old trees
offer quiet spots to practice conversational Spanish. The ambient sounds of nature and distant
chatter create a natural setting for informal language exchange.

**Madrid Metro (Interior)**  
A bustling Madrid metro station characterized by its modern design and clear digital signage in
Spanish. Clean platforms, polished tiled walls, and efficient service create an atmosphere of
organized energy. Announcements in clear Castilian guide commuters through the busy network,
providing real-life context for everyday language and transportation vocabulary.

**Gran Via (Exterior)**  
The lively Gran Via street, known for its impressive architecture, theaters, and fashionable shops.
Bright billboards, vibrant storefronts, and the rhythmic hum of the city capture Madrid's dynamic
spirit. As you wander along the bustling boulevard, interactions with local vendors and passers-by
offer practical opportunities to practice contemporary Spanish in real-life scenarios.

**Mercadona (Interior)**  
A typical Mercadona supermarket with its distinctive green and white branding. Bright fluorescent
lighting illuminates neatly organized aisles stocked with Spanish and international products. The
produce section showcases fresh fruits and vegetables from local farms, while the deli counter
offers a variety of Spanish cheeses, cured meats, and olives. Announcements in clear Castilian
Spanish occasionally echo through the store, and shoppers navigate their carts through the busy but
efficient space. The checkout area features multiple lanes with cashiers greeting customers with
typical Spanish courtesy phrases, providing an authentic environment to practice everyday shopping
vocabulary and interactions.

## Characters

#### Metro Attendant
- **Name**: Martín López
- **Gender**: Male
- **Age**: 45
- **Nationality**: Spanish
- **Appearance**: Middle-aged man with short, dark hair flecked with gray, wearing rectangular
  glasses and a neatly pressed uniform. His demeanor is professional with impeccable posture.
- **Personality**: Formal, helpful, and patient with language learners.
- **Role**: Assists the player with navigating the metro system and teaches essential transportation
  vocabulary.
- **Language Level**: Speaks slowly and clearly, using formal Castilian Spanish.
- **Key Interactions**: Guides the player on how to purchase tickets, read schedules, and use the
  metro network.

#### Student 1
- **Name**: Mariana Rivera
- **Gender**: Female
- **Age**: 24
- **Nationality**: Colombian
- **Appearance**: A young woman with shoulder-length dark hair accented by colorful clips, a round
  face, and a bright smile. She dresses in trendy yet casual attire with a penchant for pastel hues
  and unique accessories.
- **Personality**: Outgoing and enthusiastic, though she sometimes speaks too quickly.
- **Role**: Fellow language student and potential friend.
- **Language Level**: Intermediate, with occasional mix-ups in vocabulary.
- **Key Interactions**: Acts as a study partner and introduces the player to local hotspots.

#### Student 2
- **Name**: Carlos García
- **Gender**: Male
- **Age**: 30
- **Nationality**: Spanish
- **Appearance**: A tall man with olive skin, short dark hair neatly styled, and a trimmed beard. He
  wears rectangular glasses and is typically dressed in smart-casual attire with button-up shirts
  and slacks.
- **Personality**: Serious, studious, and competitive.
- **Role**: A rival student who challenges the player to improve.
- **Language Level**: Intermediate with precise grammar.
- **Key Interactions**: Engages in quiz competitions and grammar discussions.

#### Teacher
- **Name**: Lucía Sánchez
- **Gender**: Female
- **Age**: 38
- **Nationality**: Spanish
- **Appearance**: A professional woman with shoulder-length dark hair usually pulled into a neat
  bun, minimal makeup, and conservative yet elegant clothing like a blazer and pencil skirt. She
  carries a sleek leather briefcase.
- **Personality**: Strict but kind and encouraging.
- **Role**: Main instructor at the language school.
- **Language Level**: Adjusts her speech to student levels while modeling perfect Castilian Spanish.
- **Key Interactions**: Delivers daily lessons, assigns homework, and explains cultural nuances.

#### Barista
- **Name**: Carmen Gómez
- **Gender**: Female
- **Age**: 26
- **Nationality**: Spanish
- **Appearance**: A trendy young woman with a stylish undercut and dyed auburn hair, accented by a
  few ear piercings and a subtle tattoo peeking from her sleeve. She wears a personalized cafe
  uniform adorned with quirky pins.
- **Personality**: Creative, chatty, and deeply interested in different cultures.
- **Role**: Provides casual conversation practice and real-life language exposure.
- **Language Level**: Uses relaxed Castilian Spanish with local slang.
- **Key Interactions**: Manages coffee orders and engages in small talk about daily life.

#### Gran Via Shopkeeper
- **Name**: Javier Ruiz
- **Gender**: Male
- **Age**: 60
- **Nationality**: Spanish
- **Appearance**: An older man with thinning gray hair and a slightly hunched posture. His weathered
  face and laugh lines speak of years of experience. He wears a traditional apron over simple
  clothes and sports reading glasses on a cord.
- **Personality**: Traditional and a bit gruff at first, though he warms up with time.
- **Role**: Tests the player's shopping vocabulary and practical communication skills.
- **Language Level**: Speaks rapid, natural Castilian Spanish infused with local expressions.
- **Key Interactions**: Assists with purchasing items and offers recommendations on local goods.

#### Neighbor
- **Name**: Elena Martínez
- **Gender**: Female
- **Age**: 35
- **Nationality**: Spanish
- **Appearance**: An elegant woman with long, straight dark hair and minimal makeup. She favors
  high-quality, understated clothing and occasionally accents her look with traditional Spanish
  jewelry.
- **Personality**: Reserved and polite, yet warm when engaging.
- **Role**: Introduces the player to local customs and social etiquette.
- **Language Level**: Uses clear, polite Castilian Spanish.
- **Key Interactions**: Shares insights into local life and offers cultural tips.

#### Roommate
- **Name**: Brian Johnson
- **Gender**: Male
- **Age**: 28
- **Nationality**: American
- **Appearance**: An athletic, casually dressed man with shaggy dark hair and a friendly smile. He
  favors jeans and t-shirts that reflect his laid-back style.
- **Personality**: Messy, fun-loving, and a bit of a night owl.
- **Role**: Acts as the player's daily conversation partner and occasional source of humorous
  conflict.
- **Language Level**: Has good spanish, but speaks a bit broken and has a bit of an accent.
- **Key Interactions**: Shares day-to-day experiences and plans outings around Madrid.
