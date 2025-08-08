import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

// Import form components
import { ConductorFormComponent } from '../components/conductors/conductor-form/conductor-form.component';
import { PropietarioFormComponent } from '../components/propietarios/propietario-form/propietario-form.component';
import { VehicleFormComponent } from '../components/vehicles/vehicles-form/vehicle-form.component';

// Import modal component
import { ModalComponent } from '../components/shared/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  // Método genérico para abrir cualquier componente en modal
  openModal<T>(
    component: any,
    config: {
      width?: string;
      height?: string;
      data?: any;
      disableClose?: boolean;
      panelClass?: string;
    } = {}
  ): MatDialogRef<T> {
    const dialogConfig = {
      width: config.width || '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: ['custom-modal-container'].concat(config.panelClass ? [config.panelClass] : []),
      backdropClass: 'custom-backdrop',
      data: config.data || {},
      disableClose: config.disableClose || false,
      autoFocus: false,
      restoreFocus: true
    };

    return this.dialog.open(component, dialogConfig);
  }

  // Métodos específicos para cada formulario
  openConductorModal(data?: any): MatDialogRef<ConductorFormComponent> {
    return this.openModal<ConductorFormComponent>(ConductorFormComponent, {
      width: '600px',
      data: data || {}
    });
  }

  openPropietarioModal(data?: any): MatDialogRef<PropietarioFormComponent> {
    return this.openModal<PropietarioFormComponent>(PropietarioFormComponent, {
      width: '600px',
      data: data || {}
    });
  }

  openVehicleModal(data?: any): MatDialogRef<VehicleFormComponent> {
    return this.openModal<VehicleFormComponent>(VehicleFormComponent, {
      width: '700px',
      data: data || {}
    });
  }

  // Método para abrir modal con componente personalizado
  openCustomModal<T>(
    component: any,
    data?: any,
    width: string = '600px'
  ): MatDialogRef<T> {
    return this.openModal<T>(component, { width, data });
  }

  // Cerrar todos los modales
  closeAllModals(): void {
    this.dialog.closeAll();
  }

  // Cerrar modal específico
  closeModal(dialogRef: MatDialogRef<any>): void {
    dialogRef.close();
  }
}
