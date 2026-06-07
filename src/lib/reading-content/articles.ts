import type { ReadingPiece } from "./index";

// Factual articles, graded A1 → C1, on a wide range of topics. All grounded in
// well-established, reliable information. Target: 30 per level (added in batches).

export const ARTICLES: ReadingPiece[] = [
  /* ----------------------------------------------------------------- A1 --- */
  {
    id: "ar-a1-water",
    kind: "article",
    level: "A1",
    title: "Water Is Life",
    topic: "Health",
    body: `Water is very important. People need water every day. We drink water. We use water to cook. We use water to wash.

Our body needs water. More than half of the body is water. When we are hot, we need more water.

Doctors say: drink six to eight glasses of water a day. Water is good for you. It helps your body work well.

We can drink water at home, at school, and at work. Water has no sugar. It is the best drink.

Remember: drink water every day. Water is life!`,
  },
  {
    id: "ar-a1-dogs",
    kind: "article",
    level: "A1",
    title: "Dogs",
    topic: "Animals",
    body: `Dogs are popular animals. Many people have a dog at home.

Dogs can be big or small. Some dogs are brown. Some are black or white.

Dogs are friendly. They like people. A dog can be a good friend.

Dogs need food and water. They need walks every day. They like to run and play.

Some dogs help people. They help the police. They help blind people. Dogs are clever and kind.

Do you like dogs?`,
  },
  {
    id: "ar-a1-sun",
    kind: "article",
    level: "A1",
    title: "The Sun",
    topic: "Science",
    body: `The Sun is a big star. It is very, very hot. It is far from Earth.

The Sun gives us light. In the day, the sky is bright. At night, there is no Sun, and the sky is dark.

The Sun gives us heat too. It makes the day warm. Plants need the Sun to grow.

We need the Sun. But do not look at the Sun. It is too bright for your eyes.

The Sun is yellow and round. It is the most important star for us.`,
  },
  {
    id: "ar-a1-colours",
    kind: "article",
    level: "A1",
    title: "Colours Around Us",
    topic: "Everyday life",
    body: `There are many colours in the world. Look around you. What can you see?

The sky is blue. The grass is green. The sun is yellow.

Some colours are warm, like red and orange. Some colours are cool, like blue and green.

We use colours every day. Cars come in many colours. Clothes come in many colours too.

What is your favourite colour? My favourite colour is green. It is the colour of trees and grass.

Colours make the world beautiful.`,
  },

  /* ----------------------------------------------------------------- A2 --- */
  {
    id: "ar-a2-food",
    kind: "article",
    level: "A2",
    title: "Eating Healthy Food",
    topic: "Health",
    body: `Healthy food is important for everyone. When we eat well, we feel better and have more energy.

Fruit and vegetables are very good for us. They have vitamins that help the body stay strong. Doctors say we should eat them every day. An apple, a banana, or some carrots are easy and healthy.

It is also good to drink water instead of sweet drinks. Sweet drinks have a lot of sugar, and too much sugar is not good for our teeth or our health.

Of course, we can still enjoy cake or chocolate sometimes. The important thing is balance. We do not need to be perfect. We just need to make good choices most of the time.

Cooking at home is another good idea. When you cook, you know what is in your food. Fast food often has too much salt and fat.

Eating healthy food is not difficult. Start with small changes, and your body will thank you.`,
  },
  {
    id: "ar-a2-internet",
    kind: "article",
    level: "A2",
    title: "Life with the Internet",
    topic: "Technology",
    body: `The internet has changed our lives. Today, millions of people use it every day for many different things.

We use the internet to find information. If we have a question, we can search for an answer in seconds. Students use it to study, and workers use it to do their jobs.

The internet also helps us talk to people. We can send messages, share photos, and make video calls. A person in one country can talk to a friend in another country very easily.

Many people watch films, listen to music, and play games online. We can also buy clothes, food, and other things without leaving home.

But the internet is not always good. Some people spend too much time online. It is important to take breaks and meet real people too.

The internet is a useful tool. We just need to use it in a smart and healthy way.`,
  },
  {
    id: "ar-a2-exercise",
    kind: "article",
    level: "A2",
    title: "Exercise and Your Body",
    topic: "Health",
    body: `Exercise is good for everyone. When we move our bodies, we become stronger and healthier.

There are many ways to exercise. You can walk, run, swim, or ride a bicycle. You can also play sports like football or basketball with friends.

Exercise is good for the heart. It makes the heart strong. It also helps us sleep better at night and feel happier during the day.

Doctors say we should be active for about thirty minutes a day. This is not difficult. You can walk to school or take the stairs instead of the lift.

You do not need a gym or special clothes to start. A simple walk in the park is a great beginning.

Find an activity you enjoy. When exercise is fun, it is easy to do it every day.`,
  },
  {
    id: "ar-a2-recycling",
    kind: "article",
    level: "A2",
    title: "Why We Recycle",
    topic: "Environment",
    body: `Every day, people throw away a lot of rubbish. Much of this rubbish goes to big sites called landfills, where it stays for many years. This is bad for the planet.

Recycling can help. When we recycle, we use old things to make new things. For example, old paper can become new paper, and old glass bottles can become new ones.

Many things can be recycled. Paper, glass, metal, and some plastics are all good for recycling. In many cities, there are special bins with different colours for each kind of rubbish.

Recycling saves energy and natural materials like trees and water. It also keeps our streets and seas cleaner.

We can all help. Put your rubbish in the right bin. Use less plastic. Carry a bag when you go shopping.

Small actions, done by millions of people, can make a big difference for the Earth.`,
  },
  {
    id: "ar-a2-moon",
    kind: "article",
    level: "A2",
    title: "The Moon",
    topic: "Science",
    body: `The Moon is the brightest object in the night sky. It travels around the Earth, and it takes about a month to go all the way around.

The Moon does not make its own light. The light we see comes from the Sun. The Sun shines on the Moon, and the Moon reflects the light to us.

The shape of the Moon seems to change during the month. Sometimes we see a full, round Moon. Sometimes we see only a thin line. These different shapes are called the phases of the Moon.

The Moon also moves the seas. It pulls the water and creates the tides, which make the sea rise and fall every day.

In 1969, people travelled to the Moon for the first time. Astronauts walked on its grey, dusty surface and brought back rocks to study.

The Moon is our closest neighbour in space, and people have looked at it with wonder for thousands of years.`,
  },

  /* ----------------------------------------------------------------- B1 --- */
  {
    id: "ar-b1-coffee",
    kind: "article",
    level: "B1",
    title: "The History of Coffee",
    topic: "Culture",
    body: `Coffee is one of the most popular drinks in the world. Every day, billions of cups are made and enjoyed. But where did this drink come from?

According to a famous legend, coffee was discovered in Ethiopia hundreds of years ago. A young goat herder noticed that his goats became very lively after eating the red berries of a certain plant. Curious, he tried the berries himself and felt more awake. Soon, people learned to make a drink from them.

From Ethiopia, coffee travelled to the Arabian Peninsula. By the fifteenth century, people were growing coffee and drinking it in special coffee houses. These places became important centres for conversation, business, and the sharing of news and ideas.

Later, coffee spread to Europe. At first, some people did not trust the strange new drink. But it quickly became fashionable, and coffee houses opened in many cities. Writers, artists, and thinkers met there to discuss their work.

Today, coffee is grown in many warm countries, such as Brazil, Colombia, and Vietnam. It is a huge global business that supports millions of farmers.

Whether you drink it black or with milk, coffee connects people across cultures and continents — a simple drink with a surprisingly rich history.`,
  },
  {
    id: "ar-b1-climate",
    kind: "article",
    level: "B1",
    title: "Climate Change: The Basics",
    topic: "Environment",
    body: `Climate change is one of the biggest challenges of our time. But what exactly does it mean, and why are so many people worried about it?

The Earth's climate has always changed slowly over thousands of years. However, scientists have noticed that the planet is now getting warmer much faster than before. The main reason is human activity.

When we burn fuels like coal, oil, and gas, we release gases into the air. These gases, especially carbon dioxide, trap heat from the sun. This is sometimes called the "greenhouse effect." As more gases collect in the atmosphere, the Earth becomes warmer.

A warmer planet causes many problems. Ice at the North and South Poles is melting, which makes sea levels rise. Some places have more floods, while others have longer droughts. Extreme weather is becoming more common.

The good news is that people can take action. Using less energy, switching to clean power like solar and wind, and protecting forests can all help. Small choices, such as walking instead of driving, also make a difference when millions of people make them.

Climate change is a serious problem, but it is not too late. With effort and cooperation, we can build a cleaner and safer future.`,
  },
  {
    id: "ar-b1-tea",
    kind: "article",
    level: "B1",
    title: "The Story of Tea",
    topic: "Culture",
    body: `After water, tea is the most popular drink in the world. People in almost every country enjoy it, but few know how old and interesting its story is.

Tea comes from the leaves of a plant called Camellia sinensis. According to legend, it was discovered in ancient China thousands of years ago, when a few leaves accidentally fell into a pot of boiling water. The result was a pleasant, refreshing drink.

For a long time, tea was used mainly in Asia, where it became part of daily life and even of special ceremonies. In Japan, the tea ceremony developed into a beautiful art form, full of careful movements and deep meaning.

Later, traders brought tea to Europe, where it became extremely popular, especially in Britain. The British began drinking tea with milk and sugar, often in the afternoon, and the habit spread around the world.

Today, tea is grown in many countries, including India, China, Sri Lanka, and Kenya. There are many types, such as green, black, and white tea, each with its own taste.

A simple cup of tea, then, carries within it thousands of years of history and the traditions of many different cultures.`,
  },
  {
    id: "ar-b1-bees",
    kind: "article",
    level: "B1",
    title: "Why Bees Matter",
    topic: "Nature",
    body: `Bees are small insects, but they play a huge role in our world. Without them, the food we eat would be very different, and much harder to grow.

The most important job bees do is called pollination. When a bee flies from flower to flower to collect nectar, it also carries tiny grains of pollen on its body. This pollen helps plants produce fruits, vegetables, and seeds. Many of the foods we love, such as apples, strawberries, and almonds, depend on bees.

Scientists estimate that a large part of the crops grown for human food rely on insect pollination, and bees are among the most important pollinators of all.

Sadly, bees are in trouble. In many parts of the world, their numbers are falling. The reasons include the loss of wild flowers, the use of harmful chemicals on farms, and changes in the climate.

The good news is that people can help. Planting flowers, avoiding dangerous chemicals in gardens, and supporting local beekeepers all make a difference.

Bees may be small, but protecting them is one of the most important things we can do for the future of our food.`,
  },

  /* ----------------------------------------------------------------- B2 --- */
  {
    id: "ar-b2-sleep",
    kind: "article",
    level: "B2",
    title: "Why Sleep Matters",
    topic: "Health",
    body: `We spend roughly a third of our lives asleep, yet many people treat sleep as an optional luxury rather than a biological necessity. In a busy world that celebrates being constantly active, going to bed early can even feel like laziness. The science, however, tells a very different story.

Sleep is not simply a period of rest. While we sleep, the brain is remarkably busy. It sorts through the experiences of the day, strengthens important memories, and clears away waste products that build up during waking hours. This is one reason why students who sleep well tend to remember information better than those who stay up all night studying.

The body benefits too. During deep sleep, muscles repair themselves, the immune system grows stronger, and hormones that control hunger and stress are balanced. People who regularly sleep too little face a higher risk of serious health problems, including heart disease and a weakened immune system.

Unfortunately, modern life works against good sleep. Bright screens, late-night work, and endless entertainment all encourage us to stay awake. The blue light from phones can trick the brain into thinking it is still daytime, making it harder to fall asleep.

Experts recommend several simple habits: keeping a regular bedtime, avoiding screens before bed, and creating a dark, quiet room. These changes may seem minor, but their effects can be powerful.

In the end, protecting our sleep is one of the most effective things we can do for our health, our mood, and our ability to think clearly. Far from being wasted time, sleep is an investment in everything we do while awake.`,
  },
  {
    id: "ar-b2-ai",
    kind: "article",
    level: "B2",
    title: "Living Alongside Artificial Intelligence",
    topic: "Technology",
    body: `Not long ago, artificial intelligence belonged mainly to science fiction. Today, it quietly shapes countless aspects of daily life. It recommends the films we watch, filters the emails we receive, and helps doctors read medical scans. As these systems grow more capable, society faces an important question: how should we live alongside machines that can learn?

The benefits are difficult to ignore. AI can process enormous amounts of information far faster than any human. In medicine, it helps detect diseases earlier. In science, it speeds up research that once took years. For ordinary people, it offers convenience, from instant translations to helpful digital assistants.

Yet these advantages come with genuine concerns. As machines take over certain tasks, some jobs may disappear, forcing workers to learn new skills. There are also worries about privacy, since AI systems often rely on huge amounts of personal data. Perhaps most troubling is the risk that important decisions — about loans, jobs, or even justice — could be made by systems that are difficult to understand or question.

Experts argue that the answer is not to fear or reject the technology, but to guide it wisely. This means creating clear rules, demanding transparency about how systems work, and ensuring that humans remain responsible for important choices.

Artificial intelligence is a tool, and like any powerful tool, its value depends on how we use it. Used thoughtfully, it could help solve some of humanity's greatest problems. Used carelessly, it could create new ones. The future will be shaped not by the machines themselves, but by the decisions we make about them today.`,
  },
  {
    id: "ar-b2-memory",
    kind: "article",
    level: "B2",
    title: "How Memory Works",
    topic: "Science",
    body: `Memory feels like a simple thing: we experience something, and later we remember it. In reality, human memory is one of the most complex and surprising abilities of the brain, and it works nothing like a camera or a recording device.

Scientists often describe memory in three stages. First, the brain takes in information from our senses. Next, it stores some of that information, either for a few seconds or for many years. Finally, when we need it, the brain tries to retrieve it. A failure at any of these stages can cause us to forget.

One of the most fascinating discoveries is that memory is not fixed. Every time we recall an event, we slightly rebuild it, and in doing so we can unintentionally change the details. This is why two people can remember the same event very differently, and why eyewitnesses are not always reliable.

Sleep plays a crucial role in forming strong memories. During the night, the brain reviews and organises what we have learned, moving important information into long-term storage. Students who sleep after studying often remember more than those who do not.

There are also ways to improve memory. Repeating information over several days, connecting new ideas to things we already know, and testing ourselves are all proven techniques.

Understanding how memory really works does more than satisfy our curiosity. It helps us learn more effectively and reminds us to be humble about the accuracy of our own recollections.`,
  },
  {
    id: "ar-b2-plastic",
    kind: "article",
    level: "B2",
    title: "The Problem of Plastic",
    topic: "Environment",
    body: `Plastic is one of the most useful materials ever invented. It is cheap, light, strong, and can be shaped into almost anything. Yet these very qualities have created one of the most serious environmental problems of our age.

The trouble is that most plastic does not break down naturally. A plastic bottle thrown away today may still exist hundreds of years from now. Instead of disappearing, it slowly breaks into smaller and smaller pieces called microplastics, which spread through soil, rivers, and oceans.

Every year, millions of tonnes of plastic waste end up in the sea. There, it harms marine life in terrible ways. Sea turtles mistake plastic bags for jellyfish, and seabirds feed plastic to their young. Scientists have even found microplastics in fish, in drinking water, and in the bodies of people.

Part of the difficulty is that we produce far more plastic than we can recycle. Much of what we place in recycling bins is never actually reused, ending up in landfills or being burned.

Solutions do exist. Governments are beginning to ban single-use items such as plastic bags and straws. Companies are designing new materials that break down safely. As individuals, we can refuse unnecessary plastic, reuse what we have, and dispose of waste responsibly.

The age of plastic brought great convenience, but it also left a lasting mark on the planet. Cleaning up that mark is now one of our shared responsibilities.`,
  },

  /* ----------------------------------------------------------------- C1 --- */
  {
    id: "ar-c1-work",
    kind: "article",
    level: "C1",
    title: "The Changing Nature of Work",
    topic: "Society",
    body: `For much of the last century, the idea of work followed a familiar pattern. A person trained for a particular profession, joined an organisation, and remained there for decades, gradually climbing a clearly defined ladder. Retirement marked the end of a single, continuous career. That model, once taken for granted, is now dissolving with remarkable speed.

Several forces are driving this transformation. Automation and artificial intelligence are reshaping which tasks require human attention, rendering some roles obsolete while creating others that did not previously exist. Globalisation has made it possible for teams scattered across continents to collaborate as if they shared an office. Perhaps most significantly, the expectations of workers themselves have shifted, particularly among younger generations who often prioritise flexibility, purpose, and personal growth over lifelong loyalty to a single employer.

The consequences are profound. The notion of a "job for life" has been replaced by the expectation that individuals will change roles, and even entire careers, several times. This demands a new attitude towards learning. Education can no longer be confined to one's youth; instead, the ability to acquire new skills continuously has become essential. The worker of the future is, in effect, a perpetual student.

This freedom carries risks alongside its opportunities. The rise of short-term contracts and freelance arrangements — sometimes called the "gig economy" — offers autonomy but often removes the security and benefits that traditional employment once guaranteed. Without thoughtful policies, the gap between those who thrive in this fluid environment and those who struggle within it may widen dangerously.

How societies respond will matter enormously. Stronger systems of lifelong education, fairer protections for flexible workers, and a cultural willingness to value adaptability could ensure that the changing nature of work becomes a source of opportunity rather than anxiety. The transformation is already underway; the task now is to shape it with wisdom rather than simply endure it.`,
  },
  {
    id: "ar-c1-energy",
    kind: "article",
    level: "C1",
    title: "The Promise and Challenge of Renewable Energy",
    topic: "Environment",
    body: `The transition from fossil fuels to renewable energy is frequently described as the defining challenge of the twenty-first century. The reasoning is compelling: burning coal, oil, and gas releases the greenhouse gases responsible for warming the planet, while sources such as sunlight and wind produce electricity without such emissions. The appeal of clean, virtually limitless power is obvious. The reality, however, is considerably more complex than the simple promise suggests.

Remarkable progress has already been made. The cost of solar panels has fallen dramatically over the past decade, making them, in many regions, the cheapest source of electricity ever recorded. Wind farms, both on land and at sea, now generate substantial proportions of the power supply in numerous countries. What was once dismissed as idealistic is rapidly becoming the economically sensible choice.

Yet significant obstacles remain. The most fundamental is intermittency: the sun does not always shine, and the wind does not always blow. Storing energy efficiently for the moments when generation falls short continues to challenge engineers, even as battery technology steadily improves. Furthermore, the existing electrical grids in many nations were designed for large, centralised power stations, not for thousands of smaller, scattered renewable sources feeding power in unpredictable patterns.

There are social dimensions, too. Communities dependent on coal mining or oil extraction cannot simply be abandoned as these industries decline; managing this transition fairly is both a moral and a political necessity. Meanwhile, building the infrastructure for a renewable future requires enormous quantities of certain minerals, raising fresh questions about supply, ethics, and environmental impact.

None of these challenges is insurmountable, but together they remind us that there is no effortless path to a sustainable future. The shift to renewable energy is not merely a matter of installing new technology; it demands careful planning, substantial investment, and a willingness to confront difficult trade-offs. The promise is genuine — but realising it will require sustained determination rather than optimism alone.`,
  },
  {
    id: "ar-c1-happiness",
    kind: "article",
    level: "C1",
    title: "The Science of Happiness",
    topic: "Psychology",
    body: `Happiness has occupied human thought for thousands of years, but only recently has it become the subject of serious scientific study. The findings of this research challenge many of our deepest assumptions about what actually makes a good life.

Perhaps the most counter-intuitive discovery concerns money. While poverty undeniably causes suffering, the link between wealth and happiness weakens sharply once basic needs are met. Beyond a certain point, additional income produces surprisingly little lasting joy. The reason lies partly in a phenomenon psychologists call "hedonic adaptation": we quickly grow accustomed to new comforts, so the pleasure they bring soon fades, leaving us reaching for the next acquisition.

If possessions matter less than we imagine, what matters more? Research points consistently to the quality of our relationships. People with strong connections to family and friends tend to be markedly happier and even healthier than those who are isolated, regardless of their material circumstances. Loneliness, it turns out, can be as damaging to health as some serious physical conditions.

Other reliable sources of well-being include a sense of purpose, regular acts of kindness, time spent in nature, and the practice of gratitude. Strikingly, helping others often increases our own happiness more than spending on ourselves.

None of this means that happiness can be guaranteed or that difficult emotions should be avoided; sadness and struggle are an inevitable part of a meaningful life. But the science offers a hopeful message. Much of our well-being depends not on luck or wealth, but on choices and habits that lie largely within our own control.`,
  },
  {
    id: "ar-c1-cities",
    kind: "article",
    level: "C1",
    title: "The Age of the City",
    topic: "Society",
    body: `For the first time in human history, more people now live in cities than in the countryside, and the proportion continues to rise. This great migration is reshaping not only landscapes but also economies, cultures, and the very way human beings live together. We have entered, unmistakably, the age of the city.

The appeal of urban life is easy to understand. Cities concentrate opportunity. They offer jobs, education, healthcare, and entertainment on a scale that rural areas rarely can. They are engines of innovation, places where ideas collide and new industries are born. Throughout history, the densest human settlements have produced a disproportionate share of art, science, and commerce.

Yet rapid urbanisation brings formidable challenges. As populations swell, cities struggle to provide adequate housing, clean water, and reliable transport. In many parts of the world, growth has outpaced planning, producing vast informal settlements where millions live without basic services. Pollution, congestion, and inequality often follow close behind.

The environmental dimension is particularly complex. Cities consume the majority of the world's energy and produce most of its carbon emissions. At the same time, dense urban living can be remarkably efficient: people in compact cities tend to use less energy per person than those spread across suburbs, since shorter distances make walking and public transport practical.

The crucial question, then, is not whether humanity will continue to urbanise — that much seems certain — but how. Thoughtfully designed cities, with green spaces, efficient transport, and housing for all, could become models of sustainable living. Neglected ones could deepen poverty and accelerate environmental harm. The future of the planet may well be decided in its cities.`,
  },
];
