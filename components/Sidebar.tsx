import React, { useState } from 'react';
import { Subject, Chapter } from '../types';
import { Plus, Folder, FileText, ChevronRight, ChevronDown, Book, Trash2 } from 'lucide-react';
import { Modal } from './Modal';
import { getRandomColor } from '../services/storageService';

interface SidebarProps {
  subjects: Subject[];
  activeSubjectId: string | null;
  activeChapterId: string | null;
  onSelectSubject: (id: string) => void;
  onSelectChapter: (subjectId: string, chapterId: string) => void;
  onCreateSubject: (name: string, color: string) => void;
  onCreateChapter: (subjectId: string, title: string) => void;
  onDeleteSubject: (subjectId: string) => void;
  onDeleteChapter: (subjectId: string, chapterId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  subjects,
  activeSubjectId,
  activeChapterId,
  onSelectSubject,
  onSelectChapter,
  onCreateSubject,
  onCreateChapter,
  onDeleteSubject,
  onDeleteChapter
}) => {
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [targetSubjectForChapter, setTargetSubjectForChapter] = useState<string | null>(null);

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      onCreateSubject(newSubjectName.trim(), getRandomColor());
      setNewSubjectName('');
      setIsSubjectModalOpen(false);
    }
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterTitle.trim() && targetSubjectForChapter) {
      onCreateChapter(targetSubjectForChapter, newChapterTitle.trim());
      setNewChapterTitle('');
      setIsChapterModalOpen(false);
    }
  };

  const openChapterModal = (e: React.MouseEvent, subjectId: string) => {
    e.stopPropagation();
    setTargetSubjectForChapter(subjectId);
    setIsChapterModalOpen(true);
  };

  return (
    <div className="w-72 bg-gray-900 text-gray-300 flex flex-col h-full border-r border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Book size={18} className="text-white" />
          </div>
          NoteMind
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          <span>Subjects</span>
          <button 
            onClick={() => setIsSubjectModalOpen(true)}
            className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-400 hover:text-white"
            title="Add Subject"
          >
            <Plus size={14} />
          </button>
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-8 text-gray-600 text-sm">
            No subjects yet.<br/>Click + to add one.
          </div>
        )}

        {subjects.map(subject => {
          const isActive = activeSubjectId === subject.id;
          return (
            <div key={subject.id} className="mb-2">
              <div 
                onClick={() => onSelectSubject(subject.id)}
                className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800/50'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className={`w-2 h-8 rounded-full ${subject.color}`}></div>
                   <span className="truncate font-medium">{subject.name}</span>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteSubject(subject.id); }}
                        className="p-1.5 hover:bg-red-900/50 hover:text-red-400 rounded mr-1"
                        title="Delete Subject"
                      >
                        <Trash2 size={12} />
                      </button>
                    <button 
                        onClick={(e) => openChapterModal(e, subject.id)}
                        className="p-1.5 hover:bg-gray-700 rounded"
                        title="Add Chapter"
                    >
                        <Plus size={14} />
                    </button>
                    {isActive ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
              </div>

              {isActive && (
                <div className="ml-4 mt-1 pl-4 border-l border-gray-800 space-y-1">
                  {subject.chapters.length === 0 && (
                      <p className="text-xs text-gray-600 py-2 italic pl-2">No chapters yet</p>
                  )}
                  {subject.chapters.map(chapter => (
                    <div 
                      key={chapter.id}
                      onClick={(e) => { e.stopPropagation(); onSelectChapter(subject.id, chapter.id); }}
                      className={`group flex items-center justify-between p-2 rounded-md text-sm cursor-pointer ${activeChapterId === chapter.id ? 'bg-indigo-900/30 text-indigo-300' : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'}`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={14} />
                        <span className="truncate">{chapter.title}</span>
                      </div>
                       <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteChapter(subject.id, chapter.id); }}
                        className="p-1 hover:bg-red-900/30 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Chapter"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800 text-xs text-gray-600 text-center">
        NoteMind v1.0 • Local Storage
      </div>

      {/* Subject Modal */}
      <Modal 
        isOpen={isSubjectModalOpen} 
        onClose={() => setIsSubjectModalOpen(false)} 
        title="Create New Subject"
      >
        <form onSubmit={handleCreateSubject} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
            <input 
              autoFocus
              type="text" 
              value={newSubjectName} 
              onChange={(e) => setNewSubjectName(e.target.value)} 
              placeholder="e.g. Mathematics, History"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={!newSubjectName.trim()}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            Create Subject
          </button>
        </form>
      </Modal>

      {/* Chapter Modal */}
      <Modal 
        isOpen={isChapterModalOpen} 
        onClose={() => setIsChapterModalOpen(false)} 
        title="Create New Chapter"
      >
        <form onSubmit={handleCreateChapter} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Title</label>
            <input 
              autoFocus
              type="text" 
              value={newChapterTitle} 
              onChange={(e) => setNewChapterTitle(e.target.value)} 
              placeholder="e.g. Algebra Basics, The French Revolution"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={!newChapterTitle.trim()}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-medium"
          >
            Create Chapter
          </button>
        </form>
      </Modal>
    </div>
  );
};
