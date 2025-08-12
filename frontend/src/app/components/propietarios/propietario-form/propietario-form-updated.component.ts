import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropietarioService } from '../../../services/propietario.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { Propietario } from '../../../models/propietario.model';

@Component({
  selector: 'app-propietario-form-updated',
  templateUrl: './propietario-form.component.html',
  styleUrls: ['./propietario-form.component.css']
})
export class PropietarioFormUpdatedComponent implements OnInit {
  propietarioForm: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private propietarioService: PropietarioService,
    private errorHandler: ErrorHandlerService,
    public dialogRef: MatDialogRef<PropietarioFormUpdatedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { propietario?: Propietario }
  ) {
    this.propietarioForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.maxLength(20)]],
      primer_nombre: ['', [Validators.required, Validators.maxLength(50)]],
      segundo_nombre: ['', [Validators.maxLength(50)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      ciudad: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      fecha_nacimiento: ['']
    });

    if (this.data?.propietario) {
      this.isEditMode = true;
      this.propietarioForm.patchValue(this.data.propietario);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.propietarioForm.valid) {
      this.loading = true;
      
      const propietarioData = this.propietarioForm.value;
      
      if (this.isEditMode) {
        this.updatePropietario(propietarioData);
      } else {
        this.createPropietario(propietarioData);
      }
    }
  }

  private createPropietario(propietarioData: any): void {
    this.propietarioService.createPropietario(propietarioData).subscribe({
      next: (response) => {
        this.errorHandler.showSuccess('Propietario creado exitosamente');
        this.dialogRef.close(response.data);
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  private updatePropietario(propietarioData: any): void {
    if (!this.data?.propietario) return;
    
    this.propietarioService.updatePropietario(this.data.propietario.id, propietarioData).subscribe({
      next: (response) => {
        this.errorHandler.showSuccess('Propietario actualizado exitosamente');
        this.dialogRef.close(response.data);
      },
      error: (error) => {
        this.loading = false;
        this.errorHandler.handleError(error);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
