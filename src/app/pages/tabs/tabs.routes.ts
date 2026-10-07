import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'hoy', loadComponent: () => import('../home/home.page').then(m => m.HomePage) },
      { path: 'perfil', loadComponent: () => import('../profile/profile.page').then(m => m.ProfilePage) },
      { path: '', redirectTo: 'hoy', pathMatch: 'full' },
    ],
  },
];