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
  private _items = signal<ItemCarrito[]>([]);

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
    if (existe) {
      this._items.set(
        actual.map(i => i.varianteId === item.varianteId
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
        )
      );
    } else {
      this._items.set([...actual, { ...item, cantidad: 1 }]);
    }
  }

  eliminar(varianteId: number) {
    this._items.set(this._items().filter(i => i.varianteId !== varianteId));
  }

  cambiarCantidad(varianteId: number, cantidad: number) {
    if (cantidad <= 0) { this.eliminar(varianteId); return; }
    this._items.set(
      this._items().map(i =>
        i.varianteId === varianteId ? { ...i, cantidad } : i
      )
    );
  }

  limpiar() { this._items.set([]); }
}
