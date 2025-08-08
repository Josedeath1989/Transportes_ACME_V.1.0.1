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
  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<VehicleFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      year: new FormControl('', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())])
    });

    if (this.data && this.data.vehicle) {
      this.isEditMode = true;
      this.form.patchValue(this.data.vehicle);
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
