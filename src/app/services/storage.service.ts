import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage';

import {
  Assignment,
  Goal,
  Note,
  Profile,
  Session,
  Subject
} from '../models/models';

import { UiService } from './ui.services';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private store = new Storage({
    name: 'studytime_db'
  });

  private ready = this.store.create();

  private ui = inject(UiService);

  // =========================================================
  // ALMACENAMIENTO GENERAL
  // =========================================================

  async get<T>(key: string, fallback: T): Promise<T> {
    await this.ready;

    const value = (await this.store.get(key)) ?? fallback;

    this.ui.refresh();

    return value;
  }

  async set(key: string, value: unknown): Promise<void> {
    await this.ready;

    await this.store.set(key, value);

    this.ui.refresh();
  }

  // =========================================================
  // SESIONES
  // =========================================================

  getSessions(): Promise<Session[]> {
    return this.get<Session[]>('sessions', []);
  }

  async addSession(session: Session): Promise<void> {
    const sessions = await this.getSessions();

    await this.set('sessions', [
      session,
      ...sessions
    ]);
  }

  async updateSession(session: Session): Promise<void> {
    const sessions = await this.getSessions();

    await this.set(
      'sessions',
      sessions.map(s =>
        s.id === session.id ? session : s
      )
    );
  }

  async deleteSession(id: string): Promise<void> {
    const sessions = await this.getSessions();

    await this.set(
      'sessions',
      sessions.filter(s => s.id !== id)
    );
  }

  async secondsSince(
    from: Date,
    subject?: string
  ): Promise<number> {

    const sessions = await this.getSessions();

    return sessions
      .filter(session =>
        new Date(session.date) >= from &&
        (!subject || session.subject === subject)
      )
      .reduce(
        (total, session) => total + session.seconds,
        0
      );
  }

  // =========================================================
  // PERFIL
  // =========================================================

  getProfile(): Promise<Profile> {
    return this.get<Profile>(
      'profile',
      {
        name: 'Estudiante',
        career: '',
        goalHours: 4
      }
    );
  }

  saveProfile(profile: Profile): Promise<void> {
    return this.set('profile', profile);
  }

  // =========================================================
  // NOTAS
  // =========================================================

  getNotes(): Promise<Note[]> {
    return this.get<Note[]>('notes', []);
  }

  async addNote(note: Note): Promise<void> {
    const notes = await this.getNotes();

    await this.set('notes', [
      note,
      ...notes
    ]);
  }

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getNotes();

    await this.set(
      'notes',
      notes.filter(note => note.id !== id)
    );
  }

  // =========================================================
  // MATERIAS
  // =========================================================

  async getSubjects(): Promise<Subject[]> {
    const subjects = await this.get<Subject[]>(
      'subjects',
      []
    );

    return subjects.map(subject => ({
      ...subject,
      topics: subject.topics ?? []
    }));
  }

  async addSubject(name: string): Promise<void> {
    const subjects = await this.getSubjects();

    await this.set(
      'subjects',
      [
        ...subjects,
        {
          id: Date.now().toString(),
          name,
          topics: []
        }
      ]
    );
  }

  async updateSubject(subject: Subject): Promise<void> {
    const subjects = await this.getSubjects();

    await this.set(
      'subjects',
      subjects.map(s =>
        s.id === subject.id ? subject : s
      )
    );
  }

  async deleteSubject(id: string): Promise<void> {
    const subjects = await this.getSubjects();

    await this.set(
      'subjects',
      subjects.filter(subject =>
        subject.id !== id
      )
    );
  }

  // =========================================================
  // ENTREGAS / CALENDARIO
  // =========================================================

  getAssignments(): Promise<Assignment[]> {
    return this.get<Assignment[]>(
      'assignments',
      []
    );
  }

  async addAssignment(
    assignment: Assignment
  ): Promise<void> {

    const assignments = await this.getAssignments();

    await this.set(
      'assignments',
      [
        ...assignments,
        assignment
      ]
    );
  }

  async updateAssignment(
    assignment: Assignment
  ): Promise<void> {

    const assignments = await this.getAssignments();

    await this.set(
      'assignments',
      assignments.map(a =>
        a.id === assignment.id
          ? assignment
          : a
      )
    );
  }

  async deleteAssignment(id: string): Promise<void> {

    const assignments = await this.getAssignments();

    await this.set(
      'assignments',
      assignments.filter(a =>
        a.id !== id
      )
    );
  }

  // =========================================================
  // METAS
  // =========================================================

  getGoals(): Promise<Goal[]> {
    return this.get<Goal[]>(
      'goals',
      []
    );
  }

  async addGoal(goal: Goal): Promise<void> {

    const goals = await this.getGoals();

    await this.set(
      'goals',
      [
        ...goals,
        goal
      ]
    );
  }

  async deleteGoal(id: string): Promise<void> {

    const goals = await this.getGoals();

    await this.set(
      'goals',
      goals.filter(g =>
        g.id !== id
      )
    );
  }
}