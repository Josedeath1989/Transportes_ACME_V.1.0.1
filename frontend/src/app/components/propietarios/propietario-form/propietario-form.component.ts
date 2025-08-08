import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-propietario-form',
  templateUrl: './propietario-form.component.html',
  styleUrls: ['./propietario-form.component.css']
})
export class PropietarioFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  loading = false;
  private apiUrl = `${environment.apiUrl}/propietarios`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<PropietarioFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    });

    if (this.data && this.data.propietario) {
      this.isEditMode = true;
      this.form.patchValue(this.data.propietario);
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
      this.http.put(`${this.apiUrl}/${this.data.propietario.id}`, formValue).subscribe({
        next: () => {
          this.toastr.success('Propietario actualizado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Error al actualizar propietario');
          this.loading = false;
        }
      });
    } else {
      this.http.post(this.apiUrl, formValue).subscribe({
        next: () => {
          this.toastr.success('Propietario creado correctamente');
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastr.error('Error al crear propietario');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
