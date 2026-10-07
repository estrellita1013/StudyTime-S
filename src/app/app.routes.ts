import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'bienvenida', pathMatch: 'full' },
  { path: 'bienvenida', loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage) },
  { path: 'login', loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) } ,
  { path: 'tabs', loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.tabsRoutes) },

  // Dashboard
  { path: 'materias', loadComponent: () => import('./pages/subjects/subjects.page').then(m => m.SubjectsPage) },
  { path: 'materia/:id', loadComponent: () => import('./pages/subject-detail/subject-detail.page').then(m => m.SubjectDetailPage) },
  { path: 'estudiar', loadComponent: () => import('./pages/study/study.page').then(m => m.StudyPage) },
  { path: 'sesion', loadComponent: () => import('./pages/sesion/sesion.page').then(m => m.SessionPage) },
  { path: 'metas', loadComponent: () => import('./pages/goals/goals.page').then(m => m.GoalsPage) },
  { path: 'calendario', loadComponent: () => import('./pages/calendar/calendar.page').then(m => m.CalendarPage) },
  { path: 'estadisticas', loadComponent: () => import('./pages/stats/stats.page').then(m => m.StatsPage) },

  // Perfil
  { path: 'historial', loadComponent: () => import('./pages/history/history.page').then(m => m.HistoryPage) },
  { path: 'notas', loadComponent: () => import('./pages/notes/notes.page').then(m => m.NotesPage) },
  { path: 'lugares', loadComponent: () => import('./pages/places/places.page').then(m => m.PlacesPage) },
  { path: 'bluetooth', loadComponent: () => import('./pages/bluetooth/bluetooth.page').then(m => m.BluetoothPage) },
];
