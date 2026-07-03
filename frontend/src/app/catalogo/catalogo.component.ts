import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';
import { ProductoService, ProductoBackend } from '../services/producto.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria: string;
  subcategoria?: string;
  varianteId: number;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  categorias = ['TODOS', 'K-POP', 'CDS', 'MANGA', 'MERCH'];
  categoriaActiva = 'TODOS';
  busqueda = '';
  toastVisible = false;
  cargando = false;
  private toastTimer: any;

  private productos = signal<Producto[]>([]);

  productosFiltrados(): Producto[] {
    return this.productos().filter(p => {
      const coincideCategoria = this.categoriaActiva === 'TODOS' || p.categoria === this.categoriaActiva;
      const coincideBusqueda = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }

  constructor(
    public carritoService: CarritoService,
    private productoService: ProductoService,
    private authService: AuthService
  ) {}

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (data: ProductoBackend[]) => {
        const mapeados: Producto[] = data
          .filter(p => p.variantes && p.variantes.length > 0)
          .map(p => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            imagen: p.imagen,
            categoria: p.categoria,
            subcategoria: p.subcategoria,
            precio: p.variantes[0].precio,
            varianteId: p.variantes[0].id
          }));
        this.productos.set(mapeados);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.cargando = false;
      }
    });
  }

  filtrar(cat: string) { this.categoriaActiva = cat; }

  limpiarFiltros() {
    this.categoriaActiva = 'TODOS';
    this.busqueda = '';
  }

  agregarAlCarrito(p: Producto) {
    this.carritoService.agregar({
      varianteId: p.varianteId,
      productoNombre: p.nombre,
      descripcion: p.descripcion ? p.descripcion.substring(0, 80) + '...' : '',
      precio: p.precio,
      imagen: p.imagen || '',
      cantidad: 1
    });
    this.mostrarToast();
  }

  private mostrarToast() {
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible = false, 2200);
  }
}
