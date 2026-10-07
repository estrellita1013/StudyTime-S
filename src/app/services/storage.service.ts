import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Assignment, Goal, Note, Profile, Session, Subject } from '../models/models';
import { UiService } from './ui.services';

@Injectable({ providedIn: 'root' })
export class StorageService {
   private store = new Storage({ name: 'studytime_db' });
  private ready = this.store.create(); // abre la base local una sola vez
  private ui = inject(UiService);

  async get<T>(key: string, fallback: T): Promise<T> {
    await this.ready;
    const value = (await this.store.get(key)) ?? fallback;
    this.ui.refresh();
    return value;
  }
  async set(key: string, value: unknown) {
    await this.ready;
    await this.store.set(key, value);
    this.ui.refresh();
  }

  // ---- Sesiones ----
  getSessions() { return this.get<Session[]>('sessions', []); }
  async addSession(s: Session) { const all = await this.getSessions(); await this.set('sessions', [s, ...all]); }
  async updateSession(s: Session) { const all = await this.getSessions(); await this.set('sessions', all.map(x => x.id === s.id ? s : x)); }
  async deleteSession(id: string) { const all = await this.getSessions(); await this.set('sessions', all.filter(x => x.id !== id)); }
  // Segundos estudiados desde una fecha (y, si se indica, solo de una materia)
  async secondsSince(from: Date, subject?: string) {
    const all = await this.getSessions();
    return all.filter(s => new Date(s.date) >= from && (!subject || s.subject === subject)).reduce((n, s) => n + s.seconds, 0);
  }

  // ---- Perfil ----
  getProfile() { return this.get<Profile>('profile', { name: 'Estudiante', career: '', goalHours: 4 }); }
  saveProfile(p: Profile) { return this.set('profile', p); }

  // ---- Notas ----
  getNotes() { return this.get<Note[]>('notes', []); }
  async addNote(n: Note) { const all = await this.getNotes(); await this.set('notes', [n, ...all]); }
  async deleteNote(id: string) { const all = await this.getNotes(); await this.set('notes', all.filter(x => x.id !== id)); }

  // ---- Materias (cada materia guarda sus temas) ----
  async getSubjects() {
    const all = await this.get<Subject[]>('subjects', []);
    return all.map(s => ({ ...s, topics: s.topics ?? [] })); // por si hay materias guardadas sin temas
  }
  async addSubject(name: string) { const all = await this.getSubjects(); await this.set('subjects', [...all, { id: Date.now().toString(), name, topics: [] }]); }
  async updateSubject(s: Subject) { const all = await this.getSubjects(); await this.set('subjects', all.map(x => x.id === s.id ? s : x)); }
  async deleteSubject(id: string) { const all = await this.getSubjects(); await this.set('subjects', all.filter(x => x.id !== id)); }

  // ---- Entregas (se ven en el Calendario) ----
  getAssignments() { return this.get<Assignment[]>('assignments', []); }
  async addAssignment(a: Assignment) { const all = await this.getAssignments(); await this.set('assignments', [...all, a]); }
  async updateAssignment(a: Assignment) { const all = await this.getAssignments(); await this.set('assignments', all.map(x => x.id === a.id ? a : x)); }
  async deleteAssignment(id: string) { const all = await this.getAssignments(); await this.set('assignments', all.filter(x => x.id !== id)); }

  // ---- Metas ----
  getGoals() { return this.get<Goal[]>('goals', []); }
  async addGoal(g: Goal) { const all = await this.getGoals(); await this.set('goals', [...all, g]); }
  async deleteGoal(id: string) { const all = await this.getGoals(); await this.set('goals', all.filter(x => x.id !== id)); }
}