import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  nombre = '';
  error = '';
  modo: 'login' | 'registro' = 'login';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/catalogo']);
        }
      },
      error: () => this.error = 'Email o contraseña incorrectos'
    });
  }

  registro() {
    this.authService.register(this.email, this.password, this.nombre).subscribe({
      next: () => {
        this.modo = 'login';
        this.error = '¡Cuenta creada! Ya puedes iniciar sesión';
      },
      error: () => this.error = 'Error al registrarse'
    });
  }
}
