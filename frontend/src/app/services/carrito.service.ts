import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrito {
  varianteId: number;
  productoNombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private _items = signal<ItemCarrito[]>(this.cargarStorage());

  private cargarStorage(): ItemCarrito[] {
    try {
      const data = localStorage.getItem('carrito');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  private guardarStorage(items: ItemCarrito[]) {
    localStorage.setItem('carrito', JSON.stringify(items));
  }

  items = this._items.asReadonly();

  total = computed(() =>
    this._items().reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  );

  cantidadTotal = computed(() =>
    this._items().reduce((acc, i) => acc + i.cantidad, 0)
  );

  agregar(item: ItemCarrito) {
    const actual = this._items();
    const existe = actual.find(i => i.varianteId === item.varianteId);
    let nuevo;
    if (existe) {
      nuevo = actual.map(i => i.varianteId === item.varianteId
        ? { ...i, cantidad: i.cantidad + 1 } : i);
    } else {
      nuevo = [...actual, { ...item, cantidad: 1 }];
    }
    this._items.set(nuevo);
    this.guardarStorage(nuevo);
  }

  eliminar(varianteId: number) {
    const nuevo = this._items().filter(i => i.varianteId !== varianteId);
    this._items.set(nuevo);
    this.guardarStorage(nuevo);
  }

  cambiarCantidad(varianteId: number, cantidad: number) {
    if (cantidad <= 0) { this.eliminar(varianteId); return; }
    const nuevo = this._items().map(i =>
      i.varianteId === varianteId ? { ...i, cantidad } : i);
    this._items.set(nuevo);
    this.guardarStorage(nuevo);
  }

  limpiar() {
    this._items.set([]);
    localStorage.removeItem('carrito');
  }
}
