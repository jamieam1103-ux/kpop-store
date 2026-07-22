import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VariantePayload {
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  producto: { id: number };
}

@Injectable({ providedIn: 'root' })
export class VarianteService {
  private url = `${environment.apiUrl}/api/variantes`;

  constructor(private http: HttpClient) {}

  crear(variante: VariantePayload): Observable<any> {
    return this.http.post<any>(this.url, variante);
  }

  actualizar(id: number, variante: VariantePayload): Observable<any> {
    return this.http.put<any>(`${this.url}/${id}`, variante);
  }
}
