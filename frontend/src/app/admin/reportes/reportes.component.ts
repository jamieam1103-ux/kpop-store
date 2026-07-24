import { NavbarComponent } from '../../navbar/navbar.component';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  productoMasVendido: { nombre: string; unidades: number; ingresos: number } | null = null;
  productoMenosVendido: { nombre: string; unidades: number; ingresos: number } | null = null;

  constructor(private pedidoService: PedidoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    (this.pedidoService as any).listarPedidos().subscribe({
      next: (pedidos: any[]) => {
        try {
          this.pedidos = pedidos;
          this.calcularMetricas(pedidos);
        } catch (e) {
          console.error('ERROR EN calcularMetricas:', e);
          alert('Error procesando datos de reportes: ' + (e as any)?.message);
        } finally {
          this.cargando = false;
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        console.error('ERROR EN listarPedidos:', err);
        alert('Error al obtener pedidos: ' + (err?.message || JSON.stringify(err)));
        this.cargando = false;
        this.cdr.detectChanges();
      }
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
    const prodMap: Record<string, { nombre: string; unidades: number; ingresos: number }> = {};
    pedidos.forEach(p => {
      p.detalles?.forEach((d: any) => {
        const key = String(d.varianteId);
        const nombre = d.varianteDescripcion || `Variante #${d.varianteId}`;
        if (!prodMap[key]) prodMap[key] = { nombre, unidades: 0, ingresos: 0 };
        prodMap[key].unidades += d.cantidad || 0;
        prodMap[key].ingresos += (+
          d.precioUnitario || 0) * (d.cantidad || 0);
      });
    });
    const prodArray = Object.values(prodMap);
    this.topProductos = [...prodArray]
      .sort((a, b) => b.ingresos - a.ingresos).slice(0, 10);

    const porUnidades = [...prodArray].sort((a, b) => b.unidades - a.unidades);
    this.productoMasVendido = porUnidades.length ? porUnidades[0] : null;
    this.productoMenosVendido = porUnidades.length ? porUnidades[porUnidades.length - 1] : null;
  }
}
