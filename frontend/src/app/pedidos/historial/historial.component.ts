import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService, PedidoDTO } from '../../services/pedido.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  pedidos: PedidoDTO[] = [];
  cargando = true;

  constructor(
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const usuarioId = Number(localStorage.getItem('usuarioId'));
    this.pedidoService.listarPedidos().subscribe({
      next: (todos: PedidoDTO[]) => {
        this.pedidos = todos.filter(p => p.usuarioId === usuarioId);
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getEstadoClass(estado: string): string {
    return 'estado-' + (estado || '').toLowerCase();
  }

  getEstadoIcon(estado: string): string {
    const icons: Record<string, string> = {
      PENDIENTE: '🕐', PROCESANDO: '⚙️', ENVIADO: '📦', ENTREGADO: '✅', CANCELADO: '❌'
    };
    return icons[estado] || '📋';
  }
}
