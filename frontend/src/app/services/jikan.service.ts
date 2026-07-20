import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JikanMangaResultado {
  title: string;
  synopsis?: string;
  images?: {
    jpg?: {
      image_url?: string;
    };
  };
}

export interface JikanRespuesta {
  data: JikanMangaResultado[];
}

@Injectable({ providedIn: 'root' })
export class JikanService {
  private url = `${environment.apiUrl}/api/productos/jikan`;

  constructor(private http: HttpClient) {}

  buscarManga(nombre: string): Observable<JikanRespuesta> {
    return this.http.get<JikanRespuesta>(`${this.url}/manga`, { params: { nombre } });
  }

  buscarAnime(nombre: string): Observable<JikanRespuesta> {
    return this.http.get<JikanRespuesta>(`${this.url}/anime`, { params: { nombre } });
  }
}
