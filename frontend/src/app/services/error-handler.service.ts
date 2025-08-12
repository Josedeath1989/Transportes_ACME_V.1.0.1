import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Ocurrió un error inesperado';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 422) {
        // Validation errors
        if (error.error.errors) {
          const errors = Object.values(error.error.errors).flat();
          errorMessage = errors.join('\n');
        } else {
          errorMessage = error.error.message || 'Error de validación';
        }
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
      } else if (error.status === 404) {
        errorMessage = 'Recurso no encontrado';
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
      } else {
        errorMessage = error.error.message || `Error ${error.status}: ${error.statusText}`;
      }
    }

    this.showError(errorMessage);
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}
