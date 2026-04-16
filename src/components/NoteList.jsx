import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Lightbulb, Archive, Trash2 } from 'lucide-react';
import NoteCard from './NoteCard';
import './Notes.css';

const NoteList = ({ notes, activeTab, onEdit }) => {
  if (notes.length === 0) {
    let icon = <Lightbulb size={120} strokeWidth={1} />;
    let message = "Notes that you add appear here";

    if (activeTab === 'trash') {
      icon = <Trash2 size={120} strokeWidth={1} />;
      message = "No notes in Bin";
    } else if (activeTab === 'archive') {
      icon = <Archive size={120} strokeWidth={1} />;
      message = "Your archived notes appear here";
    }

    return (
      <div className="empty-notes">
        <div className="empty-icon">
          {icon}
        </div>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="notes-container">
      <div className="notes-grid">
        <AnimatePresence>
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NoteList;
