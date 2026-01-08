import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GameMode, Difficulty, Question } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-2.5-flash";

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The question text in Kyrgyz language." },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "4 unique possible answers. Must include the correct answer and 3 plausible distractors based on common mistakes."
          },
          correctAnswer: { type: Type.STRING, description: "The exact string from the options array that is correct." },
          explanation: { type: Type.STRING, description: "Short explanation of the solution in Kyrgyz." },
          type: { type: Type.STRING, description: "The type of question generated (SIMPLIFY, FIND_X, or WORD_PROBLEM)" }
        },
        required: ["text", "options", "correctAnswer", "explanation", "type"]
      }
    }
  },
  required: ["questions"]
};

// Fisher-Yates shuffle algorithm to randomize option positions effectively
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const generateQuestions = async (mode: GameMode, difficulty: Difficulty, count: number = 3): Promise<Question[]> => {
  const baseInstruction = `
    Сен Кыргызстандагы мектеп окуучулары үчүн математика мугалимисиң.
    Катыштар (Ratios) жана пропорциялар боюнча ${count} уникалдуу суроо түз.
    Тил: Кыргыз тили.
    Кыйынчылык: ${difficulty}.

    МААНИЛҮҮ ШАРТТАР:
    1. Варианттар (options) ар түрдүү болсун. Бир эле жооп кайталанбасын.
    2. Туура эмес варианттар "акылдуу" болсун (мисалы, окуучу катышты тескери алганда чыга турган сан, же сандарды кошуп алгандагы каталар).
    3. Жооптордун форматы суроого жараша болсун (мис: "2:3", "15", "40%").
    4. Ар бир суроодо сөзсүз 4 вариант болсун.
  `;

  let prompt = "";
  switch (mode) {
    case GameMode.SIMPLIFY:
      prompt = `${baseInstruction} Тема: Катыштарды жөнөкөйлөтүү. Мисалы: "12:18 катышын жөнөкөйлөткүлө".`;
      break;
    case GameMode.FIND_X:
      prompt = `${baseInstruction} Тема: Пропорциянын белгисиз мүчөсүн табуу. Мисалы: "5:x = 10:20".`;
      break;
    case GameMode.WORD_PROBLEM:
      prompt = `${baseInstruction} Тема: Катыштарга турмуштук маселелер. Кыргызча ысымдарды колдон (Айбек, Каныкей).`;
      break;
    case GameMode.MIXED:
      prompt = `${baseInstruction} Темалар аралаш болсун.`;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      
      return data.questions.map((q: any, index: number) => {
        // Ensure correct answer is in the options and they are unique
        let optionsSet = new Set<string>(q.options);
        optionsSet.add(q.correctAnswer);
        
        // If for some reason we have fewer than 4 options, we keep it as is or handle it
        let finalOptions = Array.from(optionsSet);
        
        // Shuffle the final list to ensure the correct answer isn't always at the same spot
        return {
          id: `${Date.now()}-${index}`,
          text: q.text,
          options: shuffleArray(finalOptions),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          type: mode === GameMode.MIXED ? (q.type || GameMode.WORD_PROBLEM) : mode
        };
      });
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Error generating questions:", error);
    return [
      {
        id: "fallback-1",
        text: "Катышты жөнөкөйлөткүлө: 10:15",
        options: shuffleArray(["2:3", "3:2", "1:2", "5:3"]),
        correctAnswer: "2:3",
        explanation: "Эки санды тең 5ке бөлөбүз: 10/5=2, 15/5=3. Жообу 2:3.",
        type: GameMode.SIMPLIFY
      }
    ];
  }
};