// Practice IELTS Speaking questions reflecting commonly-reported topics for the
// 2026 Jan–Aug period. These are representative practice questions (not leaked
// exam content) grouped by theme across Part 1, Part 2 and Part 3.

export interface SpeakingTopic {
  id: string;
  theme: string;
  part1: string[];
  cue: { card: string; bullets: string[] };
  part3: string[];
}

export const SPEAKING_TOPICS: SpeakingTopic[] = [
  {
    id: "hometown",
    theme: "Hometown & places",
    part1: [
      "Where is your hometown?",
      "What do you like most about it?",
      "Has your hometown changed much in recent years?",
      "Would you like to live there in the future?",
    ],
    cue: {
      card: "Describe a place in your city that you enjoy visiting.",
      bullets: ["where it is", "how often you go there", "what you do there", "and explain why you enjoy it"],
    },
    part3: [
      "Why do people enjoy visiting public places?",
      "How have cities in your country changed over the last 20 years?",
      "Do you think urban or rural areas are better for raising children?",
      "What facilities should every modern city have?",
    ],
  },
  {
    id: "person",
    theme: "A person who influenced you",
    part1: [
      "Who do you spend most of your time with?",
      "Do you prefer a few close friends or many friends?",
      "Is it easy for you to make new friends?",
      "How do you usually keep in touch with people?",
    ],
    cue: {
      card: "Describe a person who has had an important influence on your life.",
      bullets: ["who the person is", "how you know them", "what they have done", "and explain how they influenced you"],
    },
    part3: [
      "What qualities make someone a good role model?",
      "Do you think celebrities influence young people too much?",
      "How has the idea of a 'role model' changed over time?",
      "Should parents or teachers have more influence on children?",
    ],
  },
  {
    id: "journey",
    theme: "A memorable trip",
    part1: [
      "Do you enjoy travelling?",
      "What kind of places do you like to visit?",
      "Do you prefer travelling alone or with others?",
      "How do you usually plan a trip?",
    ],
    cue: {
      card: "Describe a memorable journey or trip you have taken.",
      bullets: ["where you went", "who you went with", "what you did", "and explain why it was memorable"],
    },
    part3: [
      "Why do people like to travel to other countries?",
      "What are the benefits of tourism for a country?",
      "Does tourism cause any problems?",
      "How might travel change in the future?",
    ],
  },
  {
    id: "technology",
    theme: "Technology & apps",
    part1: [
      "How often do you use your phone?",
      "What apps do you use most?",
      "Do you prefer texting or calling?",
      "Has technology changed the way you study?",
    ],
    cue: {
      card: "Describe a website or app that you find useful.",
      bullets: ["what it is", "how you found it", "how you use it", "and explain why it is useful"],
    },
    part3: [
      "How has technology changed the way people learn?",
      "Do you think people rely too much on technology?",
      "What are the risks of spending too much time online?",
      "Will traditional classrooms disappear in the future?",
    ],
  },
  {
    id: "skill",
    theme: "Learning a skill",
    part1: [
      "Is there a skill you would like to learn?",
      "Did you learn anything new recently?",
      "Do you prefer learning alone or in a group?",
      "Is it better to learn from a teacher or by yourself?",
    ],
    cue: {
      card: "Describe a skill you would like to learn.",
      bullets: ["what the skill is", "why you want to learn it", "how you would learn it", "and explain how it would help you"],
    },
    part3: [
      "Why is lifelong learning important?",
      "Should schools teach more practical skills?",
      "Are some skills better learned at a young age?",
      "How does technology help people learn new skills?",
    ],
  },
  {
    id: "decision",
    theme: "An important decision",
    part1: [
      "Do you make decisions quickly or slowly?",
      "Do you ask others for advice before deciding?",
      "Have you ever regretted a decision?",
      "Are you good at making plans?",
    ],
    cue: {
      card: "Describe an important decision you have made.",
      bullets: ["what the decision was", "when you made it", "how you decided", "and explain why it was important"],
    },
    part3: [
      "Why do some people find it hard to make decisions?",
      "Is it better to make decisions based on emotion or logic?",
      "Should young people make their own decisions?",
      "How can people improve their decision-making?",
    ],
  },
];

export function questionForPart(topic: SpeakingTopic, part: 1 | 2 | 3): string {
  if (part === 1) return `Part 1 questions:\n- ${topic.part1.join("\n- ")}`;
  if (part === 3) return `Part 3 discussion:\n- ${topic.part3.join("\n- ")}`;
  return `Part 2 cue card: ${topic.cue.card}\nYou should say:\n- ${topic.cue.bullets.join("\n- ")}`;
}
