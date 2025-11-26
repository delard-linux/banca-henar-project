import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./landing-page/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'create-account',
    loadComponent: () => import('../onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },
];

