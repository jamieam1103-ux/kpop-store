import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.usuarioService.listar().subscribe((data) => {
      this.usuarios = data;
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }

  toggle(id: number) {
    this.usuarioService.toggleActivo(id).subscribe({
      next: (actualizado) => {
        const idx = this.usuarios.findIndex(u => u.id === id);
        if (idx !== -1) this.usuarios[idx] = actualizado;
        this.cdr.detectChanges();
      }
    });
  }
}
