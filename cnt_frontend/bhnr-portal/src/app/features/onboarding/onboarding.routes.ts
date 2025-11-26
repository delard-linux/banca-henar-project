import { Routes } from '@angular/router';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'create-account',
    pathMatch: 'full',
  },
  {
    path: 'create-account',
    loadComponent: () => import('./onboarding.component').then((m) => m.OnboardingComponent),
  },
];

