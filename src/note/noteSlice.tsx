// store/noteSlice.js
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Note, NoteSliceState } from "../interface/note";

const initialState: NoteSliceState = {
  notes: [],
  previewNote: null,
  loading: true,
  searchNote: [],
  error: null,
  isEditing: false,
  isMobileMenuOpen: false,
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
      state.loading = false;
      state.error = null;
    },
    setPreviewNote: (state, action: PayloadAction<Note | null>) => {
      state.previewNote = action.payload;
      state.loading = false;
      state.error = null;
    },
    setsearchNote: (state, action: PayloadAction<Note[]>) => {
      state.searchNote = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    isEditNote: (state) => {
      state.error = null;
      state.loading = false;
      state.isEditing = true;
      state.isMobileMenuOpen = true;
    },
    isOpenMobileMenu: (state) => {
      state.error = null;
      state.loading = false;
      state.isMobileMenuOpen = true;
    },
    resetNoteStatus: (state) => {
      state.error = null;
      state.loading = false;
      state.isEditing = false;
      state.isMobileMenuOpen = false;
    },
  },
});

export const {
  setNotes,
  setPreviewNote,
  setLoading,
  setsearchNote,
  setError,
  isEditNote,
  resetNoteStatus,
  isOpenMobileMenu
} = noteSlice.actions;

export default noteSlice.reducer;
