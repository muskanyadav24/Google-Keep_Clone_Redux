import { createSlice } from '@reduxjs/toolkit';

const loadNotesFromLocalStorage = () => {
  try {
    const activeNotes = JSON.parse(localStorage.getItem('keep-notes') || '[]');
    const trashNotes = JSON.parse(localStorage.getItem('keep-trash-notes') || '[]');
    return [...activeNotes, ...trashNotes];
  } catch (err) {
    console.error('Error loading notes from localStorage:', err);
    return [];
  }
};

const saveToLocalStorage = (items) => {
  const activeNotes = items.filter(note => !note.trash);
  const trashNotes = items.filter(note => note.trash);
  localStorage.setItem('keep-notes', JSON.stringify(activeNotes));
  localStorage.setItem('keep-trash-notes', JSON.stringify(trashNotes));
};

const initialState = {
  items: loadNotesFromLocalStorage(),
  status: 'idle',
  error: null
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action) => {
      state.items.unshift(action.payload);
      saveToLocalStorage(state.items);
    },
    archiveNote: (state, action) => {
      const id = action.payload;
      const note = state.items.find(item => item.id === id);
      if (note) {
        note.archived = !note.archived;
        saveToLocalStorage(state.items);
      }
    },
    deleteNote: (state, action) => {
      const id = action.payload;
      const note = state.items.find(item => item.id === id);
      if (note) {
        note.trash = true;
        saveToLocalStorage(state.items);
      }
    },
    permanentlyDeleteNote: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      saveToLocalStorage(state.items);
    },
    restoreNote: (state, action) => {
      const id = action.payload;
      const note = state.items.find(item => item.id === id);
      if (note) {
        note.trash = false;
        saveToLocalStorage(state.items);
      }
    },
    updateNote: (state, action) => {
      const updatedNote = action.payload;
      const index = state.items.findIndex(item => item.id === updatedNote.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updatedNote };
        saveToLocalStorage(state.items);
      }
    }
  }
});

export const {
  addNote,
  archiveNote,
  deleteNote,
  permanentlyDeleteNote,
  restoreNote,
  updateNote
} = notesSlice.actions;

export default notesSlice.reducer;
