import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  cargando = false;
  pedidoConfirmado = false;
  pedidoId: number | null = null;

  constructor(
    public carritoService: CarritoService,
    private pedidoService: PedidoService
  ) { }

  confirmarPedido() {
    if (this.carritoService.items().length === 0) return;
    this.cargando = true;

    const pedido = {
      usuarioId: 0,
      estado: 'PENDIENTE',
      detalles: this.carritoService.items().map((i: any) => ({
        varianteId: i.varianteId,
        cantidad: i.cantidad
      }))
    };

    this.pedidoService.crearPedido(pedido as any).subscribe({
      next: (resp: any) => {
        this.pedidoId = resp.id;
        this.pedidoConfirmado = true;
        this.carritoService.limpiar();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al confirmar pedido:', err);
        this.cargando = false;
      }
    });
  }
}
