// src/pages/character/feature/store/useChecklistValidationStore.ts
import { create } from 'zustand';

interface ChecklistState {
  validationUuid: string | null;
  pendingDescription: string | null;
  isEditMode: boolean;
  editingItemId: string | null;

  // Actions
  setValidationData: (uuid: string | null, description: string | null) => void;
  setEditMode: (isEdit: boolean, itemId?: string | null) => void;
  resetState: () => void;
}

export const useChecklistValidationStore = create<ChecklistState>((set) => ({
  validationUuid: null,
  pendingDescription: null,
  isEditMode: false,
  editingItemId: null,

  // Actions
  setValidationData: (uuid, description) =>
    set({
      validationUuid: uuid,
      pendingDescription: description,
    }),

  setEditMode: (isEdit, itemId = null) =>
    set({
      isEditMode: isEdit,
      editingItemId: itemId,
    }),

  resetState: () =>
    set({
      validationUuid: null,
      pendingDescription: null,
      isEditMode: false,
      editingItemId: null,
    }),
}));
