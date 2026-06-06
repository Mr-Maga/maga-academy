// IELTS Speaking practice banks reflecting the most commonly-reported topics for
// 2025–2026. These are representative practice prompts (not leaked exam content),
// split the real way the test is: Part 1 question sets, Part 2 cue cards, Part 3
// discussions.

export interface Part1Set {
  id: string;
  theme: string;
  questions: string[];
}
export interface CueCard {
  id: string;
  theme: string;
  card: string;
  bullets: string[];
}
export interface Part3Set {
  id: string;
  theme: string;
  questions: string[];
}

export const PART1_SETS: Part1Set[] = [
  { id: "p1-work-study", theme: "Work or studies", questions: ["Do you work or are you a student?", "Why did you choose that job / subject?", "What do you enjoy most about it?", "Is there anything you would like to change about it?"] },
  { id: "p1-hometown", theme: "Hometown", questions: ["Where is your hometown?", "What is it known for?", "Has it changed much in recent years?", "Would you recommend it to a tourist?"] },
  { id: "p1-home", theme: "Home & accommodation", questions: ["Do you live in a house or a flat?", "What is your favourite room?", "Would you like to move somewhere else in the future?", "What would your ideal home be like?"] },
  { id: "p1-free-time", theme: "Free time", questions: ["What do you usually do in your free time?", "Do you prefer to relax alone or with others?", "Has the way you spend free time changed?", "Do you have enough free time these days?"] },
  { id: "p1-food", theme: "Food & cooking", questions: ["What kind of food do you like?", "Do you prefer eating at home or eating out?", "Can you cook?", "Has your diet changed in recent years?"] },
  { id: "p1-tech", theme: "Phones & technology", questions: ["How often do you use your phone?", "Which apps do you use the most?", "Do you prefer calling or texting people?", "Could you live without your phone for a day?"] },
  { id: "p1-music", theme: "Music", questions: ["What kind of music do you like?", "When do you usually listen to music?", "Have your music tastes changed over time?", "Would you like to learn an instrument?"] },
  { id: "p1-sport", theme: "Sport & exercise", questions: ["Do you do any sports or exercise?", "Did you play sports as a child?", "Do you prefer watching or playing sport?", "Is sport popular in your country?"] },
  { id: "p1-travel", theme: "Travel & holidays", questions: ["Do you like travelling?", "What was your last holiday like?", "Do you prefer the sea or the mountains?", "Where would you like to go next?"] },
  { id: "p1-reading", theme: "Reading", questions: ["Do you enjoy reading?", "What kind of books do you read?", "Do you prefer paper books or e-books?", "Did you read a lot as a child?"] },
  { id: "p1-weather", theme: "Weather & seasons", questions: ["What is the weather like in your country?", "Which season do you like best?", "Does the weather affect your mood?", "Do you prefer hot or cold weather?"] },
  { id: "p1-shopping", theme: "Shopping", questions: ["Do you enjoy shopping?", "Do you prefer shopping online or in stores?", "How often do you go shopping?", "Do you usually plan your purchases?"] },
  { id: "p1-friends", theme: "Friends", questions: ["Do you have many friends?", "Do you prefer a few close friends or a big group?", "How do you usually keep in touch?", "How do you make new friends?"] },
  { id: "p1-routine", theme: "Daily routine", questions: ["What does a typical day look like for you?", "Are you a morning or an evening person?", "Has your routine changed recently?", "What part of the day do you like best?"] },
  { id: "p1-weekend", theme: "Weekends", questions: ["What do you usually do at the weekend?", "Do you prefer to stay in or go out?", "Are weekends important to you?", "What would your perfect weekend be?"] },
  { id: "p1-photos", theme: "Photographs", questions: ["Do you like taking photos?", "What do you usually photograph?", "Do you prefer taking photos or being in them?", "Do you keep printed photos?"] },
];

