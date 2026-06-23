// Listening library for the Listening section.
//
// No audio files and no API needed: the transcript is read aloud in the
// browser using the built-in Web Speech API (SpeechSynthesis). Each exercise
// has comprehension questions that are auto-graded. Later, real recorded or
// AI-generated audio can replace the browser voice.

import type { ReadingLevel } from "./reading-content";

export interface ListenQuestion {
  prompt: string;
  options: string[];
  answer: number; // index of the correct option
}

export interface ListenExercise {
  id: string;
  level: ReadingLevel;
  title: string;
  topic?: string;
  /** What the voice reads aloud. Use "\n" between speakers for dialogues. */
  transcript: string;
  questions: ListenQuestion[];
}

const EXERCISES: ListenExercise[] = [
  {
    id: "ls-a1-family",
    level: "A1",
    title: "Anna's Family",
    topic: "People",
    transcript: `Hello! My name is Anna. I am ten years old. I live in a small house with my family.

I have one brother. His name is Tom. He is twelve. I have no sisters.

My mother is a teacher. She works at a school. My father is a doctor. He works at a hospital.

We have a small dog. His name is Rex. We all love him very much.`,
    questions: [
      {
        prompt: "How old is Anna?",
        options: ["Ten", "Twelve", "Eight"],
        answer: 0,
      },
      {
        prompt: "Who is Tom?",
        options: ["Her father", "Her brother", "Her dog"],
        answer: 1,
      },
      {
        prompt: "What is Anna's mother's job?",
        options: ["A doctor", "A teacher", "A nurse"],
        answer: 1,
      },
      {
        prompt: "What is the name of the dog?",
        options: ["Tom", "Anna", "Rex"],
        answer: 2,
      },
    ],
  },
  {
    id: "ls-a1-cafe",
    level: "A1",
    title: "At the Café",
    topic: "Daily life",
    transcript: `Waiter: Good morning! What would you like?

Customer: Good morning. I would like a coffee, please.

Waiter: With milk?

Customer: Yes, please. And one piece of cake.

Waiter: Chocolate cake or apple cake?

Customer: Chocolate cake, please.

Waiter: Okay. That is four dollars.`,
    questions: [
      {
        prompt: "What drink does the customer want?",
        options: ["Tea", "Coffee", "Water"],
        answer: 1,
      },
      {
        prompt: "Does the customer want milk?",
        options: ["Yes", "No", "We don't know"],
        answer: 0,
      },
      {
        prompt: "Which cake does the customer choose?",
        options: ["Apple cake", "Chocolate cake", "No cake"],
        answer: 1,
      },
      {
        prompt: "How much is it?",
        options: ["Four dollars", "Fourteen dollars", "Forty dollars"],
        answer: 0,
      },
    ],
  },
  {
    id: "ls-a2-weekend",
    level: "A2",
    title: "My Weekend",
    topic: "Free time",
    transcript: `Last weekend was really nice. On Saturday morning, I got up early and went for a run in the park. The weather was sunny and warm.

In the afternoon, I met my friend Maria. We went to the cinema and watched a funny film. After that, we ate pizza at a small restaurant.

On Sunday, I stayed at home. I cleaned my room and did my homework. In the evening, I called my grandmother and we talked for an hour. It was a relaxing weekend.`,
    questions: [
      {
        prompt: "What did the speaker do on Saturday morning?",
        options: ["Went for a run", "Cleaned the room", "Watched a film"],
        answer: 0,
      },
      {
        prompt: "What kind of film did they watch?",
        options: ["A scary film", "A funny film", "A sad film"],
        answer: 1,
      },
      {
        prompt: "What did the speaker do on Sunday?",
        options: ["Met Maria", "Stayed at home", "Went to a restaurant"],
        answer: 1,
      },
      {
        prompt: "Who did the speaker call on Sunday evening?",
        options: ["Maria", "A teacher", "Their grandmother"],
        answer: 2,
      },
    ],
  },
  {
    id: "ls-a2-directions",
    level: "A2",
    title: "Asking for Directions",
    topic: "City",
    transcript: `Tourist: Excuse me, how do I get to the train station?

Local: Sure. Go straight down this street for about five minutes.

Tourist: Okay, straight ahead.

Local: Then turn left at the bank. The station is on your right, next to a big supermarket.

Tourist: Is it far?

Local: No, only about ten minutes on foot.

Tourist: Thank you very much!

Local: You're welcome. Have a good trip!`,
    questions: [
      {
        prompt: "Where does the tourist want to go?",
        options: ["The bank", "The train station", "The supermarket"],
        answer: 1,
      },
      {
        prompt: "Where should the tourist turn left?",
        options: ["At the bank", "At the station", "At the supermarket"],
        answer: 0,
      },
      {
        prompt: "What is next to the station?",
        options: ["A park", "A big supermarket", "A hospital"],
        answer: 1,
      },
      {
        prompt: "How long does it take on foot?",
        options: ["About ten minutes", "About an hour", "About five seconds"],
        answer: 0,
      },
    ],
  },
  {
    id: "ls-b1-booking",
    level: "B1",
    title: "A Phone Booking",
    topic: "Restaurants",
    transcript: `Receptionist: Good evening, Riverside Restaurant. How can I help you?

Caller: Hi, I'd like to book a table for Friday evening, please.

Receptionist: Of course. For how many people?

Caller: For four people. Is eight o'clock possible?

Receptionist: Let me check... I'm afraid eight is fully booked. We have a table free at half past seven, or at nine.

Caller: Half past seven would be perfect.

Receptionist: Great. Can I take a name, please?

Caller: Yes, it's under Daniel Carter.

Receptionist: Thank you, Mr Carter. We've booked a table for four on Friday at seven thirty. We look forward to seeing you.`,
    questions: [
      {
        prompt: "Which day does the caller want to book?",
        options: ["Thursday", "Friday", "Saturday"],
        answer: 1,
      },
      {
        prompt: "How many people is the booking for?",
        options: ["Two", "Four", "Eight"],
        answer: 1,
      },
      {
        prompt: "Why can't they book eight o'clock?",
        options: ["It is fully booked", "The restaurant is closed", "It is too early"],
        answer: 0,
      },
      {
        prompt: "What time does the caller finally choose?",
        options: ["Seven thirty", "Eight o'clock", "Nine o'clock"],
        answer: 0,
      },
    ],
  },
];

export const LISTENING_LIBRARY = EXERCISES;

export function listenById(id: string): ListenExercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
