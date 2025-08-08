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
      name: new FormControl('', Validators.required),
      license: new FormControl('', Validators.required)
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
