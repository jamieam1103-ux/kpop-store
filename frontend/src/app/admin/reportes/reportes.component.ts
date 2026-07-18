import { NavbarComponent } from '../../navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  cargando = true;
  pedidos: any[] = [];
  totalIngresos = 0; totalPedidos = 0; totalUnidades = 0; ticketPromedio = 0;
  ventasPorCategoria: { nombre: string; total: number; porcentaje: number; color: string }[] = [];
  pedidosPorEstado:   { nombre: string; cantidad: number; porcentaje: number }[] = [];
  topProductos:       { nombre: string; unidades: number; ingresos: number }[] = [];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    (this.pedidoService as any).listarPedidos().subscribe({
      next: (pedidos: any[]) => {
        this.pedidos = pedidos;
        this.calcularMetricas(pedidos);
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  calcularMetricas(pedidos: any[]) {
    this.totalPedidos = pedidos.length;
    this.totalIngresos = pedidos.reduce((s, p) => s + (p.total || 0), 0);
    this.totalUnidades = pedidos.reduce((s, p) =>
      s + (p.detalles?.reduce((d: number, i: any) => d + (i.cantidad || 0), 0) || 0), 0);
    this.ticketPromedio = this.totalPedidos > 0 ? this.totalIngresos / this.totalPedidos : 0;
    const catMap: Record<string, number> = {};
    pedidos.forEach(p => {
      p.detalles?.forEach((d: any) => {
        const cat = (d.varianteDescripcion || '').toUpperCase().includes('ANIME') ? 'ANIME' : 'KPOP';
        catMap[cat] = (catMap[cat] || 0) + (d.precioUnitario || 0) * (d.cantidad || 0);
      });
    });
    const catColors: Record<string, string> = { KPOP: '#FF2D78', ANIME: '#7B2FBE' };
    const catTotal = Object.values(catMap).reduce((a, b) => a + b, 0);
    this.ventasPorCategoria = Object.entries(catMap).map(([nombre, total]) => ({
      nombre, total, porcentaje: catTotal > 0 ? (total / catTotal) * 100 : 0, color: catColors[nombre] || '#9880B0'
    }));
    const estadoMap: Record<string, number> = {};
    pedidos.forEach(p => { estadoMap[p.estado] = (estadoMap[p.estado] || 0) + 1; });
    this.pedidosPorEstado = Object.entries(estadoMap).map(([nombre, cantidad]) => ({
      nombre, cantidad, porcentaje: this.totalPedidos > 0 ? (cantidad / this.totalPedidos) * 100 : 0
    }));
    const prodMap: Record<string, { unidades: number; ingresos: number }> = {};
    pedidos.forEach(p => {
      p.detalles?.forEach((d: any) => {
        const key = d.varianteDescripcion || `Variante #${d.varianteId}`;
        if (!prodMap[key]) prodMap[key] = { unidades: 0, ingresos: 0 };
        prodMap[key].unidades += d.cantidad || 0;
        prodMap[key].ingresos += (d.precioUnitario || 0) * (d.cantidad || 0);
      });
    });
    this.topProductos = Object.entries(prodMap)
      .map(([nombre, data]) => ({ nombre, ...data }))
      .sort((a, b) => b.ingresos - a.ingresos).slice(0, 10);
  }
}
