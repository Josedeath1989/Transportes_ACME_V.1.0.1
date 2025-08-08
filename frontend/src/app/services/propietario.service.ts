import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propietario } from '../models/propietario.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PropietarioService {
  private apiUrl = 'http://localhost:8000/api/propietarios';

  constructor(private http: HttpClient) { }

  getPropietarios(): Observable<ApiResponse<Propietario[]>> {
    return this.http.get<ApiResponse<Propietario[]>>(this.apiUrl);
  }

  getPropietario(id: number): Observable<ApiResponse<Propietario>> {
    return this.http.get<ApiResponse<Propietario>>(`${this.apiUrl}/${id}`);
  }

  createPropietario(propietario: Propietario): Observable<ApiResponse<Propietario>> {
    return this.http.post<ApiResponse<Propietario>>(this.apiUrl, propietario);
  }

  updatePropietario(id: number, propietario: Propietario): Observable<ApiResponse<Propietario>> {
    return this.http.put<ApiResponse<Propietario>>(`${this.apiUrl}/${id}`, propietario);
  }

  deletePropietario(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
