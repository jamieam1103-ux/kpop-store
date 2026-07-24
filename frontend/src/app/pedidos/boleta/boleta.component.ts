import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PedidoService, PedidoDTO } from '../../services/pedido.service';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-boleta',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './boleta.component.html',
  styleUrls: ['./boleta.component.css']
})
export class BoletaComponent implements OnInit {
  pedido: PedidoDTO | null = null;
  cargando = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.cargando = false;
      this.error = true;
      return;
    }
    this.pedidoService.obtenerPorId(id).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.error = true;
        this.cdr.detectChanges();
      }
    });
  }

  get numeroBoleta(): string {
    if (!this.pedido) return '';
    return 'B001-' + this.pedido.id.toString().padStart(8, '0');
  }

  get subtotal(): number {
    if (!this.pedido) return 0;
    return this.pedido.detalles.reduce(
      (acc, d) => acc + (d.precioUnitario ?? 0) * d.cantidad,
      0
    );
  }

  // IGV incluido en el precio (18%), se muestra desglosado solo de forma referencial
  get igv(): number {
    return this.subtotal - this.subtotal / 1.18;
  }

  get baseImponible(): number {
    return this.subtotal / 1.18;
  }

  imprimir() {
    window.print();
  }
}
