import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Propietario } from '../../../models/propietario.model';

@Component({
  selector: 'app-propietario-actions-modal',
  templateUrl: './propietario-actions-modal.component.html',
  styleUrls: ['./propietario-actions-modal.component.css']
})
export class PropietarioActionsModalComponent {
  propietario: Propietario;

  constructor(
    public dialogRef: MatDialogRef<PropietarioActionsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.propietario = data.propietario;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    this.dialogRef.close('edit');
  }

  onView(): void {
    this.dialogRef.close('view');
  }

  onDelete(): void {
    this.dialogRef.close('delete');
  }
}
