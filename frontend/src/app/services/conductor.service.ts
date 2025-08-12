import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Conductor } from '../models/conductor.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  private apiUrl = `${environment.apiUrl}/conductores`;

  constructor(private http: HttpClient) { }

  getConductores(): Observable<ApiResponse<Conductor[]>> {
    return this.http.get<ApiResponse<Conductor[]>>(this.apiUrl);
  }

  getConductor(id: number): Observable<ApiResponse<Conductor>> {
    return this.http.get<ApiResponse<Conductor>>(`${this.apiUrl}/${id}`);
  }

  createConductor(conductor: Partial<Conductor>): Observable<ApiResponse<Conductor>> {
    return this.http.post<ApiResponse<Conductor>>(this.apiUrl, conductor);
  }

  updateConductor(id: number, conductor: Partial<Conductor>): Observable<ApiResponse<Conductor>> {
    return this.http.put<ApiResponse<Conductor>>(`${this.apiUrl}/${id}`, conductor);
  }

  deleteConductor(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
