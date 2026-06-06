// Curated, exam-realistic IELTS Academic Writing prompt banks.
// Task 1 prompts include their data inline so they can be written without an image.

export interface WritingPrompt {
  id: string;
  label: string; // short theme shown in the picker
  type: string; // question/chart type
  prompt: string; // the full task wording
}

const T1_RUBRIC =
  "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.";

export const TASK1_PROMPTS: WritingPrompt[] = [
  { id: "t1-01", label: "Museum visitors", type: "Line graph", prompt: `The line graph shows the number of visitors (in millions) to three museums in London from 2010 to 2020: British Museum 5.8→6.7, Tate Modern 4.7→5.9, Natural History Museum 5.2→4.8. ${T1_RUBRIC}` },
  { id: "t1-02", label: "Food spending", type: "Bar chart", prompt: `The bar chart shows average monthly spending on food (in USD) by households in four countries in 2022: Japan 480, Germany 510, Brazil 320, India 210. ${T1_RUBRIC}` },
  { id: "t1-03", label: "Electricity sources", type: "Pie charts", prompt: `The two pie charts show how electricity was generated in a country in 2000 and 2020. 2000: coal 55%, gas 20%, nuclear 15%, renewables 10%. 2020: coal 25%, gas 25%, nuclear 15%, renewables 35%. ${T1_RUBRIC}` },
  { id: "t1-04", label: "Payment methods", type: "Table", prompt: `The table shows the percentage of people using different payment methods in three age groups (18–29 / 30–49 / 50+): cash 15/30/55, card 45/50/35, mobile app 40/20/10. ${T1_RUBRIC}` },
  { id: "t1-05", label: "Unemployment", type: "Line graph", prompt: `The line graph shows unemployment rates (%) in two regions from 2015 to 2021: Region A 7.2→4.1, Region B 5.0→6.8. ${T1_RUBRIC}` },
  { id: "t1-06", label: "International students", type: "Bar chart", prompt: `The bar chart compares the number of international students (thousands) at four universities in 2012 and 2022: U1 3.2→6.1, U2 4.0→5.2, U3 1.8→4.9, U4 5.1→4.4. ${T1_RUBRIC}` },
  { id: "t1-07", label: "Bottled water process", type: "Process", prompt: `The diagram shows the process of producing bottled drinking water. Stages: water collection → filtration → purification → bottling → labelling → packaging → distribution to shops. Summarise the information by describing the stages of the process. Write at least 150 words.` },
  { id: "t1-08", label: "Town centre changes", type: "Maps", prompt: `The two maps show a town centre in 1990 and today. In 1990 there was an open-air market and a small car park. Today the market has been replaced by a shopping mall, the car park has been extended, and a pedestrian zone and a bus station have been added. Summarise the changes. Write at least 150 words.` },
  { id: "t1-09", label: "Household water use", type: "Pie chart", prompt: `The pie chart shows how households in a city use water: bathroom 35%, toilet 25%, kitchen 15%, laundry 15%, garden 10%. ${T1_RUBRIC}` },
  { id: "t1-10", label: "City temperatures", type: "Line graph", prompt: `The line graph shows average monthly temperature (°C) across the year in three cities. City A ranges from 2 (Jan) to 24 (Jul); City B from 15 to 31; City C from −5 to 18. ${T1_RUBRIC}` },
  { id: "t1-11", label: "Cinema by genre", type: "Table", prompt: `The table shows cinema tickets sold (millions) in a country by genre in 2010 and 2020: action 45→62, comedy 38→29, drama 22→25, animation 18→34. ${T1_RUBRIC}` },
  { id: "t1-12", label: "Regular exercise", type: "Bar chart", prompt: `The bar chart shows the percentage of adults who exercise regularly in five countries: A 65%, B 48%, C 72%, D 35%, E 55%. ${T1_RUBRIC}` },
  { id: "t1-13", label: "Butterfly life cycle", type: "Process", prompt: `The diagram shows the life cycle of a butterfly. Stages: egg → larva (caterpillar) → pupa (chrysalis) → adult butterfly, which then lays eggs again. Summarise the information by describing the stages of the process. Write at least 150 words.` },
  { id: "t1-14", label: "Mobile subscriptions", type: "Line graph", prompt: `The line graph shows mobile phone subscriptions per 100 people in two countries from 2000 to 2020: Country X 20→130, Country Y 10→95. ${T1_RUBRIC}` },
  { id: "t1-15", label: "House prices", type: "Table", prompt: `The table compares average house prices (thousands USD) in four cities in 2015 and 2023: City1 320→520, City2 210→260, City3 450→610, City4 180→175. ${T1_RUBRIC}` },
  { id: "t1-16", label: "Holiday choice", type: "Bar chart", prompt: `The bar chart shows the main reasons people gave for choosing a holiday destination (% of respondents): cost 40, weather 25, culture 20, family 10, other 5. ${T1_RUBRIC}` },
  { id: "t1-17", label: "Island resort", type: "Maps", prompt: `The two maps show an island before and after the construction of a tourist resort. After construction a hotel, a restaurant, a pier and footpaths were added, while the beach and the forest were kept. Summarise the changes. Write at least 150 words.` },
  { id: "t1-18", label: "Recycling", type: "Line graph", prompt: `The line graph shows waste recycled (kg per person per year) in three cities from 2005 to 2020: City A 80→260, City B 120→200, City C 60→310. ${T1_RUBRIC}` },
  { id: "t1-19", label: "Home energy", type: "Pie charts", prompt: `The two pie charts compare energy use in an average home in summer and winter. Summer: cooling 40%, water heating 20%, appliances 25%, lighting 15%. Winter: heating 50%, water heating 20%, appliances 20%, lighting 10%. ${T1_RUBRIC}` },
  { id: "t1-20", label: "Leisure hours", type: "Table", prompt: `The table shows hours per week spent on leisure activities by age group (18–25 / 26–40 / 41+): TV 14/10/18, internet 22/12/6, sport 5/7/3, reading 3/6/9. ${T1_RUBRIC}` },
  { id: "t1-21", label: "Coffee production", type: "Process", prompt: `The diagram shows how coffee is produced. Stages: picking the beans → drying → roasting → grinding → packaging → shipping to shops. Summarise the information by describing the stages of the process. Write at least 150 words.` },
  { id: "t1-22", label: "Water consumption", type: "Bar chart", prompt: `The bar chart shows average daily water consumption per person (litres) in six countries: A 350, B 280, C 150, D 95, E 410, F 200. ${T1_RUBRIC}` },
  { id: "t1-23", label: "Internet access", type: "Line graph", prompt: `The line graph shows the percentage of households with internet access in a country from 2000 to 2020, rising from 12% to 92%, with the fastest growth between 2005 and 2012. ${T1_RUBRIC}` },
  { id: "t1-24", label: "Subject enrolment", type: "Table", prompt: `The table shows students enrolled in four subjects at a university over three years: Business 420/480/560, Engineering 360/350/400, Arts 300/270/240, IT 220/340/520. ${T1_RUBRIC}` },
  { id: "t1-25", label: "Supermarket site", type: "Maps", prompt: `The map shows two possible locations (A and B) for a new supermarket. Location A is near the town centre and the train station; Location B is on the edge of town, beside a housing estate and a main road. Summarise the key features of each location and how they differ. Write at least 150 words.` },
  { id: "t1-26", label: "Workforce sectors", type: "Pie chart", prompt: `The pie chart shows the proportion of a country's workforce employed in different sectors: services 55%, industry 25%, agriculture 12%, other 8%. ${T1_RUBRIC}` },
  { id: "t1-27", label: "Car sales by fuel", type: "Line graph", prompt: `The line graph shows car sales (thousands) for three fuel types from 2010 to 2022: petrol 800→520, diesel 600→210, electric 20→430. ${T1_RUBRIC}` },
  { id: "t1-28", label: "Gender in professions", type: "Bar chart", prompt: `The bar chart compares the percentage of men and women in five professions: teaching M30/W70, engineering M85/W15, medicine M55/W45, law M60/W40, nursing M10/W90. ${T1_RUBRIC}` },
  { id: "t1-29", label: "Water cycle", type: "Process", prompt: `The diagram shows the natural water cycle. Stages: evaporation from the sea → condensation into clouds → precipitation (rain) over land → collection in rivers and lakes, which flow back to the sea. Summarise the information by describing the stages of the process. Write at least 150 words.` },
  { id: "t1-30", label: "Internet speed", type: "Table", prompt: `The table shows average internet speeds (Mbps) in five countries in 2015 and 2023: A 25→120, B 15→90, C 40→210, D 8→55, E 30→150. ${T1_RUBRIC}` },
];