export const PART2_CUECARDS: CueCard[] = [
  { id: "p2-influence", theme: "A person who influenced you", card: "Describe a person who has had an important influence on your life.", bullets: ["who the person is", "how you know them", "what they have done", "and explain how they influenced you"] },
  { id: "p2-skilled", theme: "Someone good at their job", card: "Describe a person who is very good at their job.", bullets: ["who this person is", "what their job is", "how you know they are good at it", "and explain how you feel about them"] },
  { id: "p2-old-person", theme: "An interesting older person", card: "Describe an interesting old person you know.", bullets: ["who they are", "how you know them", "what makes them interesting", "and explain why you enjoy talking to them"] },
  { id: "p2-helped", theme: "A time you helped someone", card: "Describe a time when you helped someone.", bullets: ["who you helped", "what the situation was", "what you did", "and explain how you felt afterwards"] },
  { id: "p2-taught", theme: "Teaching someone", card: "Describe a time when you taught something to someone.", bullets: ["what you taught", "who you taught", "how you did it", "and explain how it went"] },
  { id: "p2-journey", theme: "A memorable journey", card: "Describe a memorable journey or trip you have taken.", bullets: ["where you went", "who you went with", "what you did", "and explain why it was memorable"] },
  { id: "p2-city", theme: "A city you visited", card: "Describe a city you have visited and liked.", bullets: ["which city it was", "when you went", "what you did there", "and explain why you liked it"] },
  { id: "p2-place-relax", theme: "A place to relax", card: "Describe a place where you go to relax.", bullets: ["where it is", "how often you go", "what you do there", "and explain why it helps you relax"] },
  { id: "p2-natural", theme: "A natural place", card: "Describe a natural place (e.g. a river, lake or sea) that you like.", bullets: ["where it is", "how you got to know it", "what it looks like", "and explain why you like it"] },
  { id: "p2-historical", theme: "A historical place", card: "Describe a historical place you have visited or want to visit.", bullets: ["what and where it is", "what you know about it", "what you did or would do there", "and explain why it interests you"] },
  { id: "p2-app", theme: "A useful app or website", card: "Describe an app or website that you find useful.", bullets: ["what it is", "how you found it", "how you use it", "and explain why it is useful"] },
  { id: "p2-tech-item", theme: "A piece of technology", card: "Describe a piece of technology you use a lot.", bullets: ["what it is", "how you got it", "how you use it", "and explain how it helps you"] },
  { id: "p2-skill", theme: "A skill you want to learn", card: "Describe a skill you would like to learn.", bullets: ["what the skill is", "why you want to learn it", "how you would learn it", "and explain how it would help you"] },
  { id: "p2-decision", theme: "An important decision", card: "Describe an important decision you have made.", bullets: ["what the decision was", "when you made it", "how you decided", "and explain why it was important"] },
  { id: "p2-challenge", theme: "A challenge you overcame", card: "Describe a difficult challenge that you overcame.", bullets: ["what the challenge was", "why it was difficult", "how you dealt with it", "and explain how you felt afterwards"] },
  { id: "p2-goal", theme: "A future goal", card: "Describe a goal or ambition you have for the future.", bullets: ["what the goal is", "why you want to achieve it", "what you are doing to reach it", "and explain how you will feel when you achieve it"] },
  { id: "p2-proud", theme: "A time you felt proud", card: "Describe a time when you felt proud of yourself.", bullets: ["what you did", "when it happened", "why it was difficult", "and explain why you felt proud"] },
  { id: "p2-busy", theme: "A busy time", card: "Describe a time when you were very busy.", bullets: ["when it was", "why you were busy", "what you had to do", "and explain how you managed"] },
  { id: "p2-waited", theme: "A time you waited", card: "Describe a time when you had to wait for something.", bullets: ["what you waited for", "where you were", "how long you waited", "and explain how you felt while waiting"] },
  { id: "p2-changed-mind", theme: "Changing your mind", card: "Describe a time when you changed your mind about something.", bullets: ["what it was about", "what you thought at first", "why you changed your mind", "and explain how you feel about it now"] },
  { id: "p2-good-news", theme: "Some good news", card: "Describe a piece of good news you received.", bullets: ["what the news was", "how you received it", "who told you", "and explain how you felt"] },
  { id: "p2-advice", theme: "Useful advice", card: "Describe a piece of useful advice someone gave you.", bullets: ["what the advice was", "who gave it to you", "when they gave it", "and explain why it was useful"] },
  { id: "p2-conversation", theme: "An interesting conversation", card: "Describe an interesting conversation you had.", bullets: ["who you talked to", "where it took place", "what you talked about", "and explain why it was interesting"] },
  { id: "p2-gift", theme: "A gift you gave", card: "Describe a gift you gave to someone.", bullets: ["what it was", "who you gave it to", "why you chose it", "and explain how they reacted"] },
  { id: "p2-meal", theme: "A special meal", card: "Describe a special meal you had.", bullets: ["what the meal was", "where you had it", "who you were with", "and explain why it was special"] },
  { id: "p2-clothing", theme: "A favourite item of clothing", card: "Describe an item of clothing you like to wear.", bullets: ["what it is", "where you got it", "when you wear it", "and explain why you like it"] },
  { id: "p2-book", theme: "A book you enjoyed", card: "Describe a book you have read and enjoyed.", bullets: ["what it was about", "when you read it", "why you chose it", "and explain why you enjoyed it"] },
  { id: "p2-film", theme: "A film or TV show", card: "Describe a film or TV programme that you like.", bullets: ["what it is", "what it is about", "when you watched it", "and explain why you like it"] },
  { id: "p2-leisure", theme: "A leisure activity", card: "Describe a leisure activity you enjoy doing.", bullets: ["what it is", "how often you do it", "who you do it with", "and explain why you enjoy it"] },
  { id: "p2-outdoor", theme: "An outdoor activity", card: "Describe an outdoor activity you enjoy.", bullets: ["what it is", "where you do it", "who you do it with", "and explain why you like it"] },
  { id: "p2-competition", theme: "A competition", card: "Describe a competition or contest you took part in.", bullets: ["what it was", "when it happened", "what you had to do", "and explain how you felt about it"] },
  { id: "p2-creative", theme: "A creative person", card: "Describe a creative person you admire.", bullets: ["who they are", "what they do", "why you think they are creative", "and explain why you admire them"] },
  { id: "p2-ad", theme: "An advertisement", card: "Describe an advertisement that you remember well.", bullets: ["what it was for", "where you saw it", "what happened in it", "and explain why you remember it"] },
  { id: "p2-photo", theme: "A photo you like", card: "Describe a photograph that you like.", bullets: ["what is in it", "who took it", "when it was taken", "and explain why you like it"] },
  { id: "p2-small-business", theme: "A small business", card: "Describe a small or local business you like.", bullets: ["what it is", "where it is", "what it sells or offers", "and explain why you like it"] },
  { id: "p2-rule", theme: "A useful rule or law", card: "Describe a rule or law that you think is useful.", bullets: ["what it is", "who it applies to", "why it exists", "and explain why you think it is useful"] },
  { id: "p2-quiet", theme: "A quiet place", card: "Describe a quiet place you like to spend time in.", bullets: ["where it is", "how often you go", "what you do there", "and explain why you like its quietness"] },
  { id: "p2-foreign", theme: "A country you want to visit", card: "Describe a foreign country you would like to visit.", bullets: ["which country it is", "how you know about it", "what you would do there", "and explain why you want to go"] },
  { id: "p2-routine-day", theme: "A perfect day", card: "Describe what would be a perfect day for you.", bullets: ["what you would do", "where you would be", "who you would be with", "and explain why it would be perfect"] },
  { id: "p2-childhood", theme: "A childhood memory", card: "Describe a happy memory from your childhood.", bullets: ["what the memory is", "when it happened", "who was there", "and explain why you remember it well"] },
];

