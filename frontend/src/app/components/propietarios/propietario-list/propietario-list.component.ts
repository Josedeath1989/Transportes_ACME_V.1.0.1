import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PropietarioService } from '../../../services/propietario.service';
import { Propietario } from '../../../models/propietario.model';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-propietario-list',
  templateUrl: './propietario-list.component.html',
  styleUrls: ['./propietario-list.component.css']
})
export class PropietarioListComponent implements OnInit, OnDestroy {
  propietarios: Propietario[] = [];
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
    private propietarioService: PropietarioService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadPropietarios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPropietarios(): void {
    this.loading = true;
    this.error = null;
    
    this.propietarioService.getPropietarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.propietarios = response.data;
          this.loading = false;
        },
        error: (error) => {
          this.error = this.getErrorMessage(error);
          this.loading = false;
          console.error('Error loading propietarios:', error);
        }
      });
  }

  openCreateModal(): void {
    this.modalService.openPropietarioModal();
  }

  openEditModal(propietario: Propietario): void {
    this.modalService.openPropietarioModal(propietario);
  }

  viewPropietario(propietario: Propietario): void {
    console.log('View propietario:', propietario);
    // Implementation depends on routing or modal service
  }

  openActionsModal(propietario: Propietario): void {
    const dialogRef = this.modalService.openCustomModal<any>(
      // Lazy load the new modal component
      import('../propietario-actions-modal/propietario-actions-modal.component').then(m => m.PropietarioActionsModalComponent),
      { propietario },
      '400px'
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'edit') {
        this.openEditModal(propietario);
      } else if (result === 'view') {
        this.viewPropietario(propietario);
      } else if (result === 'delete') {
        this.deletePropietario(propietario.id);
      }
    });
  }

  deletePropietario(id: number): void {
    const message = '¿Está seguro de eliminar este propietario? Esta acción no se puede deshacer.';
    
    if (confirm(message)) {
      this.propietarioService.deletePropietario(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadPropietarios();
          },
          error: (error) => {
            console.error('Error deleting propietario:', error);
            alert(this.getErrorMessage(error, 'Error al eliminar el propietario'));
          }
        });
    }
  }

  onPropietarioSaved(): void {
    this.loadPropietarios();
    this.modalService.closeAllModals();
  }

  private getErrorMessage(error: any, defaultMessage: string = 'Error al procesar la solicitud'): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.status === 404) {
      return 'Propietario no encontrado';
    }
    if (error?.status === 500) {
      return 'Error del servidor. Por favor, intente más tarde';
    }
    return defaultMessage;
  }

  retryLoad(): void {
    this.loadPropietarios();
  }
}
