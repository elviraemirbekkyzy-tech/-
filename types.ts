export enum GameMode {
  SIMPLIFY = 'SIMPLIFY', // Жөнөкөйлөтүү
  FIND_X = 'FIND_X',     // X-ти табуу
  WORD_PROBLEM = 'WORD_PROBLEM', // Маселелер
  MIXED = 'MIXED'        // Аралаш
}

export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Question {
  id: string;
  text: string; // The question text (in Kyrgyz)
  options: string[]; // Multiple choice options
  correctAnswer: string;
  explanation: string; // Explanation in Kyrgyz
  type: GameMode;
}

export interface UserStats {
  score: number;
  highScore: number;
  streak: number;
  correctAnswers: number;
  totalQuestions: number;
}