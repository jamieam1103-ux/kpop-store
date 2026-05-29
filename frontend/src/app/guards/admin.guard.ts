import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const rol = localStorage.getItem('rol');
  if (rol === 'ADMIN') return true;
  inject(Router).navigate(['/login']);
  return false;
};
