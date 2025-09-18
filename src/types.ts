export type ExamplePair = { de: string; ru: string };

export type Examples = {
  present?: ExamplePair[];
  past?: ExamplePair[];
  future?: ExamplePair[];
};

export type ExOrderItem = { words: string[]; solution: string };
export type ExReadingQ = { q: string; options: string[]; solution: string };
export type ExGapItem = { id: number; options: string[]; solution: string };

export type Exercise =
  | { type: 'order';  task: string; content: ExOrderItem[] }
  | { type: 'reading'; task: string; text: string; questions: ExReadingQ[] }
  | { type: 'gap';     task: string; text: string; gaps: ExGapItem[] }
  | { type: 'da_wo';   task: string; sentence: string; solution: string };

export type Card = {
  id: string;
  expression: string;
  case: 'Akk' | 'Dat' | string;
  articles?: { m?: string; f?: string; n?: string };
  translation?: string;
  examples?: Examples;
  exercises: Exercise[];
  vocab?: { de: string; ru: string }[];
};

export type Module = {
  id: string;
  name: string;
  cards: Card[];
};