export const PART3_SETS: Part3Set[] = [
  { id: "p3-tech", theme: "Technology & society", questions: ["How has technology changed the way people communicate?", "Do you think people rely too much on technology?", "What are the dangers of spending too much time online?", "How might technology change our lives in the future?"] },
  { id: "p3-edu", theme: "Education", questions: ["Why is lifelong learning becoming more important?", "Should schools teach more practical skills?", "Is it better to learn online or in a classroom?", "How can teachers make learning more interesting?"] },
  { id: "p3-work", theme: "Work & careers", questions: ["Why do many people change jobs frequently nowadays?", "Is a high salary or job satisfaction more important?", "How has remote work changed people's lives?", "Will some jobs disappear in the future?"] },
  { id: "p3-env", theme: "The environment", questions: ["What are the biggest environmental problems today?", "Can individuals really make a difference?", "Should governments do more to protect the environment?", "How can we encourage people to recycle more?"] },
  { id: "p3-travel", theme: "Travel & tourism", questions: ["Why do people enjoy travelling to other countries?", "What are the benefits of tourism for a country?", "Does tourism cause any problems?", "How might travel change in the future?"] },
  { id: "p3-family", theme: "Family & relationships", questions: ["How have families changed in recent decades?", "Should parents or teachers have more influence on children?", "Why do some people stay close to their relatives and others not?", "How important is it to spend time with family?"] },
  { id: "p3-media", theme: "Media & news", questions: ["How do most people get their news these days?", "Can we always trust the news?", "Do the media pay too much attention to celebrities?", "How has social media changed the news?"] },
  { id: "p3-health", theme: "Health & lifestyle", questions: ["Why are lifestyle-related illnesses increasing?", "Should governments tax unhealthy food?", "Is it the individual's or the government's responsibility to stay healthy?", "How can people be encouraged to exercise more?"] },
  { id: "p3-money", theme: "Money & consumerism", questions: ["Why do people buy things they don't really need?", "Is advertising a positive or negative thing?", "Should children learn about managing money at school?", "Does money make people happy?"] },
  { id: "p3-culture", theme: "Culture & tradition", questions: ["Why is it important to keep traditions alive?", "How has globalisation affected local cultures?", "Should young people be made to learn about their culture?", "Do festivals still matter in modern life?"] },
  { id: "p3-city", theme: "Cities & housing", questions: ["Why are more people moving to cities?", "What problems do big cities face?", "Is it better to live in a city or in the countryside?", "What facilities should every modern city have?"] },
  { id: "p3-roles", theme: "Role models & influence", questions: ["What qualities make someone a good role model?", "Do celebrities influence young people too much?", "How has the idea of a role model changed?", "Can ordinary people be role models?"] },
  { id: "p3-decisions", theme: "Decisions & risk", questions: ["Why do some people find it hard to make decisions?", "Is it better to decide with emotion or logic?", "Should young people make their own decisions?", "How can people make better decisions?"] },
  { id: "p3-comm", theme: "Communication & language", questions: ["Why is learning a foreign language useful?", "Is it better to learn a language young?", "Will technology replace the need to learn languages?", "Why do some languages disappear?"] },
  { id: "p3-future", theme: "The future", questions: ["How will daily life be different in 50 years?", "Are people too optimistic or pessimistic about the future?", "Which changes do you think will be most important?", "Should we worry about the future or focus on the present?"] },
  { id: "p3-creativity", theme: "Creativity & art", questions: ["Why is creativity important in modern life?", "Can creativity be taught, or is it natural?", "Should governments fund the arts?", "How does art benefit society?"] },
];

export function randomOf<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Human-readable question text passed to the examiner for a given part. */
export function part1Text(s: Part1Set): string {
  return `IELTS Speaking Part 1 — ${s.theme}. Questions:\n- ${s.questions.join("\n- ")}`;
}
export function cueText(c: CueCard): string {
  return `IELTS Speaking Part 2 cue card: ${c.card}\nYou should say:\n- ${c.bullets.join("\n- ")}`;
}
export function part3Text(s: Part3Set): string {
  return `IELTS Speaking Part 3 — ${s.theme}. Discussion questions:\n- ${s.questions.join("\n- ")}`;
}
