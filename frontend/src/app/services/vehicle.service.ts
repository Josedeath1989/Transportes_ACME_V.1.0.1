import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Vehicle, 
  VehicleCreate, 
  VehicleUpdate, 
  VehicleFilters, 
  VehicleResponse, 
  VehicleStats 
} from '../models/vehicle.model';
import { Conductor, Propietario } from '../models';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private endpoint = '/vehicles';

  constructor(private apiService: ApiService) { }

  /**
   * Get all vehicles with pagination and filters
   */
  getVehicles(filters?: VehicleFilters): Observable<ApiResponse<Vehicle[]>> {
    return this.apiService.getAuth<Vehicle[]>(this.endpoint, filters);
  }

  /**
   * Get vehicle by ID
   */
  getVehicle(id: number): Observable<ApiResponse<Vehicle>> {
    return this.apiService.getAuth<Vehicle>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new vehicle
   */
  createVehicle(vehicle: VehicleCreate): Observable<ApiResponse<Vehicle>> {
    return this.apiService.postAuth<Vehicle>(this.endpoint, vehicle);
  }

  /**
   * Update vehicle
   */
  updateVehicle(id: number, vehicle: VehicleUpdate): Observable<ApiResponse<Vehicle>> {
    return this.apiService.putAuth<Vehicle>(`${this.endpoint}/${id}`, vehicle);
  }

  /**
   * Delete vehicle (soft delete)
   */
  deleteVehicle(id: number): Observable<ApiResponse<Vehicle>> {
    return this.apiService.deleteAuth<Vehicle>(`${this.endpoint}/${id}`);
  }

  /**
   * Get vehicle statistics
   */
  getVehicleStats(): Observable<ApiResponse<VehicleStats>> {
    return this.apiService.getAuth<VehicleStats>(`${this.endpoint}/estadisticas`);
  }

  /**
   * Get conductors for vehicle assignment
   */
  getConductores(): Observable<ApiResponse<Conductor[]>> {
    return this.apiService.getAuth<Conductor[]>(`${this.endpoint}/conductores/lista`);
  }

  /**
   * Get propietarios for vehicle assignment
   */
  getPropietarios(): Observable<ApiResponse<Propietario[]>> {
    return this.apiService.getAuth<Propietario[]>(`${this.endpoint}/propietarios/lista`);
  }

  /**
   * Get recent vehicles for dashboard
   */
  getRecentVehicles(): Observable<ApiResponse<Vehicle[]>> {
    return this.apiService.getAuth<Vehicle[]>(`${this.endpoint}/recientes`);
  }

  /**
   * Validate placa format
   */
  validatePlaca(placa: string): boolean {
    const placaRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{3}\d{2}[A-Z]$/;
    return placaRegex.test(placa.toUpperCase());
  }

  /**
   * Format placa for display
   */
  formatPlaca(placa: string): string {
    return placa.toUpperCase();
  }

  /**
   * Get vehicle type label
   */
  getVehicleTypeLabel(tipo: 'particular' | 'publico'): string {
    return tipo === 'publico' ? 'Público' : 'Particular';
  }

  /**
   * Get vehicle type badge class
   */
  getVehicleTypeBadgeClass(tipo: 'particular' | 'publico'): string {
    return tipo === 'publico' ? 'badge-success' : 'badge-warning';
  }

  /**
   * Get vehicle status label
   */
  getVehicleStatusLabel(estado: 'activo' | 'inactivo'): string {
    return estado === 'activo' ? 'Activo' : 'Inactivo';
  }

  /**
   * Get vehicle status badge class
   */
  getVehicleStatusBadgeClass(estado: 'activo' | 'inactivo'): string {
    return estado === 'activo' ? 'badge-success' : 'badge-secondary';
  }
}
