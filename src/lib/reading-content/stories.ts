import type { ReadingPiece } from "./index";

// Short stories, graded A1 → C1. Word counts rise with the level so each story
// stays readable for its band. Target: 10 per level (added in batches).

export const STORIES: ReadingPiece[] = [
  /* ----------------------------------------------------------------- A1 --- */
  {
    id: "st-a1-cat",
    kind: "story",
    level: "A1",
    title: "My Cat Milo",
    topic: "Animals",
    body: `I have a small cat. His name is Milo. He is white and grey.

Milo likes to sleep. He sleeps on my bed. He sleeps on the chair. He sleeps in the sun.

In the morning, Milo is hungry. He looks at me. "Meow," he says. I give him food and water.

Milo likes to play. He plays with a small ball. He runs and jumps. He is very fast!

At night, Milo sits with me. He is warm and soft. I love my cat. Milo is my best friend.`,
  },
  {
    id: "st-a1-beach",
    kind: "story",
    level: "A1",
    title: "A Day at the Beach",
    topic: "Family",
    body: `Today is sunny. My family goes to the beach. I am very happy.

The sea is blue. The sand is yellow and warm. I take off my shoes.

My brother and I play in the water. The water is cold! We laugh and run.

Mum makes sandwiches. We eat on a big towel. The food is good.

In the afternoon, I build a sandcastle. It is big. Then a wave comes and takes it. Oh no!

We go home in the evening. I am tired but happy. The beach is fun.`,
  },
  {
    id: "st-a1-balloon",
    kind: "story",
    level: "A1",
    title: "The Red Balloon",
    topic: "Childhood",
    body: `Tom has a red balloon. It is big and round. He loves it very much.

Tom plays with the balloon in the park. He hits it up. It goes up, up, up. Then it comes down. Tom laughs.

A small girl looks at the balloon. She is sad. She has no toy.

Tom thinks. Then he gives the balloon to the girl. "For you," he says.

The girl smiles. "Thank you!" she says.

Tom has no balloon now. But he is happy. It is good to share.`,
  },
  {
    id: "st-a1-zoo",
    kind: "story",
    level: "A1",
    title: "At the Zoo",
    topic: "Animals",
    body: `We go to the zoo on Saturday. There are many animals.

First, we see the lions. They are big and yellow. One lion sleeps. One lion walks.

Then we see the monkeys. They jump and play. They are very funny. I laugh a lot.

The elephants are grey and very big. They have long noses. They eat green leaves.

My favourite animal is the penguin. Penguins are black and white. They swim fast in the water.

The zoo is great. I want to come again!`,
  },

  /* ----------------------------------------------------------------- A2 --- */
  {
    id: "st-a2-key",
    kind: "story",
    level: "A2",
    title: "The Lost Key",
    topic: "Everyday life",
    body: `Sara came home from work. She was tired and wanted to relax. But when she looked in her bag, her key was not there.

"Oh no," she said. She looked again. She looked in her coat. She looked on the floor. The key was not anywhere.

Sara tried to remember. In the morning, she had the key. She opened the door and went to work. Then what? Did she leave it at the office? Did it fall in the street?

She decided to call her neighbour, Tom. Tom had a second key from last year. Luckily, he was at home.

"No problem," said Tom with a smile. He gave her the key. "Maybe make another one tomorrow," he said.

Sara thanked him. That night, she found her key — it was in her coat pocket all the time! She laughed and felt a little silly.`,
  },
  {
    id: "st-a2-friend",
    kind: "story",
    level: "A2",
    title: "A New Friend",
    topic: "School",
    body: `It was Daniel's first day at a new school. He did not know anyone. He felt nervous and stayed quiet.

At lunch, he sat alone in the corner. He opened his book and tried to read, but he was not really reading.

Then a boy came to his table. "Hi, I'm Max," he said. "Can I sit here?"

Daniel smiled. "Yes, of course."

Max liked football, just like Daniel. They talked about their favourite teams. The time passed quickly.

After lunch, Max showed Daniel the school. He showed him the library, the gym, and the science room.

"See you tomorrow," said Max at the end of the day.

Daniel walked home with a big smile. The new school was not so scary now. He had a new friend.`,
  },
  {
    id: "st-a2-rain",
    kind: "story",
    level: "A2",
    title: "The Rainy Day",
    topic: "Everyday life",
    body: `Maria planned a picnic with her friends. She was very excited. But in the morning, the sky was grey, and soon it began to rain.

"What can we do now?" asked her friend Lin sadly. Everyone looked out of the window at the heavy rain.

Maria thought for a moment. Then she had an idea. "Let's have the picnic inside!" she said.

They put a big blanket on the floor of the living room. They made sandwiches and opened a bottle of juice. Maria found some funny music to play.

Soon they were laughing and eating, just like a real picnic. They even played games together.

Outside, the rain fell all afternoon. But inside, the friends were warm and happy. "This is better than a normal picnic," said Lin with a smile.`,
  },
  {
    id: "st-a2-birthday",
    kind: "story",
    level: "A2",
    title: "The Birthday Surprise",
    topic: "Family",
    body: `It was Grandpa's seventieth birthday. The whole family wanted to do something special, so they planned a surprise party.

For a week, everyone kept the secret. Mum made a big chocolate cake. The children drew colourful cards. Uncle Sam brought balloons and put them all around the house.

On Saturday evening, Grandpa thought he was coming for a quiet dinner. He did not know about the party.

When he opened the door, all the lights came on. "Surprise!" everyone shouted together.

Grandpa stopped and looked at all the faces. For a moment, he could not speak. Then his eyes filled with happy tears.

"I have the best family in the world," he said quietly.

They sang, ate cake, and told old stories until late at night. It was a birthday Grandpa would never forget.`,
  },

  /* ----------------------------------------------------------------- B1 --- */
  {
    id: "st-b1-interview",
    kind: "story",
    level: "B1",
    title: "The Job Interview",
    topic: "Work",
    body: `Layla had wanted this job for months. The company was famous, and the position was perfect for her. When she finally got an email inviting her to an interview, her heart jumped.

The night before, she could not sleep well. She practised her answers in front of the mirror and chose her clothes carefully. She wanted everything to be perfect.

In the morning, she arrived twenty minutes early. The building was tall and modern, with glass walls and quiet lifts. A friendly woman led her to a small meeting room.

Two managers were waiting. At first, Layla's voice shook a little, but she took a deep breath and reminded herself why she was there. Slowly, she relaxed. She talked about her experience, her ideas, and the projects she was proud of.

One manager asked a difficult question about a mistake she had made in the past. Instead of hiding it, Layla explained honestly what had happened and what she had learned. The managers nodded and seemed pleased.

A week later, the email arrived. She had got the job. Layla read it three times before she believed it. Sometimes, she thought, being honest is the strongest answer of all.`,
  },
  {
    id: "st-b1-photo",
    kind: "story",
    level: "B1",
    title: "The Old Photograph",
    topic: "Family",
    body: `While cleaning the attic, Omar found a dusty box full of old papers. Among them was a black-and-white photograph he had never seen before.

In the picture, a young woman stood in front of a small house. She was smiling, and she held a baby in her arms. On the back, someone had written a date: forty years ago.

Omar took the photo to his grandmother. Her eyes filled with tears when she saw it.

"That's me," she said softly. "And the baby is your mother."

She told him a story he had never heard. When she was young, the family had very little money. They lived in that tiny house for many years. Life was hard, but they were happy together.

"We didn't have much," she said, "but we had each other. That was enough."

Omar looked at the photograph again. The house was gone now, replaced by a busy road. But the moment in the picture would always remain.

He decided to put the photo in a frame and keep it on his desk — a small window into a past he was only beginning to understand.`,
  },
  {
    id: "st-b1-bus",
    kind: "story",
    level: "B1",
    title: "The Wrong Bus",
    topic: "Travel",
    body: `Hana was visiting a new city for the first time. She wanted to see the famous old castle on the hill, so she got on a bus and found a seat by the window.

After twenty minutes, she began to worry. The streets looked smaller and quieter, and there was no castle in sight. She realised she had taken the wrong bus.

She got off at the next stop, feeling lost and a little frightened. She did not know where she was. Then she noticed an old man sitting on a bench, feeding the birds.

Nervously, she asked him for directions. The man smiled kindly and explained that the castle was on the other side of the city. But instead of just pointing the way, he offered to walk with her to the correct bus stop.

On the way, he told her interesting stories about the city and showed her a beautiful little garden that tourists never found. By the time Hana reached the castle, she felt that getting lost had been the best part of her day.

Sometimes, she thought, the wrong path leads to the right adventure.`,
  },
  {
    id: "st-b1-kindness",
    kind: "story",
    level: "B1",
    title: "A Small Kindness",
    topic: "Community",
    body: `Every morning, Victor passed the same flower seller on his way to work. She was an old woman with a small stall on the corner, and she always greeted him with a warm smile, even on cold and rainy days.

Victor was usually busy and stressed. Most days he hurried past without really noticing her. But one freezing morning, he saw that she had no gloves, and her hands were red from the cold.

That evening, on his way home, Victor stopped at a shop and bought a pair of warm gloves. The next morning, he gave them to her. "For your hands," he said simply.

The woman was so surprised that she could hardly speak. "No one has done anything like this for me in years," she whispered.

From that day, something changed. Victor began to stop and talk to her each morning. He learned her name was Rosa, and that she had been selling flowers for thirty years.

A pair of gloves had cost him very little. But the friendship it created was worth far more than he had ever imagined.`,
  },

  /* ----------------------------------------------------------------- B2 --- */
  {
    id: "st-b2-decision",
    kind: "story",
    level: "B2",
    title: "The Decision",
    topic: "Life choices",
    body: `For as long as she could remember, Nadia had planned to become a doctor. Her parents spoke of it with pride, her teachers encouraged it, and she had spent years working towards the goal. Yet now, standing at the edge of her final exams, she felt a strange and unwelcome doubt.

It had started quietly, like a small crack in a window. During a summer volunteering at a community centre, she had discovered something unexpected: she loved teaching. Watching a child finally understand a difficult idea gave her a joy that no biology textbook ever had.

She told no one at first. The thought of disappointing her family was almost unbearable. They had sacrificed so much, and changing direction now seemed selfish, even ungrateful.

One evening, she finally spoke to her father. She expected anger, or at least sadness. Instead, he was quiet for a long time.

"When I was your age," he said at last, "I wanted to be a musician. My father told me it was foolish, so I became an accountant. I have had a good life. But I have always wondered."

He looked at her gently. "Do not live a life of wondering, Nadia. Choose what is true for you."

She did not decide that night. But for the first time, the future felt like hers to shape — not a path already drawn, but an open road.`,
  },
  {
    id: "st-b2-letter",
    kind: "story",
    level: "B2",
    title: "A Letter from the Past",
    topic: "Mystery",
    body: `The letter arrived on an ordinary Tuesday, slipped between the electricity bill and a supermarket leaflet. The envelope was yellow with age, and the handwriting was unfamiliar. Strangely, it was addressed to Daniel — but the postmark was thirty years old.

He turned it over several times, half expecting it to be a joke. Finally, he opened it. Inside was a single page, written in careful, old-fashioned script.

"If you are reading this," it began, "then the plan has worked, and time has carried these words to you exactly as I hoped."

The writer claimed to be Daniel's grandfather, a man who had died before Daniel was born. He explained that he had arranged for the letter to be kept and posted decades later, on a date he had chosen with great care.

The letter contained no money, no secret, no dramatic revelation. Instead, it offered advice — gentle, ordinary advice about kindness, patience, and the value of small daily habits. At the end, the old man had written: "I will never meet you, but I have loved you all the same."

Daniel sat for a long time at his kitchen table. The afternoon light moved slowly across the walls. He had inherited his grandfather's name, his stubborn chin, and now, somehow, his words. It felt less like reading a letter and more like hearing a voice across an impossible distance.`,
  },
  {
    id: "st-b2-neighbour",
    kind: "story",
    level: "B2",
    title: "The Neighbour",
    topic: "Society",
    body: `For three years, Clara had lived next to a man she had never spoken to. He was elderly and silent, and the curtains of his flat were always drawn. The other residents whispered that he was unfriendly, even strange, and Clara had quietly accepted their opinion without ever questioning it.

One winter night, a storm knocked out the electricity in the entire building. In the sudden darkness, Clara heard a faint knock at her door. It was the old man, holding a candle. "I have spare ones," he said quietly, offering her a small box. "I thought you might need light."

Surprised, she invited him in. Over a cup of tea by candlelight, the silent neighbour slowly began to talk. He told her he had been a sailor, then a teacher, and that his wife had died five years ago. Since then, he admitted, he had found it difficult to face the world.

"People think I don't like them," he said with a sad smile. "The truth is, I just didn't know how to begin again."

Clara felt a quiet shame. For three years she had judged a lonely man without ever knocking on his door. That night, a friendship began that would change both of their lives — proof that the walls between people are often thinner than they appear.`,
  },
  {
    id: "st-b2-audition",
    kind: "story",
    level: "B2",
    title: "The Audition",
    topic: "Ambition",
    body: `Yusuf had dreamed of playing the violin on a real stage since he was seven years old. Now, at nineteen, he stood backstage at the most important audition of his life, his hands trembling so badly that he feared he would drop the instrument.

He had practised for months, sometimes eight hours a day, until his fingers ached. He knew the piece perfectly. And yet, listening to the brilliant musicians who went before him, he was certain he would fail.

When his name was called, he walked out into the bright lights and faced a panel of serious, silent judges. He lifted his bow, and for one terrible moment his mind went completely blank.

Then he closed his eyes and simply began to play. He stopped thinking about the judges, the lights, and his fear. He thought only of the music, and of why he had fallen in love with it as a child.

When he finished, there was a brief silence. Then one of the judges, a famous old conductor, leaned forward. "Young man," she said, "you did not play the notes. You played the meaning behind them. That is something we cannot teach."

Yusuf did not yet know whether he had won a place. But for the first time, he understood that he was, truly, a musician.`,
  },

  /* ----------------------------------------------------------------- C1 --- */
  {
    id: "st-c1-inheritance",
    kind: "story",
    level: "C1",
    title: "The Inheritance",
    topic: "Drama",
    body: `When the lawyer phoned to say that her estranged uncle had left her his house, Elena assumed there had been some mistake. She had met the man perhaps three times in her entire life, and on each occasion he had seemed cold and impatient, a person who measured the world in profit and loss. That he should leave her anything at all seemed not merely unlikely but absurd.

The house stood at the end of a long, neglected lane, half-swallowed by ivy and silence. Inside, dust lay over everything like a fine grey snow. Yet the rooms were not empty in the way she had expected. They were crowded — not with furniture, but with books. Thousands of them, stacked on every surface, lining every wall, climbing in unsteady towers towards the ceiling.

As she explored, Elena began to notice notes in the margins, written in a small, precise hand. Her uncle had argued with the authors, praised them, questioned them. In one volume she found a pressed flower; in another, a faded ticket to a concert. Slowly, a different man emerged from these pages — curious, passionate, secretly tender, hidden behind a lifetime of careful distance.

In the study, she discovered a letter addressed to her. It was brief. "You will not remember," he had written, "but when you were a child, you asked me what my favourite book was, and you listened to the answer. No one else ever did. I have wondered about you ever since."

Elena sat down among the towers of books, the afternoon dimming around her. She had inherited a house, yes — but also a question she had not known she carried, and the strange, belated gift of being remembered by a stranger who had, after all, been family.`,
  },
  {
    id: "st-c1-train",
    kind: "story",
    level: "C1",
    title: "The Last Train",
    topic: "Reflection",
    body: `The platform was nearly deserted when Marcus arrived, breathless, his coat half on. The departure board flickered with a single remaining service: the 11:47, the last train of the night. He had run the entire length of the station to catch it, and now, with two minutes to spare, he found himself oddly reluctant to board.

It had been a strange evening. A dinner that should have been routine had turned, somewhere between the main course and the coffee, into a quiet reckoning. An old friend, now grey and unfamiliar, had said something that lodged itself in Marcus's mind like a splinter: "We always think there will be more time. And then, suddenly, there isn't."

Standing on the cold platform, Marcus considered the shape of his own life. For years he had postponed things — the phone calls, the apologies, the trip he always meant to take. There would be time later, he had always assured himself. The future was a vast, patient room in which everything could eventually be arranged.

The train slid in, its windows glowing warmly against the dark. Doors opened with a sigh. Inside, a few tired passengers sat staring at nothing, carried homeward by habit.

Marcus did not move. He let the doors close. He watched the last train pull away, its red lights shrinking into the distance, and felt, unexpectedly, a kind of relief. He would walk instead. It was a long way home, but the night was clear, and for the first time in years he was in no hurry at all. Some journeys, he realised, were not meant to be rushed.`,
  },
  {
    id: "st-c1-lighthouse",
    kind: "story",
    level: "C1",
    title: "The Lighthouse Keeper",
    topic: "Solitude",
    body: `For twenty-two years, Aldous had kept the lighthouse on the rocky island three miles from the mainland. He had chosen the work deliberately, drawn to its solitude after a life that had grown too loud and too crowded with disappointment. The sea, he often said, asked nothing of him but attention.

The rhythm of his days was unvarying. He cleaned the great lens until it shone, recorded the weather in a leather book, and each night set the light turning against the darkness. Ships he would never meet passed safely because of him, and that anonymous usefulness had become, over the years, a quiet source of pride.

Then came the letter from the lighthouse authority. The light was to be automated. A machine would do his work now, tirelessly and without complaint, and he was to be retired to a small flat in a town he did not know.

In his final weeks, Aldous found himself studying everything with new eyes — the particular grey of the morning sea, the cry of the gulls, the way the light swept across the waves like a slow, patient hand. He had spent half his life believing he had withdrawn from the world. Only now, on the edge of leaving, did he understand how completely he had belonged to it.

On his last night, he climbed the spiral stairs one final time and lit the lamp by hand, as he always had. The beam reached out across the black water, steady and certain. Somewhere out there, he knew, a ship was finding its way home. It was enough. It had always been enough.`,
  },
  {
    id: "st-c1-cartographer",
    kind: "story",
    level: "C1",
    title: "The Cartographer",
    topic: "Discovery",
    body: `Isadora drew maps of places that did not exist. It had begun in childhood as a game and had hardened, over the decades, into a quiet obsession. While other cartographers measured the real world with instruments and satellites, she filled vast sheets of paper with imaginary coastlines, invented mountain ranges, and the winding rivers of countries that had never troubled to come into being.

Critics found her work charming but pointless. A map, they argued, was a tool for finding one's way; a map of nowhere led nowhere. Isadora never disagreed. She simply continued, adding each day to an atlas that now filled three rooms of her house.

One autumn, a young historian came to interview her, expecting an eccentric old woman with a harmless hobby. Instead, he found something that unsettled him. As he studied her invented lands, he began to recognise things — a valley shaped like a regret he had never spoken aloud, a city that resembled the future he had once hoped for and quietly abandoned.

"These places are not real," he said uncertainly.

Isadora smiled. "Of course they are real," she replied. "They are simply not located on the Earth. Every map shows a territory. Mine show the territories inside us — the journeys we did not take, the selves we might have been."

The historian left without his interview. But for years afterwards, whenever he reached a crossroads in his life, he thought of the old cartographer and her atlas of imaginary worlds, and he understood that the most important maps are sometimes the ones that describe no land at all.`,
  },
];