const T2_RUBRIC = "Give reasons for your answer and include relevant examples. Write at least 250 words.";

export const TASK2_PROMPTS: WritingPrompt[] = [
  { id: "t2-01", label: "School starting age", type: "Discuss both views", prompt: `Some people believe children should start school at a very early age, while others think they should not start formal education until they are older. Discuss both views and give your own opinion. ${T2_RUBRIC}` },
  { id: "t2-02", label: "Machines & tasks", type: "Advantage/Disadvantage", prompt: `Many everyday tasks are now done by machines and computers. Do the advantages of this development outweigh the disadvantages? ${T2_RUBRIC}` },
  { id: "t2-03", label: "Protecting environment", type: "Agree/Disagree", prompt: `Some people say that individuals can do little to protect the environment, and that only governments and large companies can make a real difference. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-04", label: "Working from home", type: "Advantage/Disadvantage", prompt: `An increasing number of people now work from home rather than in an office. Do the benefits of this trend outweigh the drawbacks? ${T2_RUBRIC}` },
  { id: "t2-05", label: "Prevention vs cure", type: "Agree/Disagree", prompt: `Governments should spend more money on preventing illness than on treatment and cures. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-06", label: "Move to cities", type: "Problem/Solution", prompt: `As countries develop, more and more people move to cities for work. What problems does this cause, and what solutions can you suggest? ${T2_RUBRIC}` },
  { id: "t2-07", label: "Prison vs education", type: "Discuss both views", prompt: `Some believe that long prison sentences are the best way to reduce crime, while others think education is more effective. Discuss both views and give your own opinion. ${T2_RUBRIC}` },
  { id: "t2-08", label: "Celebrity news", type: "Agree/Disagree", prompt: `The news media pay too much attention to celebrities and not enough to serious issues. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-09", label: "Both parents working", type: "Cause/Effect", prompt: `In many families today, both parents work full time. What are the effects of this on children and on family life? ${T2_RUBRIC}` },
  { id: "t2-10", label: "Tech & relationships", type: "Positive/Negative", prompt: `Mobile phones and the internet have changed the way people build and maintain relationships. Do you think this is a positive or a negative development? ${T2_RUBRIC}` },
  { id: "t2-11", label: "Free university", type: "Discuss both views", prompt: `Some people think university education should be free for everyone, while others believe students should pay for it. Discuss both views and give your own opinion. ${T2_RUBRIC}` },
  { id: "t2-12", label: "Throwaway culture", type: "Problem/Solution", prompt: `Many people throw away usable items instead of repairing them. Why does this happen, and what can be done about it? ${T2_RUBRIC}` },
  { id: "t2-13", label: "Fast food", type: "Agree/Disagree", prompt: `Fast food is increasingly popular, and some say it is harming our health and traditional eating habits. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-14", label: "Changing jobs often", type: "Positive/Negative", prompt: `Many young people now change jobs frequently rather than staying with one employer for life. What are the causes, and is this a positive or negative trend? ${T2_RUBRIC}` },
  { id: "t2-15", label: "Space exploration", type: "Discuss both views", prompt: `Some governments spend large amounts of money on space exploration. Some people think this is a good investment, while others believe the money should be spent on more urgent needs. Discuss both views and give your own opinion. ${T2_RUBRIC}` },
  { id: "t2-16", label: "International tourism", type: "Advantage/Disadvantage", prompt: `International tourism has brought economic benefits to many countries but has also damaged local cultures and the environment. Do the advantages outweigh the disadvantages? ${T2_RUBRIC}` },
  { id: "t2-17", label: "Exams vs assessment", type: "Agree/Disagree", prompt: `Some people believe that exams are an unfair way to test students and should be replaced by continuous assessment. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-18", label: "Rich–poor gap", type: "Problem/Solution", prompt: `In many countries the gap between rich and poor is widening. What problems does this cause, and what can be done to reduce it? ${T2_RUBRIC}` },
  { id: "t2-19", label: "Dying languages", type: "Discuss both views", prompt: `Every year a number of languages disappear. Some people think this does not matter, while others believe we should try to protect them. Discuss both views and give your own opinion. ${T2_RUBRIC}` },
  { id: "t2-20", label: "Children & screens", type: "Positive/Negative", prompt: `Children spend more and more time using screens for entertainment. Do you think this is a positive or a negative development? ${T2_RUBRIC}` },
  { id: "t2-21", label: "Robots & jobs", type: "Advantage/Disadvantage", prompt: `Some people fear that robots and artificial intelligence will replace many human jobs in the future. Do the benefits of this technology outweigh the risks? ${T2_RUBRIC}` },
  { id: "t2-22", label: "Advertising", type: "Agree/Disagree", prompt: `Advertising encourages people to buy things they do not really need. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-23", label: "Ban cars in cities", type: "Agree/Disagree", prompt: `In order to reduce pollution, some people argue that private cars should be banned from city centres. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-24", label: "Practical skills", type: "Agree/Disagree", prompt: `Some people think it is more important for schoolchildren to learn practical skills such as cooking and managing money than traditional academic subjects. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-25", label: "Sugar tax", type: "Problem/Solution", prompt: `Some countries have introduced taxes on sugary drinks to improve public health. Is this an effective solution, and what other measures could help? ${T2_RUBRIC}` },
  { id: "t2-26", label: "Ageing population", type: "Problem/Solution", prompt: `In many countries people are living much longer than before. What problems does an ageing population cause, and how can these problems be addressed? ${T2_RUBRIC}` },
  { id: "t2-27", label: "Traditional vs modern fun", type: "Positive/Negative", prompt: `Older people tend to prefer traditional leisure activities, while younger people prefer modern forms of entertainment. Why might this be, and is it a positive or negative trend? ${T2_RUBRIC}` },
  { id: "t2-28", label: "Gap year", type: "Advantage/Disadvantage", prompt: `Some students take a year off between finishing school and starting university in order to work or travel. Do the advantages of this outweigh the disadvantages? ${T2_RUBRIC}` },
  { id: "t2-29", label: "Free public transport", type: "Agree/Disagree", prompt: `Some people think governments should make public transport free in order to reduce traffic and pollution. To what extent do you agree or disagree? ${T2_RUBRIC}` },
  { id: "t2-30", label: "Less free time", type: "Two-part question", prompt: `Many people today feel they have less free time than people had in the past. Why might this be the case, and what can people do to have more free time? ${T2_RUBRIC}` },
];

export function randomPrompt(task: "task1" | "task2"): WritingPrompt {
  const arr = task === "task1" ? TASK1_PROMPTS : TASK2_PROMPTS;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function promptsFor(task: "task1" | "task2"): WritingPrompt[] {
  return task === "task1" ? TASK1_PROMPTS : TASK2_PROMPTS;
}
