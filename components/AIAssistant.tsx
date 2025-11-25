import React, { useState } from 'react';
import { Bot, Sparkles, BookOpen, BrainCircuit, X } from 'lucide-react';
import { summarizeContent, generateQuiz, explainConcept, checkApiKey } from '../services/geminiService';

interface AIAssistantProps {
  noteContent: string;
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ noteContent, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'summary' | 'quiz' | 'explain' | null>(null);

  const hasKey = checkApiKey();

  if (!isOpen) return null;

  const handleAction = async (action: 'summary' | 'quiz' | 'explain') => {
    if (!hasKey) {
        setResult("API Key is missing. Please configure process.env.API_KEY.");
        return;
    }
    
    setLoading(true);
    setMode(action);
    setResult(null);
    
    let response = "";
    if (action === 'summary') {
        response = await summarizeContent(noteContent);
    } else if (action === 'quiz') {
        response = await generateQuiz(noteContent);
    } else if (action === 'explain') {
        // For simplicity, we just ask for a general explanation of the key themes in the notes for now
        // In a more advanced version, we could let the user highlight text.
        response = await explainConcept("key concepts", noteContent);
    }
    
    setResult(response);
    setLoading(false);
  };

  return (
    <div className="w-80 border-l border-gray-200 bg-white h-full flex flex-col shadow-xl absolute right-0 top-0 z-20 md:relative">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
        <div className="flex items-center gap-2 text-indigo-700">
          <Bot size={20} />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {!result && !loading && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500 mb-2">What would you like to do with these notes?</p>
            
            <button 
              onClick={() => handleAction('summary')}
              className="flex items-center gap-3 p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors text-indigo-700 text-sm font-medium text-left"
            >
              <div className="p-2 bg-white rounded-md shadow-sm">
                <Sparkles size={16} className="text-indigo-600" />
              </div>
              <div>
                <span className="block">Summarize</span>
                <span className="text-xs text-indigo-400 font-normal">Get a quick overview</span>
              </div>
            </button>

            <button 
              onClick={() => handleAction('quiz')}
              className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors text-amber-800 text-sm font-medium text-left"
            >
               <div className="p-2 bg-white rounded-md shadow-sm">
                <BrainCircuit size={16} className="text-amber-600" />
              </div>
              <div>
                <span className="block">Generate Quiz</span>
                <span className="text-xs text-amber-500 font-normal">Test your knowledge</span>
              </div>
            </button>
            
             <button 
              onClick={() => handleAction('explain')}
              className="flex items-center gap-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-800 text-sm font-medium text-left"
            >
               <div className="p-2 bg-white rounded-md shadow-sm">
                <BookOpen size={16} className="text-emerald-600" />
              </div>
              <div>
                <span className="block">Explain Concepts</span>
                <span className="text-xs text-emerald-500 font-normal">Clarify key topics</span>
              </div>
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 animate-pulse">Thinking...</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in">
             <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {mode === 'summary' ? 'Summary' : mode === 'quiz' ? 'Quiz' : 'Explanation'}
                </span>
                <button 
                    onClick={() => setResult(null)} 
                    className="text-xs text-indigo-600 hover:underline"
                >
                    Clear
                </button>
             </div>
             <div className="prose prose-sm prose-indigo text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <pre className="whitespace-pre-wrap font-sans text-sm">{result}</pre>
             </div>
          </div>
        )}
      </div>
      
      {!hasKey && (
          <div className="p-3 bg-red-50 border-t border-red-100 text-xs text-red-600 text-center">
            AI features unavailable. Missing API Key.
          </div>
      )}
    </div>
  );
};
