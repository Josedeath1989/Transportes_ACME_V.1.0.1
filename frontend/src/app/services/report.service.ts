import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) { }

  getReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/principal`);
  }
}
