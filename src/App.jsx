import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addNote } from './redux/notesSlice';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreateNote from './components/CreateNote';
import NoteList from './components/NoteList';
import EditNoteModal from './components/EditNoteModal';
import { AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');
  const [editingNote, setEditingNote] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('keep-theme') || 'light');
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.items);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('keep-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handlePaste = (event) => {
      const items = (event.clipboardData || event.originalEvent.clipboardData).items;
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          const reader = new FileReader();
          reader.onload = (e) => {
            const newNote = {
              id: Date.now().toString(),
              title: '',
              content: '',
              color: 'transparent',
              image: e.target.result,
              archived: false,
              trash: false,
              createdAt: new Date().toISOString()
            };
            dispatch(addNote(newNote));
          };
          reader.readAsDataURL(file);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [dispatch]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const filteredNotes = notes.filter(note => {
    if (activeTab === 'archive') return note.archived && !note.trash;
    if (activeTab === 'trash') return note.trash;
    if (activeTab === 'notes') return !note.archived && !note.trash;
    return true;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
  };

  const closeEditModal = () => {
    setEditingNote(null);
  };

  return (
    <div className="app">
      <Header 
        onMenuToggle={toggleSidebar} 
        currentTheme={theme} 
        onThemeToggle={toggleTheme} 
      />
      <div className="app-body">
        <Sidebar 
          isOpen={isSidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={`app-content ${isSidebarOpen ? 'shifted' : 'compact'}`}>
          {activeTab === 'notes' && <CreateNote />}
          <NoteList 
            notes={filteredNotes} 
            activeTab={activeTab} 
            onEdit={handleEdit}
          />
        </main>
      </div>

      <AnimatePresence>
        {editingNote && (
          <EditNoteModal 
            note={editingNote} 
            onClose={closeEditModal} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
