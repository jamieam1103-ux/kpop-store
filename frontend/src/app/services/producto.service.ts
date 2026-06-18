import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VarianteBackend {
  id: number;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface ProductoBackend {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  variantes: VarianteBackend[];
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  listar(): Observable<ProductoBackend[]> {
    return this.http.get<ProductoBackend[]>(this.url);
  }
}
