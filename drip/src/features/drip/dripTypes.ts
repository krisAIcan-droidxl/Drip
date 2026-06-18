export type DripCategory =
  | 'QUOTE'
  | 'CHALLENGE'
  | 'REFLECTION'
  | 'QUESTION'
  | 'FACT'
  | 'INSIGHT'
  | 'HAPPY'
  | 'GRATEFUL'
  | 'WISE'
  | 'CURIOUS'
  | 'DEEP'
  | 'ACTION';

export interface Drip {
  id: number;
  category: DripCategory;
  text: string;
  author?: string;
}

export interface HistoryEntry {
  entryId: string;
  dripId: number;
  timestamp: number;
}
