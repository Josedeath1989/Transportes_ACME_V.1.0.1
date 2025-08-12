import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConductorService } from '../../../services/conductor.service';
import { Conductor } from '../../../models/conductor.model';
import { ModalService } from '../../../services/modal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-conductor-list',
  templateUrl: './conductor-list.component.html',
  styleUrls: ['./conductor-list.component.css']
})
export class ConductorListComponent implements OnInit, OnDestroy {
  conductores: Conductor[] = [];
  loading = true;
  error: string | null = null;
  displayedColumns: string[] = [
    'id',
    'cedula',
    'primer_nombre',
    'segundo_nombre',
    'apellidos',
    'direccion',
    'telefono',
    'ciudad',
    'estado',
    'fecha_registro',
    'actions'
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private conductorService: ConductorService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadConductores();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadConductores(): void {
    this.loading = true;
    this.error = null;
    
    this.conductorService.getConductores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.conductores = response.data;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.error = this.getErrorMessage(error);
          this.loading = false;
          console.error('Error loading conductores:', error);
        }
      });
  }

  openCreateModal(): void {
    this.modalService.openConductorModal();
  }

  openEditModal(conductor: Conductor): void {
    this.modalService.openConductorModal(conductor);
  }

  viewConductor(conductor: Conductor): void {
    console.log('Viewing conductor:', conductor);
  }

  deleteConductor(id: number): void {
    const message = '¿Está seguro de eliminar este conductor? Esta acción no se puede deshacer.';
    
    if (confirm(message)) {
      this.conductorService.deleteConductor(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadConductores();
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error deleting conductor:', error);
            alert(this.getErrorMessage(error, 'Error al eliminar el conductor'));
          }
        });
    }
  }

  onConductorSaved(): void {
    this.loadConductores();
    this.modalService.closeAllModals();
  }

  private getErrorMessage(error: HttpErrorResponse, defaultMessage: string = 'Error al procesar la solicitud'): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.status === 404) {
      return 'Conductor no encontrado';
    }
    if (error?.status === 500) {
      return 'Error del servidor. Por favor, intente más tarde';
    }
    return defaultMessage;
  }

  retryLoad(): void {
    this.loadConductores();
  }
}
