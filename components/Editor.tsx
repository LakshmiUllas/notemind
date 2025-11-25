import React, { useState, useEffect } from 'react';
import { Save, Clock, Bot } from 'lucide-react';
import { Chapter } from '../types';

interface EditorProps {
  chapter: Chapter;
  onSave: (content: string) => void;
  onToggleAI: () => void;
  isAISidebarOpen: boolean;
}

export const Editor: React.FC<EditorProps> = ({ chapter, onSave, onToggleAI, isAISidebarOpen }) => {
  const [content, setContent] = useState(chapter.content);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    setContent(chapter.content);
  }, [chapter.id]); // Update content only when chapter ID changes

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    if (content !== chapter.content) {
      onSave(content);
      setLastSaved(new Date());
    }
  };

  // Auto-save effect debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== chapter.content) {
        onSave(content);
        setLastSaved(new Date());
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [content, chapter.content, onSave]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{chapter.title}</h2>
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <Clock size={12} />
            <span>
              {lastSaved 
                ? `Saved ${lastSaved.toLocaleTimeString()}` 
                : "All changes saved"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={onToggleAI}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isAISidebarOpen 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
                <Bot size={16} />
                AI Tools
            </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full h-full p-8 resize-none focus:outline-none text-gray-700 leading-relaxed text-lg placeholder-gray-300 font-sans"
          placeholder="Start typing your notes here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};
