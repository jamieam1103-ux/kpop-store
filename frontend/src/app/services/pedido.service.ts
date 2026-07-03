import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface DetallePedidoDTO {
  id?: number;
  varianteId: number;
  varianteDescripcion?: string;
  cantidad: number;
  precioUnitario?: number;
}

export interface PedidoDTO {
  id: number;           // ← quitado el ?
  usuarioId: number;
  usuarioNombre?: string;
  fecha?: string;
  estado: string;       // ← quitado el ?
  total?: number;
  detalles: DetallePedidoDTO[];
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/pedidos`;

  private headers() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  crearPedido(pedido: PedidoDTO) {
    return this.http.post<PedidoDTO>(this.url, pedido, { headers: this.headers() });
  }

  listarPedidos() {
    return this.http.get<PedidoDTO[]>(this.url, { headers: this.headers() });
  }

  obtenerPorId(id: number) {
    return this.http.get<PedidoDTO>(`${this.url}/${id}`, { headers: this.headers() });
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch<PedidoDTO>(
      `${this.url}/${id}/estado?estado=${estado}`,
      {},
      { headers: this.headers() }
    );
  }
}
