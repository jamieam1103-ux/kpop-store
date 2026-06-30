import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService, PedidoDTO } from '../../services/pedido.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  pedidos: PedidoDTO[] = [];
  cargando = true;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.pedidoService.listarPedidos().subscribe({
      next: (data: PedidoDTO[]) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  getConteo(estado: string): number {
    return this.pedidos.filter(p => p.estado === estado).length;
  }

  getEstadoClass(estado: string): string {
    return 'estado-' + (estado || '');
  }

  cambiarEstado(id: number, estado: string) {
    this.pedidoService.cambiarEstado(id, estado).subscribe({
      next: (actualizado: PedidoDTO) => {
        const idx = this.pedidos.findIndex(p => p.id === id);
        if (idx !== -1) this.pedidos[idx] = actualizado;
      }
    });
  }
}
