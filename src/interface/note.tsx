export interface Note {
  _id?:string;
  title: string;
  description: string; // Fixed typo
  priority: 'low' | 'medium' | 'high';
  progress: 'not-started' | 'in-progress' | 'completed';
  createdAt?:string;
  dueDate: string ;
}

export interface NoteSliceState {
  notes: Note[];
    previewNote: Note | null; // Added preview field
  loading: boolean;
  error: string | null;
  searchNote:Note[];
  isEditing:boolean;
  isMobileMenuOpen:boolean;
}