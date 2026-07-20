import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService, ProductoBackend, ProductoPayload } from '../../services/producto.service';
import { VarianteService } from '../../services/variante.service';
import { JikanService, JikanMangaResultado } from '../../services/jikan.service';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class AdminProductosComponent implements OnInit {
  productos: ProductoBackend[] = [];
  cargando = true;
  guardando = false;

  mostrarForm = false;
  modoEdicion = false;
  productoEditandoId: number | null = null;
  varianteEditandoId: number | null = null;
  toastVisible = false;
  toastMensaje = '';
  private toastTimer: any;
  confirmEliminarVisible = false;
  productoAEliminar: ProductoBackend | null = null;

  errorEliminarVisible = false;
  errorEliminarMensaje = '';

  // --- Estado del buscador Jikan (solo aplica a ANIME/MANGA) ---
  jikanQuery = '';
  buscandoJikan = false;
  resultadosJikan: JikanMangaResultado[] = [];
  jikanBuscado = false;

  subcategoriasPorCategoria: Record<string, string[]> = {
    'K-POP': ['CDS', 'MERCH'],
    'ANIME': ['MANGA', 'MERCH']
  };

  form = {
    nombre: '',
    descripcion: '',
    imagen: '',
    categoria: 'K-POP',
    subcategoria: 'CDS',
    varianteDescripcion: 'Único',
    precio: 0,
    stock: 0,
    stockMinimo: 5
  };

  constructor(
    private productoService: ProductoService,
    private varianteService: VarianteService,
    private jikanService: JikanService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.productoService.listar().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get subcategoriasDisponibles(): string[] {
    return this.subcategoriasPorCategoria[this.form.categoria] || [];
  }

  // true solo cuando el producto es ANIME + MANGA -> es cuando mostramos el buscador Jikan
  get esManga(): boolean {
    return this.form.categoria === 'ANIME' && this.form.subcategoria === 'MANGA';
  }

  onCategoriaChange() {
    this.form.subcategoria = this.subcategoriasDisponibles[0] || '';
    this.resetJikan();
  }

  onSubcategoriaChange() {
    this.resetJikan();
  }

  private resetJikan() {
    this.jikanQuery = '';
    this.resultadosJikan = [];
    this.jikanBuscado = false;
    this.buscandoJikan = false;
  }

  buscarEnJikan() {
    const q = this.jikanQuery.trim();
    if (!q) return;

    this.buscandoJikan = true;
    this.jikanBuscado = false;

    this.jikanService.buscarManga(q).subscribe({
      next: (resp) => {
        this.resultadosJikan = resp.data || [];
        this.buscandoJikan = false;
        this.jikanBuscado = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.resultadosJikan = [];
        this.buscandoJikan = false;
        this.jikanBuscado = true;
        this.cdr.detectChanges();
      }
    });
  }

  usarResultadoJikan(r: JikanMangaResultado) {
    this.form.nombre = r.title;
    this.form.descripcion = r.synopsis || '';
    this.form.imagen = r.images?.jpg?.image_url || '';
    // Se limpian los resultados, pero el admin sigue completando precio/stock manualmente
    this.resultadosJikan = [];
    this.jikanQuery = '';
    this.jikanBuscado = false;
  }

  abrirNuevo() {
    this.modoEdicion = false;
    this.productoEditandoId = null;
    this.varianteEditandoId = null;
    this.form = {
      nombre: '',
      descripcion: '',
      imagen: '',
      categoria: 'K-POP',
      subcategoria: 'CDS',
      varianteDescripcion: 'Único',
      precio: 0,
      stock: 0,
      stockMinimo: 5
    };
    this.resetJikan();
    this.mostrarForm = true;
  }

  editar(p: ProductoBackend) {
    this.modoEdicion = true;
    this.productoEditandoId = p.id;
    const v = p.variantes && p.variantes.length > 0 ? p.variantes[0] : null;
    this.varianteEditandoId = v ? v.id : null;
    this.form = {
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      imagen: p.imagen || '',
      categoria: p.categoria,
      subcategoria: p.subcategoria || (this.subcategoriasPorCategoria[p.categoria]?.[0] ?? ''),
      varianteDescripcion: v ? v.descripcion : 'Único',
      precio: v ? v.precio : 0,
      stock: v ? v.stock : 0,
      stockMinimo: v && v.stockMinimo != null ? v.stockMinimo : 5
    };
    this.resetJikan();
    this.mostrarForm = true;
  }

  cancelar() {
    this.mostrarForm = false;
  }

  guardar() {
    if (!this.form.nombre.trim()) {
      alert('El producto necesita un nombre.');
      return;
    }
    if (this.form.precio <= 0) {
      alert('El precio debe ser mayor a 0.');
      return;
    }

    this.guardando = true;

    const productoPayload: ProductoPayload = {
      nombre: this.form.nombre,
      descripcion: this.form.descripcion,
      imagen: this.form.imagen,
      categoria: this.form.categoria,
      subcategoria: this.form.subcategoria
    };

    if (this.modoEdicion && this.productoEditandoId != null) {
      this.productoService.actualizar(this.productoEditandoId, productoPayload).subscribe({
        next: () => this.guardarVariante(this.productoEditandoId as number),
        error: () => {
          this.guardando = false;
          alert('No se pudo actualizar el producto.');
        }
      });
    } else {
      this.productoService.crear(productoPayload).subscribe({
        next: (creado) => this.guardarVariante(creado.id),
        error: () => {
          this.guardando = false;
          alert('No se pudo crear el producto.');
        }
      });
    }
  }

  private guardarVariante(productoId: number) {
    const variantePayload = {
      descripcion: this.form.varianteDescripcion || 'Único',
      precio: this.form.precio,
      stock: this.form.stock,
      stockMinimo: this.form.stockMinimo,
      producto: { id: productoId }
    };

    const obs = this.varianteEditandoId
      ? this.varianteService.actualizar(this.varianteEditandoId, variantePayload)
      : this.varianteService.crear(variantePayload);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarForm = false;
        this.cargarProductos();
      },
      error: () => {
        this.guardando = false;
        alert('El producto se guardó, pero hubo un problema al guardar precio/stock.');
        this.mostrarForm = false;
        this.cargarProductos();
      }
    });
  }

  pedirConfirmacionEliminar(p: ProductoBackend) {
    this.productoAEliminar = p;
    this.confirmEliminarVisible = true;
    this.cdr.detectChanges();
  }

  cancelarEliminar() {
    this.confirmEliminarVisible = false;
    this.productoAEliminar = null;
    this.cdr.detectChanges();
  }

  confirmarEliminar() {
    const p = this.productoAEliminar;
    if (!p) return;
    this.confirmEliminarVisible = false;
    this.cdr.detectChanges();

    this.productoService.eliminar(p.id).subscribe({
      next: () => {
        this.cargarProductos();
        this.mostrarToast(`"${p.nombre}" fue eliminado`);
        this.productoAEliminar = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorEliminarMensaje = err?.error?.mensaje || 'No se pudo eliminar el producto.';
        this.errorEliminarVisible = true;
        this.productoAEliminar = null;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarErrorEliminar() {
    this.errorEliminarVisible = false;
    this.cdr.detectChanges();
  }

  private mostrarToast(mensaje: string) {
    this.toastMensaje = mensaje;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastVisible = false;
      this.cdr.detectChanges();
    }, 2200);
  }

  precioDe(p: ProductoBackend): number | null {
    return p.variantes && p.variantes.length > 0 ? p.variantes[0].precio : null;
  }

  stockDe(p: ProductoBackend): number | null {
    return p.variantes && p.variantes.length > 0 ? p.variantes[0].stock : null;
  }

  stockBajo(p: ProductoBackend): boolean {
    const v = p.variantes && p.variantes.length > 0 ? p.variantes[0] : null;
    return !!v && v.stockMinimo != null && v.stock <= v.stockMinimo;
  }
}
