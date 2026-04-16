import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Bell, Palette, Image as ImageIcon, Archive, MoreVertical, CheckCircle, Trash2, RotateCcw, Trash, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { archiveNote, deleteNote, restoreNote, permanentlyDeleteNote, updateNote } from '../redux/notesSlice';
import './Notes.css';

const COLORS = [
  { name: 'Default', color: 'transparent' },
  { name: 'Red', color: '#f28b82' },
  { name: 'Orange', color: '#fbbc04' },
  { name: 'Yellow', color: '#fff475' },
  { name: 'Green', color: '#ccff90' },
  { name: 'Teal', color: '#a7ffeb' },
  { name: 'Blue', color: '#cbf0f8' },
  { name: 'Dark blue', color: '#aecbfa' },
  { name: 'Purple', color: '#d7aefb' },
  { name: 'Pink', color: '#fdcfe8' },
  { name: 'Brown', color: '#e6c9a8' },
  { name: 'Gray', color: '#e8eaed' },
];

const NoteCard = ({ note, onEdit }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleCardClick = () => {
    if (!note.trash && onEdit) {
      onEdit(note);
    }
  };

  const handleColorChange = (color) => {
    dispatch(updateNote({ id: note.id, color }));
    setShowColorPicker(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateNote({ id: note.id, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    dispatch(updateNote({ id: note.id, image: null }));
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`note-card ${isHovered ? 'hovered' : ''} ${note.color && note.color !== 'transparent' ? 'has-background' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowColorPicker(false);
      }}
      onClick={handleCardClick}
      style={{ 
        backgroundColor: note.color && note.color !== 'transparent' ? note.color : 'var(--surface-color)', 
        cursor: !note.trash ? 'pointer' : 'default',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)'
      }}
    >
      {note.image && (
        <div className="note-card-image">
          <img src={note.image} alt="Note" />
          <button className="remove-image-btn" onClick={handleRemoveImage}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="note-card-content">
        <div className="note-select-check">
          <CheckCircle size={20} />
        </div>

        {note.title && <h3 className="note-title">{note.title}</h3>}
        <p className="note-content">{note.content}</p>
      </div>

      <div 
        className={`note-actions ${isHovered || showColorPicker ? 'visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {note.trash ? (
          <>
            <button 
              className="icon-button" 
              title="Delete forever"
              onClick={(e) => { e.stopPropagation(); dispatch(permanentlyDeleteNote(note.id)); }}
            ><Trash size={16} /></button>
            <button 
              className="icon-button" 
              title="Restore"
              onClick={(e) => { e.stopPropagation(); dispatch(restoreNote(note.id)); }}
            ><RotateCcw size={16} /></button>
          </>
        ) : (
          <>
            <button className="icon-button" title="Remind me" onClick={(e) => e.stopPropagation()}><Bell size={16} /></button>
            <div className="color-picker-trigger">
              <button 
                className="icon-button" 
                title="Background options"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
              >
                <Palette size={16} />
              </button>
              {showColorPicker && (
                <div className="color-picker-dropdown">
                  {COLORS.map((c) => (
                    <button 
                      key={c.color} 
                      className={`color-option ${note.color === c.color ? 'active' : ''}`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorChange(c.color);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <button 
              className="icon-button" 
              title="Add image" 
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
            >
              <ImageIcon size={16} />
            </button>
            <button 
              className="icon-button" 
              title={note.archived ? "Unarchive" : "Archive"}
              onClick={(e) => { e.stopPropagation(); dispatch(archiveNote(note.id)); }}
            ><Archive size={16} /></button>
            <button 
              className="icon-button" 
              title="Delete"
              onClick={(e) => { e.stopPropagation(); dispatch(deleteNote(note.id)); }}
            ><Trash2 size={16} /></button>
            <button className="icon-button" title="More" onClick={(e) => e.stopPropagation()}><MoreVertical size={16} /></button>
          </>
        )}
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleImageUpload} 
      />
    </motion.div>
  );
};

export default NoteCard;
