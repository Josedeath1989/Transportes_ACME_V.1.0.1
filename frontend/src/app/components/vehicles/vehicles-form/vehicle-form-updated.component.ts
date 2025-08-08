import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  loading = false;
  conductores: any[] = [];
  propietarios: any[] = [];
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<VehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.loadConductores();
    this.loadPropietarios();
    this.initializeForm();
    
    if (this.data && this.data.vehicle) {
      this.isEditMode = true;
      this.form.patchValue(this.data.vehicle);
    }
  }

  initializeForm(): void {
    this.form = new FormGroup({
      placa: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(/^[A-Za-z0-9-]+$/)
      ]),
      color: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]),
      marca: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z\s]+$/)
      ]),
      tipo_vehiculo: new FormControl('', Validators.required),
      conductor_id: new FormControl('', Validators.required),
      propietario_id: new FormControl('', Validators.required)
    });
  }

  loadConductores(): void {
    this.http.get(`${environment.apiUrl}/conductores`).subscribe({
      next: (response: any) => {
        this.conductores = response.data || response;
      },
      error: () => {
        this.toastr.error('Error al cargar conductores');
      }
    });
  }

  loadPropietarios(): void {
    this.http.get(`${environment.apiUrl}/propietarios`).subscribe({
      next: (response: any) => {
        this.propietarios = response.data || response;
      },
      error: () => {
        this.toastr.error('Error al cargar propietarios');
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

    if (this.isEditMode) {
      this.http.put(`${this.apiUrl}/${this.data.vehicle.id}`, formValue).subscribe({
        next: () => {
          this.toastr.success('Vehículo actualizado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Error al actualizar vehículo');
          this.loading = false;
        }
      });
    } else {
      this.http.post(this.apiUrl, formValue).subscribe({
        next: () => {
          this.toastr.success('Vehículo creado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Error al crear vehículo');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
