import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');
    
    // Configurar headers base
    const headers: any = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    // Agregar token si existe
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Clonar request con headers actualizados
    request = request.clone({
      setHeaders: headers,
      withCredentials: true // Importante para CORS con credenciales
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la petición:', error);
        
        if (error.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        } else if (error.status === 0) {
          console.error('Error de CORS o conexión:', error);
          console.error('Verifica que el backend esté corriendo en:', environment.apiUrl);
        } else if (error.status === 403) {
          console.error('Acceso prohibido:', error);
        }
        
        return throwError(() => error);
      })
    );
  }
}
