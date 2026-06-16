import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../services/carrito.service';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria: 'K-POP' | 'ANIME' | 'TODOS';
  varianteId: number;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {

  categorias = ['TODOS', 'K-POP', 'ANIME'];
  categoriaActiva = 'TODOS';
  busqueda = '';
  toastVisible = false;
  private toastTimer: any;

  // ── Datos mock — reemplazar con llamada al backend ──
  private productos = signal<Producto[]>([
    { id: 1, varianteId: 101, nombre: 'Album BTS – MAP OF THE SOUL', descripcion: 'Edición estándar con photocard incluida', precio: 89.90, categoria: 'K-POP', imagen: '' },
    { id: 2, varianteId: 102, nombre: 'Lightstick BLACKPINK', descripcion: 'Oficial versión 2 con Bluetooth', precio: 149.90, categoria: 'K-POP', imagen: '' },
    { id: 3, varianteId: 103, nombre: 'Póster STRAY KIDS', descripcion: 'Set de 4 pósters premium 30x40cm', precio: 49.90, categoria: 'K-POP', imagen: '' },
    { id: 4, varianteId: 104, nombre: 'Figura Naruto Uzumaki', descripcion: 'PVC articulado 18cm edición coleccionista', precio: 129.90, categoria: 'ANIME', imagen: '' },
    { id: 5, varianteId: 105, nombre: 'Peluche Totoro Grande', descripcion: 'Suave, 40cm, oficial Studio Ghibli', precio: 99.90, categoria: 'ANIME', imagen: '' },
    { id: 6, varianteId: 106, nombre: 'Keychain Attack on Titan', descripcion: 'Set de 6 llaveros metálicos', precio: 34.90, categoria: 'ANIME', imagen: '' },
    { id: 7, varianteId: 107, nombre: 'Washi Tape NewJeans', descripcion: 'Pack de 3 rollos decorativos', precio: 24.90, categoria: 'K-POP', imagen: '' },
    { id: 8, varianteId: 108, nombre: 'Figura Demon Slayer – Tanjiro', descripcion: 'Resina pintada a mano, 15cm', precio: 159.90, categoria: 'ANIME', imagen: '' },
  ]);

  productosFiltrados = computed(() => {
    return this.productos().filter(p => {
      const coincideCategoria = this.categoriaActiva === 'TODOS' || p.categoria === this.categoriaActiva;
      const coincideBusqueda = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  });

  constructor(private carritoService: CarritoService) {}

  filtrar(cat: string) {
    this.categoriaActiva = cat;
  }

  limpiarFiltros() {
    this.categoriaActiva = 'TODOS';
    this.busqueda = '';
  }

  agregarAlCarrito(p: Producto) {
    this.carritoService.agregar({
      varianteId: p.varianteId,
      productoNombre: p.nombre,
      descripcion: p.descripcion,
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
