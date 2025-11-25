import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { AIAssistant } from './components/AIAssistant';
import { Subject, Chapter } from './types';
import { loadSubjects, saveSubjects, generateId } from './services/storageService';
import { BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    const data = loadSubjects();
    setSubjects(data);
    if (data.length > 0) {
      setActiveSubjectId(data[0].id);
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (subjects.length > 0) saveSubjects(subjects);
  }, [subjects]);

  const handleCreateSubject = (name: string, color: string) => {
    const newSubject: Subject = {
      id: generateId(),
      name,
      color,
      chapters: []
    };
    setSubjects([...subjects, newSubject]);
    setActiveSubjectId(newSubject.id);
  };

  const handleCreateChapter = (subjectId: string, title: string) => {
    const newChapter: Chapter = {
      id: generateId(),
      title,
      content: '',
      lastUpdated: Date.now()
    };
    
    setSubjects(subjects.map(sub => {
      if (sub.id === subjectId) {
        return { ...sub, chapters: [...sub.chapters, newChapter] };
      }
      return sub;
    }));
    
    setActiveSubjectId(subjectId);
    setActiveChapterId(newChapter.id);
  };

  const handleUpdateNote = (content: string) => {
    if (!activeSubjectId || !activeChapterId) return;

    setSubjects(subjects.map(sub => {
      if (sub.id === activeSubjectId) {
        return {
          ...sub,
          chapters: sub.chapters.map(chap => 
            chap.id === activeChapterId 
              ? { ...chap, content, lastUpdated: Date.now() }
              : chap
          )
        };
      }
      return sub;
    }));
  };

  const handleDeleteSubject = (subjectId: string) => {
    if (window.confirm("Are you sure you want to delete this subject and all its notes?")) {
        const newSubjects = subjects.filter(s => s.id !== subjectId);
        setSubjects(newSubjects);
        if (activeSubjectId === subjectId) {
            setActiveSubjectId(null);
            setActiveChapterId(null);
        }
        saveSubjects(newSubjects); // Force save immediately
    }
  };

  const handleDeleteChapter = (subjectId: string, chapterId: string) => {
      if (window.confirm("Delete this chapter?")) {
        setSubjects(subjects.map(sub => {
            if (sub.id === subjectId) {
                return { ...sub, chapters: sub.chapters.filter(c => c.id !== chapterId) };
            }
            return sub;
        }));
        if (activeChapterId === chapterId) {
            setActiveChapterId(null);
        }
      }
  };

  // Derived state
  const activeSubject = subjects.find(s => s.id === activeSubjectId);
  const activeChapter = activeSubject?.chapters.find(c => c.id === activeChapterId);

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          subjects={subjects}
          activeSubjectId={activeSubjectId}
          activeChapterId={activeChapterId}
          onSelectSubject={setActiveSubjectId}
          onSelectChapter={(sid, cid) => {
            setActiveSubjectId(sid);
            setActiveChapterId(cid);
          }}
          onCreateSubject={handleCreateSubject}
          onCreateChapter={handleCreateChapter}
          onDeleteSubject={handleDeleteSubject}
          onDeleteChapter={handleDeleteChapter}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden transition-all duration-300">
          {activeSubject && activeChapter ? (
            <div className="flex-1 flex relative h-full">
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                 <Editor 
                  chapter={activeChapter} 
                  onSave={handleUpdateNote}
                  onToggleAI={() => setIsAISidebarOpen(!isAISidebarOpen)}
                  isAISidebarOpen={isAISidebarOpen}
                />
              </div>
              
              {/* AI Sidebar (Sliding Panel) */}
              <div className={`transition-all duration-300 ease-in-out border-l border-gray-200 bg-white ${isAISidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
                 <AIAssistant 
                    noteContent={activeChapter.content} 
                    isOpen={isAISidebarOpen}
                    onClose={() => setIsAISidebarOpen(false)}
                 />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                 <BookOpen size={48} className="text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-700 mb-2">Welcome to NoteMind</h1>
              <p className="max-w-md text-center">
                Select a subject from the sidebar or create a new one to get started. 
                Keep your notes organized and use AI to study smarter.
              </p>
            </div>
          )}
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
