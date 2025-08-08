export interface Conductor {
  id: number;
  cedula: string;
  primer_nombre: string;
  segundo_nombre?: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  ciudad: string;
  fecha_registro: string;
  estado: 'activo' | 'inactivo';
  nombre_completo?: string;
  cedula_formateada?: string;
  telefono_formateado?: string;
  estadisticas?: ConductorStats;
  created_at?: string;
  updated_at?: string;
}

export interface ConductorCreate {
  cedula: string;
  primer_nombre: string;
  segundo_nombre?: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  ciudad: string;
}

export interface ConductorUpdate {
  cedula?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  apellidos?: string;
  direccion?: string;
  telefono?: string;
  ciudad?: string;
}

export interface ConductorFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ConductorResponse {
  success: boolean;
  data: Conductor[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface ConductorStats {
  total_vehiculos: number;
  vehiculos_publicos: number;
  vehiculos_particulares: number;
  placas_asignadas: string;
} 