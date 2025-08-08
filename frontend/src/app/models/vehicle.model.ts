import { Conductor } from './conductor.model';
import { Propietario } from './propietario.model';

export interface Vehicle {
  id: number;
  placa: string;
  color: string;
  marca: string;
  tipo_vehiculo: 'particular' | 'publico';
  conductor_id: number;
  propietario_id: number;
  fecha_registro: string;
  estado: 'activo' | 'inactivo';
  conductor?: Conductor;
  propietario?: Propietario;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleCreate {
  placa: string;
  color: string;
  marca: string;
  tipo_vehiculo: 'particular' | 'publico';
  conductor_id: number;
  propietario_id: number;
}

export interface VehicleUpdate {
  placa?: string;
  color?: string;
  marca?: string;
  tipo_vehiculo?: 'particular' | 'publico';
  conductor_id?: number;
  propietario_id?: number;
}

export interface VehicleFilters {
  search?: string;
  tipo?: 'particular' | 'publico';
  page?: number;
  per_page?: number;
}

export interface VehicleResponse {
  success: boolean;
  data: Vehicle[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface VehicleStats {
  total_vehiculos: number;
  vehiculos_publicos: number;
  vehiculos_particulares: number;
  total_conductores: number;
  total_propietarios: number;
} 