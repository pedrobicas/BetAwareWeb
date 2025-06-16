import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'apostas',
        loadComponent: () => import('./components/apostas/apostas.component').then(m => m.ApostasComponent)
      },
      {
        path: 'historico',
        loadComponent: () => import('./components/historico/historico.component').then(m => m.HistoricoComponent)
      },
      {
        path: 'relatorio',
        loadComponent: () => import('./components/relatorio/relatorio.component').then(m => m.RelatorioComponent)
      }
    ]
  }
];
