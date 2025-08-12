import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle.model';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit, OnDestroy {
  vehicles: Vehicle[] = [];
  loading = true;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private vehicleService: VehicleService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicles(): void {
    this.loading = true;
    this.error = null;
    
    this.vehicleService.getVehicles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vehicles = response.data;
          this.loading = false;
        },
        error: (error) => {
          this.error = this.getErrorMessage(error);
          this.loading = false;
          console.error('Error loading vehicles:', error);
        }
      });
  }

  openCreateModal(): void {
    this.modalService.openVehicleModal();
  }

  openEditModal(vehicle: Vehicle): void {
    this.modalService.openVehicleModal(vehicle);
  }

  deleteVehicle(id: number): void {
    const message = '¿Está seguro de eliminar este vehículo? Esta acción no se puede deshacer.';
    
    if (confirm(message)) {
      this.vehicleService.deleteVehicle(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadVehicles();
          },
          error: (error) => {
            console.error('Error deleting vehicle:', error);
            alert(this.getErrorMessage(error, 'Error al eliminar el vehículo'));
          }
        });
    }
  }

  onVehicleSaved(): void {
    this.loadVehicles();
    this.modalService.closeAllModals();
  }

  private getErrorMessage(error: any, defaultMessage: string = 'Error al procesar la solicitud'): string {
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.status === 404) {
      return 'Vehículo no encontrado';
    }
    if (error?.status === 500) {
      return 'Error del servidor. Por favor, intente más tarde';
    }
    return defaultMessage;
  }

  retryLoad(): void {
    this.loadVehicles();
  }
}
