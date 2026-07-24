import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'admin/usuarios',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/usuarios/usuarios')
      .then(m => m.UsuariosComponent)
  },

  {
    path: 'login',
    loadComponent: () => import('./login/login')
      .then(m => m.LoginComponent)
  },

  {
    path: 'catalogo',
    canActivate: [authGuard],
    loadComponent: () => import('./catalogo/catalogo.component')
      .then(m => m.CatalogoComponent)
  },

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
    path: 'pedidos/boleta/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pedidos/boleta/boleta.component')
      .then(m => m.BoletaComponent)
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

  {
    path: 'admin/productos',
    canActivate: [adminGuard],
    loadComponent: () => import('./admin/productos/productos.component')
      .then(m => m.AdminProductosComponent)
  },

  { path: '**', redirectTo: '/login' }
];
