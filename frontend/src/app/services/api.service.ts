import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ConfigService } from './config.service';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<ApiResponse<T>>(this.configService.getApiUrl(endpoint), { 
      params: httpParams,
      withCredentials: true
    })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.configService.getApiUrl(endpoint), data, {
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.configService.getApiUrl(endpoint), data, {
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.configService.getApiUrl(endpoint), {
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(this.configService.getApiUrl(endpoint), data, {
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.statusText || 'Server error';
      
      // Manejo específico de errores CORS
      if (error.status === 0) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté disponible.';
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Get auth headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  /**
   * Authenticated GET request
   */
  getAuth<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return this.http.get<ApiResponse<T>>(this.configService.getApiUrl(endpoint), { 
      params: httpParams,
      headers: this.getAuthHeaders(),
      withCredentials: true
    })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * Authenticated POST request
   */
  postAuth<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(this.configService.getApiUrl(endpoint), data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Authenticated PUT request
   */
  putAuth<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(this.configService.getApiUrl(endpoint), data, {
      headers: this.getAuthHeaders(),
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Authenticated DELETE request
   */
  deleteAuth<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(this.configService.getApiUrl(endpoint), {
      headers: this.getAuthHeaders(),
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      );
  }
}
