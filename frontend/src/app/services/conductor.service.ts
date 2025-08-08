import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Conductor } from '../models/conductor.model';

@Injectable({
  providedIn: 'root'
})
export class ConductorService {
  private apiUrl = `${environment.apiUrl}/conductores`;

  constructor(private http: HttpClient) { }

  getConductores(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(this.apiUrl);
  }
}
