import { Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

export const tabsRoutes: Routes = [

  {
    path: '',
    component: TabsPage,

    children: [

      {
        path: 'hoy',
        loadComponent: () =>
          import('../home/home.page')
            .then(m => m.HomePage)
      },

      {
        path: 'estudiar',
        loadComponent: () =>
          import('../study/study.page')
            .then(m => m.StudyPage)
      },

      {
        path: 'materias',
        loadComponent: () =>
          import('../subjects/subjects.page')
            .then(m => m.SubjectsPage)
      },

      {
        path: 'metas',
        loadComponent: () =>
          import('../goals/goals.page')
            .then(m => m.GoalsPage)
      },

      {
        path: 'perfil',
        loadComponent: () =>
          import('../profile/profile.page')
            .then(m => m.ProfilePage)
      },

      {
        path: '',
        redirectTo: 'hoy',
        pathMatch: 'full'
      }

    ]

  }

];