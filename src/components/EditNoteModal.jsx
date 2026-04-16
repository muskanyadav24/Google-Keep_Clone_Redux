import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Palette, Image as ImageIcon, Archive, MoreVertical, RotateCcw, RotateCw, X, Trash2 } from 'lucide-react';
import { archiveNote, deleteNote, updateNote } from '../redux/notesSlice';
import './EditNoteModal.css';

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

const EditNoteModal = ({ note, onClose }) => {
  const dispatch = useDispatch();
  const [editedNote, setEditedNote] = useState({ ...note });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleSaveAndClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editedNote]);

  // Sync state if note is updated from the outside (e.g. from the card icon)
  useEffect(() => {
    setEditedNote(prev => ({ 
      ...prev, 
      image: note.image, 
      color: note.color,
      archived: note.archived,
      trash: note.trash
    }));
  }, [note.image, note.color, note.archived, note.trash]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAndClose = () => {
    dispatch(updateNote(editedNote));
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedNote(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArchive = (e) => {
    e.stopPropagation();
    dispatch(archiveNote(note.id));
    onClose();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteNote(note.id));
    onClose();
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setEditedNote(prev => ({ ...prev, image: null }));
  };

  if (!note) return null;

  return (
    <div className="modal-backdrop">
      <motion.div 
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`edit-modal-content ${editedNote.color && editedNote.color !== 'transparent' ? 'has-background' : ''}`}
        style={{ backgroundColor: editedNote.color && editedNote.color !== 'transparent' ? editedNote.color : 'var(--surface-color)' }}
      >
        {editedNote.image && (
          <div className="modal-image-preview">
            <img src={editedNote.image} alt="Note" />
            <button className="remove-image-btn" onClick={removeImage}>
              <X size={18} />
            </button>
          </div>
        )}

        <div className="modal-header">
          <input 
            type="text" 
            name="title" 
            className="modal-title-input"
            placeholder="Title" 
            value={editedNote.title} 
            onChange={handleInput}
            autoComplete="off"
          />
        </div>

        <div className="modal-body">
          <textarea 
            name="content" 
            className="modal-content-textarea"
            placeholder="Note" 
            value={editedNote.content} 
            onChange={handleInput}
            rows={editedNote.image ? 3 : 5}
          />
        </div>

        <div className="modal-date">
          Edited {new Date(note.createdAt).toLocaleDateString()}
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button className="icon-button" title="Remind me"><Bell size={18} /></button>
            <div className="color-picker-trigger">
              <button 
                className="icon-button" 
                title="Background options"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <Palette size={18} />
              </button>
              {showColorPicker && (
                <div className="color-picker-dropdown">
                  {COLORS.map((c) => (
                    <button 
                      key={c.color} 
                      className={`color-option ${editedNote.color === c.color ? 'active' : ''}`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                      onClick={() => {
                        setEditedNote(prev => ({ ...prev, color: c.color }));
                        setShowColorPicker(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <button className="icon-button" title="Add image" onClick={() => fileInputRef.current.click()}>
              <ImageIcon size={18} />
            </button>
            <button className="icon-button" title="Archive" onClick={handleArchive}>
              <Archive size={18} />
            </button>
            <button className="icon-button" title="Delete" onClick={handleDelete}>
              <Trash2 size={18} />
            </button>
            <button className="icon-button" title="More"><MoreVertical size={18} /></button>
            <button className="icon-button" title="Undo"><RotateCcw size={18} /></button>
            <button className="icon-button" title="Redo"><RotateCw size={18} /></button>
          </div>
          <div className="right-actions">
            <button className="close-btn" onClick={handleSaveAndClose}>Update</button>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </motion.div>
    </div>
  );
};

export default EditNoteModal;
