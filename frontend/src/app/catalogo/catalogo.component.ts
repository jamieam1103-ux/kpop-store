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

  categorias = ['TODOS', 'K-POP', 'ANIME'];
  categoriaActiva = 'TODOS';
  subcategoriaActiva = 'TODAS';
  busqueda = '';
  toastVisible = false;
  cargando = false;
  private toastTimer: any;

  private productos = signal<Producto[]>([]);

  // Subcategorías disponibles según la categoría principal elegida
  subcategoriasDisponibles(): string[] {
    const fuente = this.categoriaActiva === 'TODOS'
      ? this.productos()
      : this.productos().filter(p => p.categoria === this.categoriaActiva);
    const unicas = Array.from(new Set(fuente.map(p => p.subcategoria).filter((s): s is string => !!s)));
    return ['TODAS', ...unicas];
  }

  productosFiltrados(): Producto[] {
    return this.productos().filter(p => {
      const coincideCategoria = this.categoriaActiva === 'TODOS' || p.categoria === this.categoriaActiva;
      const coincideSubcategoria = this.subcategoriaActiva === 'TODAS' || p.subcategoria === this.subcategoriaActiva;
      const coincideBusqueda = p.nombre.toLowerCase().includes(this.busqueda.toLowerCase());
      return
