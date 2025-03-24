export interface ChecklistPanel {
  checklistId: string;
  title: string; //없음
  description: string;
  exp: number;
  isComplete: boolean;
}

export interface ChecklistPanelProps {
  items: Array<{
    checklistId: string;
    title: string; //없음
    description: string;
    exp: number;
    isComplete: boolean;
  }>;
  isEditable?: boolean; // 수정/삭제 가능 여부
  onAddItem?: (newItem: ChecklistPanel) => void;
  onCompleteItem?: (checklistId: string) => void;
  onEditItem?: (checklistId: string, newTitle: string) => void;
  onDeleteItem?: (checklistId: string) => void;
}
