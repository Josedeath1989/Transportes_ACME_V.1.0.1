import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-conductor-form',
  templateUrl: './conductor-form.component.html',
  styleUrls: ['./conductor-form.component.css']
})
export class ConductorFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  loading = false;
  private apiUrl = `${environment.apiUrl}/conductores`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ConductorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      cedula: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,10}$/),
        Validators.maxLength(10)
      ]),
      primer_nombre: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),
      segundo_nombre: new FormControl('', [
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),
      direccion: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,15}$/),
        Validators.maxLength(15)
      ]),
      ciudad: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),
      estado: new FormControl('activo', Validators.required)
    });

    if (this.data && this.data.conductor) {
      this.isEditMode = true;
      this.form.patchValue(this.data.conductor);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    if (this.isEditMode) {
      this.http.put(`${this.apiUrl}/${this.data.conductor.id}`, formValue).subscribe({
        next: () => {
          this.toastr.success('Conductor actualizado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Error al actualizar conductor');
          this.loading = false;
        }
      });
    } else {
      this.http.post(this.apiUrl, formValue).subscribe({
        next: () => {
          this.toastr.success('Conductor creado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Error al crear conductor');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
