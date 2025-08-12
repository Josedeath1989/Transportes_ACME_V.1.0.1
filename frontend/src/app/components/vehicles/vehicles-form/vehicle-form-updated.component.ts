import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VehicleService } from '../../../services/vehicle.service';
import { ConductorService } from '../../../services/conductor.service';
import { PropietarioService } from '../../../services/propietario.service';
import { Vehicle } from '../../../models/vehicle.model';
import { Conductor } from '../../../models/conductor.model';
import { Propietario } from '../../../models/propietario.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-vehicle-form-updated',
  templateUrl: './vehicle-form-updated.component.html',
  styleUrls: ['./vehicle-form-updated.component.css']
})
export class VehicleFormUpdatedComponent implements OnInit {
  @Input() vehicle: Vehicle | null = null;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Vehicle>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMessage: string | null = null;
  conductores: Conductor[] = [];
  propietarios: Propietario[] = [];
  
  tiposVehiculo = [
    { value: 'automovil', label: 'Automóvil' },
    { value: 'camioneta', label: 'Camioneta' },
    { value: 'camion', label: 'Camión' },
    { value: 'moto', label: 'Motocicleta' },
    { value: 'bus', label: 'Bus' },
    { value: 'tractor', label: 'Tractor' },
    { value: 'otro', label: 'Otro' }
  ];

  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'mantenimiento', label: 'En Mantenimiento' }
  ];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private conductorService: ConductorService,
    private propietarioService: PropietarioService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.loadConductores();
    this.loadPropietarios();
    
    if (this.isEditMode && this.vehicle) {
      this.form.patchValue(this.vehicle);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      placa: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(7),
        Validators.pattern(/^[A-Za-z0-9-]+$/)
      ]],
      color: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      marca: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s-]+$/)
      ]],
      tipo_vehiculo: ['', [Validators.required]],
      conductor_id: ['', [Validators.required]],
      propietario_id: ['', [Validators.required]],
      estado: ['activo', [Validators.required]]
    });
  }

  loadConductores(): void {
    this.vehicleService.getConductores().subscribe({
      next: (response) => {
        this.conductores = response.data || [];
      },
      error: (error) => {
        console.error('Error al cargar conductores:', error);
      }
    });
  }

  loadPropietarios(): void {
    this.vehicleService.getPropietarios().subscribe({
      next: (response) => {
        this.propietarios = response.data || [];
      },
      error: (error) => {
        console.error('Error al cargar propietarios:', error);
      }
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
      const vehicleData = this.form.value;
      
      const operation = this.isEditMode && this.vehicle?.id
        ? this.vehicleService.updateVehicle(this.vehicle.id, vehicleData)
        : this.vehicleService.createVehicle(vehicleData);

      operation.pipe(
        finalize(() => this.loading = false)
      ).subscribe({
        next: (response) => {
          this.save.emit(response.data);
          this.resetForm();
        },
        error: (error) => {
          console.error('Error al guardar vehículo:', error);
          this.errorMessage = error.error?.message || 'Error al guardar el vehículo';
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
