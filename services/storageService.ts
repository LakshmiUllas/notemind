import { Subject } from '../types';

const STORAGE_KEY = 'notemind-data-v1';

export const loadSubjects = (): Subject[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load data", error);
    return [];
  }
};

export const saveSubjects = (subjects: Subject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
  } catch (error) {
    console.error("Failed to save data", error);
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const PRESET_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

export const getRandomColor = () => {
  return PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
};
