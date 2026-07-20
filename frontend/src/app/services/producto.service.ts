import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VarianteBackend {
  id: number;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
}

export interface ProductoBackend {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
  variantes: VarianteBackend[];
}

export interface ProductoPayload {
  nombre: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  subcategoria: string;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private url = `${environment.apiUrl}/api/productos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ProductoBackend[]> {
    return this.http.get<ProductoBackend[]>(this.url);
  }

  crear(producto: ProductoPayload): Observable<ProductoBackend> {
    return this.http.post<ProductoBackend>(this.url, producto);
  }

  actualizar(id: number, producto: ProductoPayload): Observable<ProductoBackend> {
    return this.http.put<ProductoBackend>(`${this.url}/${id}`, producto);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
