export type ActivityType = 'estudio' | 'lectura' | 'examen' | 'ocio';

export interface Activity { key: ActivityType; label: string; icon: string; color: string; }

export const ACTIVITIES: Activity[] = [
  { key: 'estudio', label: 'Estudio', icon: 'book-outline', color: '#10B981' },
  { key: 'lectura', label: 'Lectura', icon: 'library-outline', color: '#047857' },
  { key: 'examen', label: 'Examen', icon: 'document-text-outline', color: '#9CA3AF' },
  { key: 'ocio', label: 'Ocio', icon: 'game-controller-outline', color: '#111111' },
];

export interface Topic { id: string; name: string; done: boolean; }
export interface Subject { id: string; name: string; topics: Topic[]; }
export interface Session { id: string; type: ActivityType; seconds: number; targetMin: number; date: string; note?: string; subject?: string; topic?: string; }
export interface Profile { name: string; career: string; goalHours: number; photo?: string; }
export interface Note { id: string; text: string; photo?: string; date: string; }
export interface Tip { id: number; title: string; body: string; }
export interface Assignment { id: string; title: string; subject?: string; due: string; done: boolean; } // due = "2026-10-20"
export interface Goal { id: string; subject?: string; hours: number; period: 'dia' | 'semana'; }