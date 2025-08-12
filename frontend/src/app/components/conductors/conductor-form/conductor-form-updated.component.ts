import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConductorService } from '../../../services/conductor.service';
import { Conductor } from '../../../models/conductor.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-conductor-form-updated',
  templateUrl: './conductor-form-updated.component.html',
  styleUrls: ['./conductor-form-updated.component.css']
})
export class ConductorFormUpdatedComponent implements OnInit {
  @Input() conductor: Conductor | null = null;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Conductor>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private conductorService: ConductorService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.conductor) {
      this.form.patchValue(this.conductor);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      cedula: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^[A-Za-z0-9-]+$/)
      ]],
      primer_nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      segundo_nombre: ['', [
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      apellidos: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      telefono: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(20),
        Validators.pattern(/^[0-9+\-\s()]+$/)
      ]],
      direccion: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]],
      ciudad: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      estado: ['Cundinamarca', [Validators.required]],
      licencia: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20)
      ]]
    });
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
      if (field.errors['pattern']) {
        return 'Formato inválido';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.loading = true;
      this.errorMessage = null;
      const conductorData = this.form.value;
      
      const operation = this.isEditMode && this.conductor?.id
        ? this.conductorService.updateConductor(this.conductor.id, conductorData)
        : this.conductorService.createConductor(conductorData);

      operation.pipe(
        finalize(() => this.loading = false)
      ).subscribe({
        next: (conductor) => {
          this.save.emit(conductor);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al guardar conductor:', error);
          this.errorMessage = error.error?.message || 'Error al guardar el conductor';
        }
      });
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset();
    this.errorMessage = null;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
