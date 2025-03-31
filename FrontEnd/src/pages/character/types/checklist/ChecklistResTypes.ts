export interface ChecklistResTypes<T> {
  checklistId: T; //number & string 변경 여부
  description: string;
  difficulty?: string; //난이도
  ecoType?: string;
  exp: number;
  isComplete: boolean;
}
