export interface ChecklistPanel {
  checklistId: string;
  title: string; //없음
  description: string;
  exp: number;
  is_complete: boolean;
}

export interface ChecklistPanelProps {
  items: Array<{
    checklistId: string;
    title: string; //없음
    description: string;
    exp: number;
    is_complete: boolean;
  }>;
  isEditable?: boolean; // 수정/삭제 가능 여부
  onAddItem?: (newItem) => void;
  onCompleteItem?: (checklistId: string) => void;
  onEditItem?: (checklistId: string, newTitle: string) => void;
  onDeleteItem?: (checklistId: string) => void;
}
