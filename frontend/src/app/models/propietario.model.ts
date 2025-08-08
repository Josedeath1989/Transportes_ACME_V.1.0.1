export interface Propietario {
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
  estadisticas?: PropietarioStats;
  created_at?: string;
  updated_at?: string;
}

export interface PropietarioCreate {
  cedula: string;
  primer_nombre: string;
  segundo_nombre?: string;
  apellidos: string;
  direccion: string;
  telefono: string;
  ciudad: string;
}

export interface PropietarioUpdate {
  cedula?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  apellidos?: string;
  direccion?: string;
  telefono?: string;
  ciudad?: string;
}

export interface PropietarioFilters {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface PropietarioResponse {
  success: boolean;
  data: Propietario[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface PropietarioStats {
  total_vehiculos: number;
  vehiculos_publicos: number;
  vehiculos_particulares: number;
  placas_propiedad: string;
} 