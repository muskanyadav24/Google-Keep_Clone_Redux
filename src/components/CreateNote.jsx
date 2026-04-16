import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { Plus, CheckSquare, Image as ImageIcon, Bell, Palette, Archive, MoreVertical, RotateCcw, RotateCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addNote } from '../redux/notesSlice';
import './CreateNote.css';

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

const CreateNote = () => {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState({ title: '', content: '', color: 'transparent', image: null });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (isExpanded) {
          handleClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, note]);

  const handleExpand = () => setIsExpanded(true);

  const handleClose = () => {
    if (note.title || note.content || note.image) {
      dispatch(addNote({
        ...note,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        archived: false,
        trash: false,
      }));
    }
    setNote({ title: '', content: '', color: 'transparent', image: null });
    setIsExpanded(false);
    setShowColorPicker(false);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setNote(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNote(prev => ({ ...prev, image: reader.result }));
        setIsExpanded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setNote(prev => ({ ...prev, image: null }));
  };

  return (
    <div className="create-note-wrapper" ref={containerRef}>
      <motion.div 
        layout
        className={`create-note-container ${isExpanded ? 'expanded' : ''} ${note.color && note.color !== 'transparent' ? 'has-background' : ''}`}
        initial={false}
        style={{ backgroundColor: note.color && note.color !== 'transparent' ? note.color : 'var(--surface-color)' }}
      >
        {note.image && (
          <div className="create-note-image-preview">
            <img src={note.image} alt="Note" />
            <button className="remove-image-btn" onClick={removeImage}>
              <X size={18} />
            </button>
          </div>
        )}

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="note-title-section"
            >
              <input 
                type="text" 
                name="title" 
                placeholder="Title" 
                value={note.title} 
                onChange={handleInput}
                autoComplete="off"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="note-content-section">
          <textarea 
            name="content" 
            placeholder="Take a note..." 
            onClick={handleExpand}
            value={note.content} 
            onChange={handleInput}
            rows={isExpanded ? 3 : 1}
          />
          {!isExpanded && (
            <div className="compact-actions">
              <button className="icon-button" title="New list"><CheckSquare size={20} /></button>
              <button className="icon-button" title="New note with drawing"><Plus size={20} /></button>
              <div className="color-picker-trigger">
                <button 
                  className="icon-button" 
                  title="Background options"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                    setShowColorPicker(true);
                  }}
                >
                  <Palette size={20} />
                </button>
                {showColorPicker && (
                  <div className="color-picker-dropdown">
                    {COLORS.map((c) => (
                      <button 
                        key={c.color} 
                        className={`color-option ${note.color === c.color ? 'active' : ''}`}
                        style={{ backgroundColor: c.color }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setNote(prev => ({ ...prev, color: c.color }));
                          setShowColorPicker(false);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button 
                className="icon-button" 
                title="New note with image" 
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
              >
                <ImageIcon size={20} />
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="expanded-actions"
            >
              <div className="left-actions">
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
                          className={`color-option ${note.color === c.color ? 'active' : ''}`}
                          style={{ backgroundColor: c.color }}
                          title={c.name}
                          onClick={() => {
                            setNote(prev => ({ ...prev, color: c.color }));
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
                <button className="icon-button" title="Archive" onClick={() => {
                  if (note.title || note.content || note.image) {
                    dispatch(addNote({
                      ...note,
                      id: uuidv4(),
                      createdAt: new Date().toISOString(),
                      archived: true,
                      trash: false,
                    }));
                    setNote({ title: '', content: '', color: 'transparent', image: null });
                    setIsExpanded(false);
                  }
                }}><Archive size={18} /></button>
                <button className="icon-button" title="More"><MoreVertical size={18} /></button>
                <button className="icon-button" title="Undo"><RotateCcw size={18} /></button>
                <button className="icon-button" title="Redo"><RotateCw size={18} /></button>
              </div>
              <div className="right-actions">
                <button className="close-btn" onClick={handleClose}>Close</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept="image/*" 
        onChange={handleImageUpload} 
      />
    </div>
  );
};

export default CreateNote;
