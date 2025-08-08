import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

// Import form components
import { ConductorFormComponent } from '../components/conductors/conductor-form/conductor-form.component';
import { PropietarioFormComponent } from '../components/propietarios/propietario-form/propietario-form.component';
import { VehicleFormComponent } from '../components/vehicles/vehicles-form/vehicle-form.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  openConductorModal(data?: any): MatDialogRef<ConductorFormComponent> {
    return this.dialog.open(ConductorFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-modal-container',
      backdropClass: 'custom-backdrop',
      data: data || {},
      autoFocus: false,
      restoreFocus: true
    });
  }

  openPropietarioModal(data?: any): MatDialogRef<PropietarioFormComponent> {
    return this.dialog.open(PropietarioFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-modal-container',
      backdropClass: 'custom-backdrop',
      data: data || {},
      autoFocus: false,
      restoreFocus: true
    });
  }

  openVehicleModal(data?: any): MatDialogRef<VehicleFormComponent> {
    return this.dialog.open(VehicleFormComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      panelClass: 'custom-modal-container',
      backdropClass: 'custom-backdrop',
      data: data || {},
      autoFocus: false,
      restoreFocus: true
    });
  }

  closeAllModals(): void {
    this.dialog.closeAll();
  }
}
