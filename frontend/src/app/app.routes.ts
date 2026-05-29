import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/carrito', pathMatch: 'full' },

  {
    path: 'carrito',
    loadComponent: () => import('./carrito/carrito/carrito.component')
      .then(m => m.CarritoComponent)
  },

  {
    path: 'pedidos/historial',
    canActivate: [authGuard],
    loadComponent: () => import('./pedidos/historial/historial.component')
      .then(m => m.HistorialComponent)
  },

  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },

  {
    path: 'admin/reportes',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/reportes/reportes.component')
      .then(m => m.ReportesComponent)
  },

  { path: '**', redirectTo: '/carrito' }
];
