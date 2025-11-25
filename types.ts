export interface Note {
  id: string;
  content: string;
  lastUpdated: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string; // The main note content for this chapter
  lastUpdated: number;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  chapters: Chapter[];
}

export interface AIResponse {
  text: string;
  type: 'summary' | 'quiz' | 'explanation' | 'chat';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
